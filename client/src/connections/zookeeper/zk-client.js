var zookeeper = require("node-zookeeper-client");
import Logger from "@/utils/logger";

export class ZKClient {
  #zkUrl;
  #client;
  #logger;
  #timeout;

  constructor() {
    this.Event = zookeeper.Event;

    this.basePath = process.env.VUE_APP_ZK_BASE_NODE;
    this.#zkUrl = process.env.VUE_APP_ZK_URL;
    this.#timeout = process.env.VUE_APP_ZK_TIMEOUT;

    this.#logger = new Logger("ZKClient");
  }

  // INIT
  async connect(onConnect = () => {}, onDisconnect = () => {}) {
    this.#client = zookeeper.createClient(this.#zkUrl, {
      sessionTimeout: this.#timeout,
    });
    this.#client.connect();

    return new Promise((resolve, reject) => {
      this.#client.addListener("connected", () => {
        this.#logger.info("connect", this.#zkUrl + this.basePath);
        onConnect();
        resolve();
      });

      this.#client.addListener("disconnected", () => {
        this.#logger.error("disconnected", this.#zkUrl + this.basePath);
        onDisconnect();
        resolve();
      });

      setTimeout(() => {
        reject("ZK TIMEOUT");
      }, this.#timeout);
    })
      .then(() => {
        this.secureBaseNode();
      })
      .catch(e => this.handleError(e, "connect"));
  }

  async secureBaseNode() {
    if (!(await this.exists(""))) {
      await this.create("");
    }
  }

  async close() {
    await this.#client.close();
    this.#logger.info("close", this.#zkUrl + this.basePath);
  }

  // COMMON
  handleError(error, method) {
    if (error) {
      this.#logger.error(method, error);
      throw Error(error.stack);
    }
  }

  // NODES
  async create(path) {
    this.#logger.info("create", path);

    return new Promise((resolve, reject) => {
      this.#client.create(this.basePath + path, (error, path) => {
        this.handleError(error, "create");
        resolve();
      });
    });
  }

  async createEphemeral(path) {
    this.#logger.info("createEphemeral", path);

    return new Promise((resolve, reject) => {
      this.#client.create(
        this.basePath + path,
        zookeeper.CreateMode.EPHEMERAL,
        (error, path) => {
          this.handleError(error, "createEphemeral");
          resolve();
        }
      );
    });
  }

  async exists(path) {
    this.#logger.info("exists", path);

    return new Promise((resolve, reject) => {
      this.#client.exists(this.basePath + path, (error, stat) => {
        this.handleError(error, "exists");
        resolve(!!stat);
      });
    });
  }

  async getChildren(path) {
    this.#logger.info("getChildren", path);

    return new Promise((resolve, reject) => {
      this.#client.getChildren(
        this.basePath + path,
        (error, children, stats) => {
          this.handleError(error, "getChildren");
          resolve(children);
        }
      );
    });
  }

  async removeRecursive(path) {
    this.#logger.info("remove", path);

    return new Promise((resolve, reject) => {
      this.#client.removeRecursive(this.basePath + path, error => {
        this.handleError(error, "removeRecursive");
        resolve();
      });
    });
  }

  // DATA
  async getData(path, getDataWatcher = () => {}) {
    this.#logger.info("getData", path);

    return new Promise((resolve, reject) => {
      this.#client.getData(
        this.basePath + path,
        getDataWatcher,
        (error, data, stat) => {
          if (error && error.name !== "CONNECTION_LOSS")
            this.handleError(error, "getData");
          resolve(JSON.parse(data.toString())?.v);
        }
      );
    });
  }

  async setData(path, data) {
    this.#logger.info("setData", path + " " + data);

    return new Promise((resolve, reject) => {
      this.#client.setData(
        this.basePath + path,
        Buffer.from(JSON.stringify({ v: data })),
        (error, stat) => {
          this.handleError(error, "setData");
          resolve();
        }
      );
    });
  }
}

let zkClient = new ZKClient();

export { zkClient as default };
