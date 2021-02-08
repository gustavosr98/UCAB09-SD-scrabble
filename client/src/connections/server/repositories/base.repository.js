import httpClient from "../http-client";

export default class Repository {
  constructor(resourceName) {
    this.resourceName = resourceName;
    this.httpClient = httpClient;
  }

  async get(id) {
    return await httpClient.get(`/${this.resourceName}/${id}`);
  }
  async getMany(limit = 10, start = 1, resourceId) {
    return await httpClient.get(
      `${this.resourceName}?limit=${limit}&start=${start}${resourceId &&
        `&id=${resourceId}`}`
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
