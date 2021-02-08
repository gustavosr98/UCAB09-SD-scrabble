var zookeeper = require("node-zookeeper-client");

export default class ZKClient {
  constructor() {
    this.basePath = "/g5";
    this.client = zookeeper.createClient("zoo:2181", {
      sessionTimeout: process.env.VUE_APP_ZK_TIMEOUT,
    });
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
    this.client.create(this.basePath + path, function(error, path) {
      // this.handleError(error);
    });
  }

  getChildren(path) {
    this.client.getChildren(this.basePath + path, (error, children, stats) => {
      this.handleError(error);
      console.log("Children are: %j.", children);
    });
  }

  // DATA
  getData(path) {
    this.client.getData(this.basePath + path, (error, data, stat) => {
      this.handleError(error);
      return data;
    });
  }

  setData(path, data) {
    this.client.getData(this.basePath + path, data, (error, data, stat) => {
      this.handleError(error);
    });
  }
}

let zkClient = new ZKClient();

export { zkClient };
