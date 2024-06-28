import axios from "axios";
import { getToken } from "../../Utils/UpdateUsersState";

const createEvent = async (
  club,
  title,
  date,
  start_time,
  end_time,
  location,
  description,
  timezone
) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/event/?timezone=${timezone}`,
      {
        club,
        title,
        date,
        start_time,
        end_time,
        location,
        description,
      },
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

const getClubEvents = async (club_id, timezone) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/event/club/?club_id=${club_id}&timezone=${timezone}`,
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

const getUserEvents = async (timezone) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/event/user/?timezone=${timezone}`,
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

const deleteEvent = async (eventId) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/event/?event_id=${eventId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Token ${getToken()}`,
        },
      }
    );
    console.log(response);
    return response;
  } catch (e) {
    console.log(e);
  }
};

export { createEvent, getClubEvents, getUserEvents, deleteEvent };
