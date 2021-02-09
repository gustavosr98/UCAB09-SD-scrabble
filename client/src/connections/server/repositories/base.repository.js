import httpClient from "../http-client";

export default class Repository {
  constructor(resourceName) {
    this.resourceName = resourceName;
    this.httpClient = httpClient;
  }

  async get(id) {
    return await httpClient.get(`/${this.resourceName}/${id}`);
  }
  async getMany(limit = 10, page = 1) {
    return await httpClient.get(
      `${this.resourceName}?limit=${limit}&page=${page}`
    );
  }
  async create(resource) {
    return await httpClient.post(this.resourceName, resource);
  }
  async update(resource) {
    return await httpClient.patch(this.resourceName, resource);
  }
  async delete(resourceId) {
    return await httpClient.delete(`/${this.resourceName}/${resourceId}`);
  }
}
