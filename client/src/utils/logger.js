export default class Logger {
  constructor(baseName) {
    this.baseName = baseName;
  }

  _log(method, description, level) {
    const _level = level || "info";
    const _description = ` ${description}`;
    console[_level](
      `[${_level.toUpperCase()}] [${this.baseName}].${method}()${_description}`
    );
  }

  info(method, description) {
    this._log(method, description, "info");
  }

  debug(method, description) {
    this._log(method, description, "debug");
  }

  error(method, description) {
    this._log(method, description, "error");
  }
}
