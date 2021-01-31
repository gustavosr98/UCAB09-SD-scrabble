import httpClient from "../http-client";

export default class Repository {
  constructor(resourceName) {
    this.resourceName = resourceName;
  }

  async get(id) {
    return await httpClient.get(`/${resourceName}/${id}`);
  }
  async getMany(limit = 10, start = 1, resourceId) {
    return await httpClient.get(
      `${resourceName}?limit=${limit}&start=${start}${resourceId &&
        `&id=${resourceId}`}`
    );
  }
  async create(resource) {
    return await httpClient.post(resourceName, resource);
  }
  async update(resource) {
    return await httpClient.patch(resourceName, resource);
  }
  async delete(resourceId) {
    return await httpClient.delete(`/${resourceName}/${resourceId}`);
  }
}
