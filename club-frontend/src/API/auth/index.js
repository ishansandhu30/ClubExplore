import axios from "axios";
import { getToken } from "../../Utils/UpdateUsersState";
// import { getToken } from "../Utils/UpdateUsersState";

const login = async (code) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/auth/login/google/`,
      {
        data: code
      }
    );

    return res;
  } catch (e) {
    console.log(e);
  }
};

const test = async () => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/test/`,
      {
        headers: {
          Authorization: `Token ${getToken()}`,
        },
      }
    );
    return res;
  } catch (e) {
    console.log(e);
  }
};

export { login, test };
