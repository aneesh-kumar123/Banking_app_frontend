import BaseError from "./BaseError";

export default class NotFoundError extends BaseError {
  constructor(specificMessage) {
    super(404, specificMessage, "NotFoundError", "Not Found");
  }
}
