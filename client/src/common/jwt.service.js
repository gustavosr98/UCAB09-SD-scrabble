import { VueEasyJwt } from "vue-easy-jwt";
import SecureLS from "secure-ls";

const vueEasyJwt = new VueEasyJwt();
const ls = new SecureLS({
  isCompression: false,
  encryptionSecret: process.env.VUE_APP_ENCRYPTION_SECRET,
});
const ID_TOKEN_KEY = "id_token";

export default {
  getToken() {
    return ls.get(ID_TOKEN_KEY);
  },
  saveToken(token) {
    ls.set(ID_TOKEN_KEY, token);
  },
  destroyToken() {
    ls.remove(ID_TOKEN_KEY);
  },
  isTokenValid() {
    const token = getToken();
    return !!(token && !vueEasyJwt.isExpired(token));
  },
  getAuthHeaderToken() {
    return {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    };
  },
};
