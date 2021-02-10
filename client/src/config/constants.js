export const STATUS = Object.freeze({
  CREATED: 1,
  IN_PROGRESS: 2,
  FINISHED: 3,
});

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

export const LETTERS_DESTRIBUTION = Object.freeze({
  A: {
    count: 12,
    score: 1,
    letter: "A",
  },
  B: {
    count: 2,
    score: 3,
    letter: "B",
  },
  C: {
    count: 4,
    score: 3,
    letter: "C",
  },
  D: {
    count: 5,
    score: 2,
    letter: "D",
  },
  E: {
    count: 12,
    score: 1,
    letter: "E",
  },
  F: {
    count: 1,
    score: 4,
    letter: "F",
  },
  G: {
    count: 2,
    score: 2,
    letter: "G",
  },
  H: {
    count: 2,
    score: 4,
    letter: "H",
  },
  CH: {
    count: 1,
    score: 5,
    letter: "H",
  },
  I: {
    count: 6,
    score: 1,
    letter: "I",
  },
  J: {
    count: 1,
    score: 8,
    letter: "J",
  },
  L: {
    count: 4,
    score: 1,
    letter: "L",
  },
  LL: {
    count: 1,
    score: 8,
    letter: "LL",
  },
  M: {
    count: 2,
    score: 3,
    letter: "M",
  },
  N: {
    count: 5,
    score: 1,
    letter: "N",
  },
  Ñ: {
    count: 1,
    score: 8,
    letter: "Ñ",
  },
  O: {
    count: 9,
    score: 1,
    letter: "O",
  },
  P: {
    count: 2,
    score: 3,
    letter: "P",
  },
  Q: {
    count: 1,
    score: 5,
    letter: "Q",
  },
  R: {
    count: 5,
    score: 1,
    letter: "R",
  },
  RR: {
    count: 1,
    score: 8,
    letter: "RR",
  },
  S: {
    count: 6,
    score: 1,
    letter: "S",
  },
  T: {
    count: 4,
    score: 1,
    letter: "T",
  },
  U: {
    count: 5,
    score: 1,
    letter: "U",
  },
  V: {
    count: 1,
    score: 4,
    letter: "V",
  },
  X: {
    count: 1,
    score: 8,
    letter: "X",
  },
  Y: {
    count: 1,
    score: 4,
    letter: "Y",
  },
  Z: {
    count: 1,
    score: 10,
    letter: "Z",
  },
});

export const W3 = 4,
  L3 = 3,
  W2 = 2,
  L2 = 1,
  SS = 5,
  N0 = 0;

export const EMPTY_CELL = " ";
export const BOARD_SPECIAL_CASES = Object.freeze([
  [W3, N0, N0, L2, N0, N0, N0, W3, N0, N0, N0, L2, N0, N0, W3],
  [N0, W2, N0, N0, N0, L3, N0, N0, N0, L3, N0, N0, N0, W2, N0],
  [N0, N0, W2, N0, N0, N0, W2, N0, W2, N0, N0, N0, W2, N0, N0],
  [L2, N0, N0, W2, N0, N0, N0, W2, N0, N0, N0, W2, N0, N0, L2],
  [N0, N0, N0, N0, W2, N0, N0, N0, N0, N0, W2, N0, N0, N0, N0],
  [N0, L3, N0, N0, N0, L3, N0, N0, N0, L3, N0, N0, N0, L3, N0],
  [N0, N0, L2, N0, N0, N0, L2, N0, L2, N0, N0, N0, L2, N0, N0],
  [W3, N0, N0, L2, N0, N0, N0, SS, N0, N0, N0, L2, N0, N0, W3],
  [N0, N0, L2, N0, N0, N0, L2, N0, L2, N0, N0, N0, L2, N0, N0],
  [N0, L3, N0, N0, N0, L3, N0, N0, N0, L3, N0, N0, N0, L3, N0],
  [N0, N0, N0, N0, W2, N0, N0, N0, N0, N0, W2, N0, N0, N0, N0],
  [L2, N0, N0, W2, N0, N0, N0, W2, N0, N0, N0, W2, N0, N0, L2],
  [N0, N0, W2, N0, N0, N0, W2, N0, W2, N0, N0, N0, W2, N0, N0],
  [N0, W2, N0, N0, N0, L3, N0, N0, N0, L3, N0, N0, N0, W2, N0],
  [W3, N0, N0, L2, N0, N0, N0, W3, N0, N0, N0, L2, N0, N0, W3],
]);
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
