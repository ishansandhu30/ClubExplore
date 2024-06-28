import axios from "axios";
import { getToken } from "../../Utils/UpdateUsersState";

const getAllCategories = async () => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/category/`,
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

export { getAllCategories };
