import axios from "axios";
import { getToken } from "../../Utils/UpdateUsersState";

const getMembers = async (id) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/member/?club_id=${id}`,
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

const addMember = async (id, email) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/member/add/?club_id=${id}`,
      {
        method: "POST",
        body: JSON.stringify({
          email,
        }),
        headers: {
          Authorization: `Token ${getToken()}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response;
  } catch (e) {
    console.log(e);
  }
};

const promoteMember = async (club_id, member_id, role) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/member/promote/?member_id=${member_id}&club_id=${club_id}`,
      {
        method: "POST",
        body: JSON.stringify({
          role,
        }),
        headers: {
          Authorization: `Token ${getToken()}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response;
  } catch (e) {
    console.log(e);
  }
};

const demoteMember = async (club_id, member_id) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/member/demote/?member_id=${member_id}&club_id=${club_id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Token ${getToken()}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response;
  } catch (e) {
    console.log(e);
  }
};

const removeMember = async (club_id, member_id) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/member/remove/?club_id=${club_id}&member_id=${member_id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Token ${getToken()}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response;
  } catch (e) {
    console.log(e);
  }
};

export { getMembers, addMember, promoteMember, demoteMember, removeMember };
