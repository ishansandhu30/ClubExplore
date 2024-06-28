import axios from "axios";
import { getToken } from "../../Utils/UpdateUsersState";

const getClub = async (id) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/club/?club_id=${id}`,
      {
        headers: {
          Authorization: `Token ${getToken()}`,
        },
      }
    );
    return res;
  } catch (e) {
    return e;
  }
};

const getAllClubs = async () => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/club/`,
      {
        headers: {
          Authorization: `Token ${getToken()}`,
        },
      }
    );
    return res;
  } catch (e) {
    return e;
  }
};

const getUserClubs = async () => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/club/user/`,
      {
        headers: {
          Authorization: `Token ${getToken()}`,
        },
      }
    );
    return res;
  } catch (e) {
    return e;
  }
};

const createClub = async (formData, verificationCode) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/club/?verification_code=${verificationCode}`,
      formData,
      {
        headers: {
          Authorization: `Token ${getToken()}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res;
  } catch (e) {
    return e;
  }
};

const joinClubAPI = async (id) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/club/join/?club_id=${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Token ${getToken()}`,
        },
      }
    );

    return response;
  } catch (e) {
    console.log(e);
  }
};

const leaveClubAPI = async (id) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/club/leave/?club_id=${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Token ${getToken()}`,
        },
      }
    );

    return response;
  } catch (e) {
    console.log(e);
  }
};

const deleteClubAPI = async (id) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/club/?club_id=${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Token ${getToken()}`,
        },
      }
    );

    return response;
  } catch (e) {
    console.log(e);
  }
};

const modifyClub = async (formData, club_id) => {
  try {
    const res = await axios.patch(
      `${process.env.REACT_APP_BACKEND_URL}/api/club/?club_id=${club_id}`,
      formData,
      {
        headers: {
          Authorization: `Token ${getToken()}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res;
  } catch (e) {
    return e;
  }
};

export {
  getAllClubs,
  getUserClubs,
  createClub,
  getClub,
  joinClubAPI,
  leaveClubAPI,
  deleteClubAPI,
  modifyClub,
};
