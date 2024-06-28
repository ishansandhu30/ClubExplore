import { decryptText } from "./Encryption";

const updateUserStates = (setUserData, setUserToken) => {
  const localStorageItems = localStorage;
  let userData = {
    email: "",
    first_name: "",
    last_name: 0,
    profile: "",
    role: "",
  }
  let userToken = ""

  if (localStorageItems.length !== 0) {
    for (let key in localStorageItems) {
      if (localStorageItems[key] && decryptText(key) === "user") {
        localStorageItems[key] &&
          (userData = JSON.parse(decryptText(localStorageItems[key])));
      }

      if (localStorageItems[key] && decryptText(key) === "token") {
        localStorageItems[key] &&
          (userToken = decryptText(localStorageItems[key]));
      }
    }
    setUserData(userData)
    setUserToken(userToken)
  }
  return {data: userData, token: userToken}
};

const getToken = () => {
  const localStorageItems = localStorage;

  if (localStorageItems.length !== 0) {
    for (let key in localStorageItems) {
      if (localStorageItems[key] && decryptText(key) === "token") {
        return decryptText(localStorageItems[key]);
      }
    }
  }
  return null
};

const getUser = async () => {
  const localStorageItems = localStorage;

  if (localStorageItems.length !== 0) {
    for (let key in localStorageItems) {
      if (localStorageItems[key] && decryptText(key) === "user") {
        return JSON.parse(decryptText(localStorageItems[key]));
      }
    }
  }
  return {}
};

const handleLogout = (setUserData, setUserToken) => {
  const localStorageItems = localStorage;

  if (localStorageItems.length !== 0) {
    for (let key in localStorageItems) {
      if (localStorageItems[key] && decryptText(key) === "user") {
        localStorage.removeItem(key);
      }

      if (localStorageItems[key] && decryptText(key) === "token") {
        localStorage.removeItem(key);
      }
    }
    setUserData({ });
    setUserToken(null);
  }
};

export { handleLogout, getToken, getUser };
export default updateUserStates;
