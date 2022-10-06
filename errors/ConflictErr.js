/* eslint-disable linebreak-style */
class ConflictErr extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}
module.exports = ConflictErr;
