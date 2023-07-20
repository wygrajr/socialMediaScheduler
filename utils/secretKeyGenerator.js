const crypto = require('crypto');

const generateSecretKey = (length) => {
  return crypto.randomBytes(length).toString('hex');
};

module.exports = generateSecretKey;
