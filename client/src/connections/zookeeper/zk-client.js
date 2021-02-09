var zookeeper = require("node-zookeeper-client");
import Logger from "@/utils/logger";
export class ZKClient {
  #zkUrl;
  #client;
  #logger;
  #timeout;

  constructor() {
    this.basePath = "/g5";
    this.#zkUrl = process.env.VUE_APP_ZK_URL;
    this.#timeout = process.env.VUE_APP_ZK_TIMEOUT;

    this.#logger = new Logger("ZKClient");

    this.#client = zookeeper.createClient(this.#zkUrl, {
      sessionTimeout: this.#timeout,
    });

    this.connect();
  }

  // INIT
  async connect() {
    this.#client.connect();
    return new Promise((resolve, reject) => {
      this.#client.addListener("connected", () => {
        this.#logger.info("connect", this.#zkUrl + this.basePath);
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

  // DATA
  async getData(path) {
    this.#logger.info("getData", path);

    return new Promise((resolve, reject) => {
      this.#client.getData(this.basePath + path, (error, data, stat) => {
        this.handleError(error, "getData");
        resolve(JSON.parse(data.toString())?.v);
      });
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
