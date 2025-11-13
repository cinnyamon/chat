const crypto = require("crypto");

const encryptSymmetric = (key, plainText) => {
  const iv = crypto.randomBytes(12).toString("base64");
  const cipher = crypto.createCipheriv(
    "aes-256-gcm",
    Buffer.from(key, "base64"),
    Buffer.from(iv, "base64")
  );

  let cipherText = cipher.update(plainText, "utf8", "base64");
  cipherText += cipher.final("base64");

  const tag = cipher.getAuthTag();

  return {
    cipherText: cipherText,
    iv: iv.toString("base64"),
    tag: tag.toString("base64"),
  };
};

const decryptSymmetric = (key, cipherText, iv, tag) => {
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    Buffer.from(key, "base64"),
    Buffer.from(iv, "base64")
  );

  decipher.setAuthTag(Buffer.from(tag, "base64"));

  let plainText = decipher.update(cipherText, "base64", "utf8");
  plainText += decipher.final("utf8");

  return plainText;
};

module.exports = { encryptSymmetric, decryptSymmetric };
