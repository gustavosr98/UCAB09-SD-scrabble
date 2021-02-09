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
  USER_NOT_FOUND:
    "El usuario no se encuentra registrado en la aplicación",
  // REGISTER
  EMAIL_TAKEN: "El correo electrónico ya se encuentra registrado",
  // RANKING
  // PLAY
  // PROFILE
});

export const HTTP_ERROR_CODES = Object.freeze({
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
});
