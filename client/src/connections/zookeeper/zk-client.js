var zookeeper = require("node-zookeeper-client");

export default class ZKClient {
  constructor() {
    this.basePath = "/g5/";
    this.client = zookeeper.createClient(process.env.VUE_APP_ZK_URL, {
      sessionTimeout: process.env.VUE_APP_ZK_TIMEOUT,
    });
    this.connect();
  }

  connect() {
    this.client.connect();
  }

  // COMMON
  handleError(error) {
    if (error) {
      console.log(error.stack);
      throw Error(error.stack);
    }
  }

  // NODES
  create(path) {
    this.client.create(this.basePath + path, (error, path) => {
      this.handleError(error);
    });
  }

  getChildren(path) {
    this.client.getChildren(this.basePath + path, (error, children, stats) => {
      console.log(this.basePath + path);
      this.handleError(error);
      console.log("Children are: %j.", children);
    });
  }

  // DATA
  getData(path) {
    this.client.getData(this.basePath + path, (error, data, stat) => {
      this.handleError(error);
      return Buffer.from(data);
    });
  }

  setData(path, data) {
    this.client.setData(
      this.basePath + path,
      Buffer.from(JSON.stringify(data)),
      (error, stat) => {
        this.handleError(error);
      }
    );
  }
}

let zkClient = new ZKClient();

export { zkClient };
