import CryptoJS from "crypto-js";

const encryptText = (text) => {
  try {
    return CryptoJS.AES.encrypt(
      text,
      process.env.REACT_APP_ENCRYPTION_SECRET
    ).toString();
  } catch (e) {
    console.log(e);
  }
};

const decryptText = (text) => {
  try {
    if (!text) return;
    const decryptedBytes = CryptoJS.AES.decrypt(
      text,
      process.env.REACT_APP_ENCRYPTION_SECRET
    );
    return decryptedBytes?.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    console.log(e);
  }
};

export { encryptText, decryptText };
