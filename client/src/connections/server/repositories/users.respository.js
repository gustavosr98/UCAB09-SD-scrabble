import Repository from "./base.repository";

export default class UsersRepository extends Repository {
  constructor() {
    super("users");
  }

  async authorize(payload) {
    return this.httpClient.post("authorize", payload);
  }

  async register(payload) {
    return this.create(payload);
  }

  async getRanking(limit = 10, page = 1, username = '') {
    return await this.httpClient.get(`users/users/ranking?limit=${limit}&page=${page}&username=${username}`);
  }

  async getUserGame(idUser, idGame) {
    return await this.httpClient.get(`user-game/users/${idUser}/games/${idGame}`);
  }
}
