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
}
