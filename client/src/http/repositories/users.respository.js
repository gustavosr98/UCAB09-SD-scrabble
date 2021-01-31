import Repository from "./base.repository";

export default class UsersRepository extends Repository {
  constructor() {
    super("users");
  }

  async authorize(payload) {
    return httpClient.post("authorize", payload);
  }
}
