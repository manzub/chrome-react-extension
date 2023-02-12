import CryptoJS from "crypto-js";

const secretPass = "XkhZG4fW2t2W";

export const encryptData = (text) => {
  const data = CryptoJS.AES.encrypt(
    JSON.stringify(text),
    secretPass
  ).toString();

  return data;
}

export const decryptData = (encryptedText) => {
  const bytes = CryptoJS.AES.decrypt(encryptedText, secretPass);
  const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return data;
};