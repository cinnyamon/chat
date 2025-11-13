const { decryptSymmetric } = require("./cryptography");

const CRYPT_KEY = process.env.CRYPT_KEY;

function decryptMessages(message) {
  message.text = decryptSymmetric(
    CRYPT_KEY,
    message.text,
    message.metadata.iv,
    message.metadata.tag
  );

  return message;
}

module.exports = { decryptMessages };
