export const STATUS = Object.freeze({});

export const APP_SECTIONS = Object.freeze({
  LOGIN: 1,
  RANKING: 2,
  PLAY: 3,
  PROFILE: 4,
});

export const ERROR_CODES = Object.freeze({
  // GLOBAL
  SERVER_ERROR: "Ocurrió un error inesperado",
  // LOGIN
  NOT_MATCHING_PASSWORD: "La contraseña introducida no coincide",
  INCORRECT_PASSWORD: "Las credenciales que introdujo son incorrectas",
  USER_NOT_FOUND: "El usuario no se encuentra registrado en la aplicación",
  // REGISTER
  USERNAME_TAKEN:
    "El nombre de usuario introducido ya se encuentra registrado en la aplicación",
  // RANKING
  // PLAY
  // PROFILE
});

export const HTTP_ERROR_CODES = Object.freeze({
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
});

export const ROOM_STATUS = Object.freeze({
  CREATED: "CREATED",
  IN_PROGRESS: "IN_PROGRESS",
  FINISHED: "FINISHED",
  CANCELLED: "CANCELLED",
});

export const MOVE_TYPE = Object.freeze({
  PLAY: "PLAY",
  PASS: "PASS",
  CHANGE_TOKENS: "CHANGE_TOKENS",
});
