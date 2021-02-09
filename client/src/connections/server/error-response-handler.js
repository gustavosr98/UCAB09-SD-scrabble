import store from "@/store";
import router from "@/router";
import { HTTP_ERROR_CODES } from "@/config/constants";

const errorResponseHandler = e => {
  if (!!e.config["errorHandle"] && e.config.errorHandle === false) {
    return Promise.reject(e);
  }

  const error = e.response.data;

  store.commit("http/setNewError", error);

  if (
    e.response.status == HTTP_ERROR_CODES.FORBIDDEN ||
    e.response.status == HTTP_ERROR_CODES.UNAUTHORIZED
  ) {
    router.push("/");
  }

  return Promise.reject(e);
};

export default errorResponseHandler;
