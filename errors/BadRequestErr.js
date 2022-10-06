/* eslint-disable linebreak-style */
class BadRequestErr extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}
module.exports = BadRequestErr;
