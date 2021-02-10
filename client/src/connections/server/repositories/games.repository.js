import Repository from "./base.repository";

export default class GamesRepository extends Repository {
  constructor() {
    super("games");
  }

  async getGames(limit, page) {
    return this.getMany(limit, page);
  }

  async createGame(game) {
    return this.create(game);
  }

  async getGame(id) {
    return this.get(id);
  }

  async getGameWithUsers(id) {
    return await this.httpClient.get(`games/${id}/users`);
  }
}
