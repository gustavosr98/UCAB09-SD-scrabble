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
  NON_EXISTING_EMAIL: "El correo electrónico no existe",
  NOT_MATCHING_PASSWORD: "Las contraseñas no coinciden",
  INCORRECT_PASSWORD: "Credenciales incorrectas",
  EMAIL_TAKEN: "El correo electrónico ya se encuentra registrado",
  USER_NOT_FOUND:
    "El usuario no se encuentra registrado en la aplicación o no ha sido confirmado el correo electrónico",
  // RANKING
  // PLAY
  // PROFILE
});

export const HTTP_ERROR_CODES = Object.freeze({
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
});
