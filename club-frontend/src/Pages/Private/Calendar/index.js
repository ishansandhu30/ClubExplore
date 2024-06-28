import React, { useEffect, useState } from "react";
import "./style.css";
import { Select, Calendar, Modal, Spin, Button, notification } from "antd";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import RoomIcon from "@mui/icons-material/Room";
import "../../../Components/Modal/modal.css";
import { deleteEvent, getUserEvents } from "../../../API/Event";
import { getUserClubs } from "../../../API/Clubs";
import { getAllCategories } from "../../../API/Category";
import { DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const CalendarComponent = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [clubs, setClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [data, setData] = useState({});

  const navigate = useNavigate();

  function getTimezone() {
    const dates = new Date();
    return -dates.getTimezoneOffset() / 60;
  }

  useEffect(() => {
    const fetchUserEvents = async () => {
      try {
        setLoading(true);

        const time_zone = getTimezone();

        const res = await getUserEvents(time_zone);
        setData(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching clubs:", error);
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await getAllCategories();
        setCategories(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching clubs:", error);
        setLoading(false);
      }
    };

    const fetchUserClubs = async () => {
      try {
        setLoading(true);
        const res = await getUserClubs();
        setClubs(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching clubs:", error);
        setLoading(false);
      }
    };

    fetchUserEvents();
    fetchCategories();
    fetchUserClubs();
  }, []);

  const handleModalOpen = (eventId, selectedDate) => {
    const eventDetails = data[selectedDate]?.find(
      (event) => event.id === eventId
    );
    setSelectedEvent(eventDetails);
  };

  const handleChangeClub = (value) => {
    const selectedClub = clubs.find((club) => club.value === value);
    setSelectedClub(selectedClub);
  };

  const handleChangeCategory = (value) => {
    const selectedCategory = categories.find(
      (category) => category.value === value
    );
    setSelectedCategory(selectedCategory);
  };

  const dateCellRender = (value) => {
    const date = value.format("DDMMYYYY");

    const selectedClubId = selectedClub?.id;
    const selectedCategoryId = selectedCategory?.value;

    let filteredEvents = data[date];

    if (selectedClubId && selectedCategoryId) {
      filteredEvents = filteredEvents?.filter(
        (item) =>
          item.club_id === selectedClubId &&
          item.category_id === selectedCategoryId
      );
    } else if (selectedClubId) {
      filteredEvents = filteredEvents?.filter(
        (item) => item.club_id === selectedClubId
      );
    } else if (selectedCategoryId) {
      filteredEvents = filteredEvents?.filter(
        (item) => item.category_id === selectedCategoryId
      );
    }

    return (
      <ul className="events">
        {filteredEvents?.map((item) => (
          <li
            key={item.id}
            style={{ backgroundColor: item.color }}
            onClick={() => {
              handleModalOpen(item.id, date);
            }}
          >
            {item.title}
          </li>
        ))}
      </ul>
    );
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    const res = await deleteEvent(id);
    console.log(res);
    if (Math.floor(res?.status / 100) === 2) {
      notification.success({
        message: "Event Deleted",
      });
      setTimeout(function () {
        window.location.reload();
      }, 2000);
    } else {
      const data = await res.json();
      notification.error({
        message: "Invalid Request",
        description: data?.error,
      });
    }
    handleCloseModal();
    setLoading(false);
  };

  return (
    <div className="calendar-page">
      <div className="page-title">
        <span>Events Calendar</span>
      </div>
      <div className="calendar">
        <div className="dropdown-wrapper">
          <Select
            showSearch
            style={{
              marginRight: "18px",
            }}
            placeholder="Clubs"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").includes(input)
            }
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            onChange={handleChangeClub}
            options={clubs}
          />
          <Select
            showSearch
            placeholder="Categories"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").includes(input)
            }
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            onChange={handleChangeCategory}
            options={categories}
          />
        </div>
        {loading ? (
          <div className="center">
            <Spin size="large" />
          </div>
        ) : (
          <Calendar dateCellRender={dateCellRender} />
        )}
      </div>

      <Modal
        visible={!!selectedEvent}
        onCancel={handleCloseModal}
        footer={null}
        centered
      >
        {selectedEvent && (
          <div className="modal-content">
            <div className="modal-title">
              <div className="title-wrap">
                <div
                  className="circle"
                  style={{ backgroundColor: selectedEvent.color }}
                ></div>
                <span className="title">{selectedEvent.title}</span>
              </div>
              <span className="date">{selectedEvent.date}</span>
            </div>
            <div className="wrap">
              <WatchLaterIcon />
              <span className="wrap-text">{selectedEvent.time}</span>
            </div>
            <div className="wrap">
              <RoomIcon />
              <span className="wrap-text">{selectedEvent.location}</span>
            </div>
            <div className="wrap">
              <FormatAlignLeftIcon />
              <span className="wrap-text">
                {selectedEvent.eventDescription}
              </span>
            </div>
            <Button
              icon={<DeleteOutlined />}
              style={{ width: "100%" }}
              onClick={() => {
                handleDelete(selectedEvent?.id);
              }}
              loading={loading}
            >
              Delete Event
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CalendarComponent;
