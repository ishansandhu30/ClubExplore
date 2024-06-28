import React, { useEffect, useState } from "react";
import {
  Calendar,
  Dropdown,
  Form,
  Input,
  Modal,
  Tabs,
  Upload,
  DatePicker,
  TimePicker,
  notification,
  Spin,
} from "antd";
import { Button, Select, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import RoomIcon from "@mui/icons-material/Room";
import "./style.css";
import TabPane from "antd/es/tabs/TabPane";
import profilePicture from "../../../Assets/images/Profile Pic.png";
import { BsThreeDots } from "react-icons/bs";
import {
  UploadOutlined,
  DeleteOutlined,
  UsergroupAddOutlined,
  LogoutOutlined,
  MailOutlined,
  VerifiedOutlined,
} from "@ant-design/icons";
import "../../../Components/Modal/modal.css";
import LocalBarIcon from "@mui/icons-material/LocalBar";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TextArea from "antd/es/input/TextArea";
import { getAllCategories } from "../../../API/Category";
import {
  deleteClubAPI,
  getClub,
  leaveClubAPI,
  modifyClub,
} from "../../../API/Clubs";
import { useNavigate, useParams } from "react-router-dom";
import {
  addMember,
  demoteMember,
  getMembers,
  promoteMember,
  removeMember,
} from "../../../API/Member";

import { createEvent, deleteEvent, getClubEvents } from "../../../API/Event";

const SpecificClub = () => {
  const [isModalVisible2, setIsModalVisible2] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [clubDetails, setClubDetails] = useState({});
  const [members, setMembers] = useState([]);

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingLeave, setLoadingLeave] = useState(false);
  const [currentClub, setCurrentClub] = useState({});

  const [data, setData] = useState({});

  const editOptions = [
    {
      key: "1",
      label: "Promote",
      children: [
        {
          key: "1-1",
          label: "President",
        },
        {
          key: "1-2",
          label: "Vice President",
        },
        {
          key: "1-3",
          label: "Secretary",
        },
        {
          key: "1-4",
          label: "Treasurer",
        },
      ],
    },
    {
      key: "2",
      label: "Demote",
    },
    {
      key: "3",
      label: "Remove",
    },
  ];

  const { club_id } = useParams();
  const navigate = useNavigate();
  const [clubForm] = Form.useForm();
  const [eventForm] = Form.useForm();

  useEffect(() => {
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

    const fetchClubDetails = async () => {
      try {
        const res = await getClub(club_id);
        setLoading(true);
        setClubDetails(res.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    const fetchMembers = async () => {
      try {
        setLoading(true);
        const res = await getMembers(club_id);
        setMembers(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching clubs:", error);
        setLoading(false);
      }
    };

    const fetchClubEvents = async () => {
      try {
        setLoading(true);

        const time_zone = getTimezone();

        const res = await getClubEvents(club_id, time_zone);
        setData(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching clubs:", error);
        setLoading(false);
      }
    };

    fetchClubEvents();
    fetchMembers();
    fetchClubDetails();
    fetchCategories();
  }, []);

  const handleModalOpen = (eventId, selectedDate) => {
    const eventDetails = data[selectedDate]?.find(
      (event) => event.id === eventId
    );
    setSelectedEvent(eventDetails);
  };

  const dateCellRender = (value) => {
    const date = value.format("DDMMYYYY");
    return (
      <ul className="events">
        {data[date]?.map((item) => (
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

  const leaveClub = async (id) => {
    setLoadingLeave(true);
    const res = await leaveClubAPI(id);
    console.log(res);
    if (Math.floor(res?.status / 100) === 2) {
      notification.success({
        message: "Club Left",
        description: `You are no more a member of the club ${clubDetails?.title}`,
      });
      navigate("/home");
    } else {
      const data = await res.json();
      notification.error({
        message: "Invalid Request",
        description: data?.error,
      });
    }
    setLoadingLeave(false);
  };

  const deleteClub = async (id) => {
    setLoadingLeave(true);
    const res = await deleteClubAPI(id);
    console.log(res);
    if (Math.floor(res?.status / 100) === 2) {
      notification.success({
        message: "Club Deleted",
        description: `Successful deletion of the club ${clubDetails?.title}`,
      });
      navigate("/home");
    } else {
      const data = await res.json();
      notification.error({
        message: "Invalid Request",
        description: data?.error,
      });
    }
    setLoadingLeave(false);
  };

  const onFinish = async (values) => {
    console.log(values, "Values submitted");
    if (currentClub?.banner) {
      try {
        setLoading(true);

        const formData = new FormData();

        formData.append("title", values?.title);
        formData.append("description", values?.description);
        formData.append("category", values?.category);
        formData.append("banner", currentClub?.banner);

        console.log(formData, "Form generated");

        const response = await modifyClub(formData, club_id);

        if (Math.floor(response?.status / 100) === 2) {
          message.success("Club Edited successfully");
          setLoading(false);
          setCurrentClub({});
          setIsModalVisible2(false);
        } else {
          message.error("Failed to Edit club");
          setLoading(false);
          setCurrentClub({});
        }
      } catch (error) {
        console.error("Error creating club:", error);
        setLoading(false);
        setCurrentClub({});
      }

      setTimeout(function () {
        window.location.reload();
      }, 2000);
    } else {
      notification.error({
        message: "Invalid Banner",
        description: "Kindly upload the banner for the club",
      });
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleUpload = (info) => {
    if (info.file.status !== "uploading") {
      console.log("info", info);
      console.log("info.file:", info.file);
      console.log("info.fileList", info.fileList);
      message.success(`${info.file.name} file uploaded successfully`);

      setCurrentClub({ ...currentClub, banner: info?.file });
      clubForm.setFieldValue("banner", info?.file);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  function getTimezone() {
    const dates = new Date();
    return -dates.getTimezoneOffset() / 60;
  }

  const onFinishEventCreation = async (values) => {
    console.log("Received values:", values);

    const timezone = getTimezone();
    console.log(timezone);

    const date = values?.date.format("YYYY-MM-DD");

    console.log(date);

    const startTime =
      values?.startTime["$H"] + ":" + values?.startTime["$m"] + ":00";

    const endTime = values?.endTime["$H"] + ":" + values?.endTime["$m"] + ":00";

    console.log("Formatted Date:", date);
    console.log("Formatted Start Time:", startTime);
    console.log("Formatted End Time:", endTime);

    try {
      setLoading(true);

      const res = await createEvent(
        club_id,
        values?.eventTitle,
        date,
        startTime,
        endTime,
        values?.location,
        values?.description,
        timezone
      );

      if (Math.floor(res.status / 100) === 2) {
        message.success("Event Created successfully");
        setLoading(false);

        eventForm.resetFields();

        setTimeout(function () {
          window.location.reload();
        }, 2000);
      } else {
        message.error("Failed to Create Event");
        setLoading(false);
      }
    } catch (e) {
      notification.error({
        message: "Error Occured, Please Try Again",
      });
      setLoading(false);
    }

    setIsModalVisible(false);
  };

  const imageError = (e) => {
    e.target.src = profilePicture;
  };

  const showModal2 = () => {
    setIsModalVisible2(true);
  };

  const handleCancel2 = () => {
    setIsModalVisible2(false);
  };

  const onFinishAddMember = async (values) => {
    setLoadingLeave(true);
    console.log(values.memberEmail);
    const res = await addMember(club_id, values.memberEmail);
    console.log(res);
    if (Math.floor(res?.status / 100) === 2) {
      notification.success({
        message: `New Member added in Club`,
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
    setLoadingLeave(false);

    setIsModalVisible2(false);
  };

  const promoteFunction = async (club_id, member_id, role) => {
    setLoading(true);

    const res = await promoteMember(club_id, member_id, role);
    console.log(res);
    if (Math.floor(res?.status / 100) === 2) {
      notification.success({
        message: `Member Promoted to ${role}`,
      });
      setTimeout(function () {
        window.location.reload();
      }, 2000);
    } else {
      const data = await res?.json();
      notification.error({
        message: "Invalid Request",
        description: data?.error,
      });
    }
    setLoading(false);
  };

  const promote = async (member_id, role_id) => {
    switch (role_id) {
      case "1":
        promoteFunction(club_id, member_id, "President");

        break;
      case "2":
        promoteFunction(club_id, member_id, "Vice President");

        break;

      case "3":
        promoteFunction(club_id, member_id, "Secretary");

        break;
      case "4":
        promoteFunction(club_id, member_id, "Treasurer");

        break;
      default:
        console.error("Invalid role_id:", role_id);
    }
  };

  const demote = async (member_id) => {
    setLoading(true);

    const res = await demoteMember(club_id, member_id);
    console.log(res);
    if (Math.floor(res?.status / 100) === 2) {
      notification.success({
        message: `Member Demoted`,
      });
      setTimeout(function () {
        window.location.reload();
      }, 2000);
    } else {
      const data = await res?.json();
      notification.error({
        message: "Invalid Request",
        description: data?.error,
      });
    }
    setLoading(false);
  };

  const remove = async (member_id) => {
    setLoading(true);

    const res = await removeMember(club_id, member_id);
    console.log(res);
    if (Math.floor(res?.status / 100) === 2) {
      notification.success({
        message: `Member Removed`,
      });
      setTimeout(function () {
        window.location.reload();
      }, 2000);
    } else {
      const data = await res?.json();
      notification.error({
        message: "Invalid Request",
        description: data?.error,
      });
    }
    setLoading(false);
  };

  const handleChangeMemberRole = (key, id) => {
    if (key === "2") {
      demote(id);
    } else if (key === "3") {
      remove(id);
    } else {
      promote(id, key[key?.length - 1]);
    }
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
    <div className="specific-club">
      <div className="page-title-wrapper">
        <span className="page-title">{clubDetails.title}</span>
        <Button icon={<PlusOutlined />} onClick={showModal}>
          Add Event
        </Button>
      </div>

      <div className="tabs-container">
        <Tabs defaultActiveKey="1">
          <TabPane tab="Events" key="1">
            <div className="calendar">
              {loading ? (
                <div className="center">
                  <Spin size="large" />
                </div>
              ) : (
                <Calendar dateCellRender={dateCellRender} />
              )}
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
                      <span className="wrap-text">
                        {selectedEvent.location}
                      </span>
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
          </TabPane>
          <TabPane tab="Members" key="2">
            {loading ? (
              <div className="center">
                <Spin size="large" />
              </div>
            ) : (
              <div className="members-wrapper">
                {members.map((member, index) => (
                  <div className="member-row" key={index}>
                    <div className="left-wrap">
                      <div className="member-img-wrapper">
                        <img
                          src={member?.image}
                          alt="member-img"
                          onError={imageError}
                        />
                      </div>
                      <span className="member-name">{member?.name}</span>
                    </div>
                    <div className="role-wrapper">
                      <span className="member-role">{member?.role}</span>
                      <Dropdown
                        loading={loadingLeave}
                        trigger="click"
                        menu={{
                          items: editOptions,
                          onClick: (e) => {
                            handleChangeMemberRole(e.key, member?.id);
                          },
                        }}
                        placement="bottom"
                      >
                        <div className="options" style={{ height: "30px" }}>
                          <BsThreeDots size={30} />
                        </div>
                      </Dropdown>
                    </div>
                  </div>
                ))}
                <div className="add-member">
                  <Button onClick={showModal2} icon={<UsergroupAddOutlined />}>
                    Add Member
                  </Button>
                </div>
              </div>
            )}

            <Modal
              title="Add Member"
              visible={isModalVisible2}
              onCancel={handleCancel2}
              footer={null}
              centered
            >
              <Form
                name="addMemberForm"
                onFinish={onFinishAddMember}
                layout="vertical"
              >
                <div className="wrap-mini-modal">
                  <Form.Item
                    label="Member Email"
                    name="memberEmail"
                    rules={[
                      { required: true, message: "Please input member email" },
                    ]}
                  >
                    <Input type="email" placeholder="Email" />
                  </Form.Item>{" "}
                </div>
                <div>
                  <Form.Item>
                    <Button
                      icon={<MailOutlined />}
                      type="primary"
                      htmlType="submit"
                      loading={loadingLeave}
                    >
                      Invite
                    </Button>
                  </Form.Item>
                </div>
              </Form>
            </Modal>
          </TabPane>
          <TabPane tab="Settings" key="3">
            <div className="settings">
              <Form
                name="clubForm"
                initialValues={{
                  title: clubDetails?.title,
                  description: clubDetails?.description,
                  category: clubDetails?.category,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                layout="vertical"
              >
                <div className="page-title-wrapper">
                  <span className="title">Club Information</span>
                  <Form.Item>
                    <Button loading={loading} type="primary" htmlType="submit">
                      Save
                    </Button>
                  </Form.Item>
                </div>

                <Form.Item
                  label="Club Name"
                  name="title"
                  rules={[
                    { required: true, message: "Please input the club name!" },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Club Description"
                  name="description"
                  rules={[
                    {
                      required: true,
                      message: "Please input the club description!",
                    },
                  ]}
                >
                  <Input.TextArea rows={8} />
                </Form.Item>
                <div className="form-footer">
                  <Form.Item
                    label="Category"
                    name="category"
                    rules={[
                      {
                        required: true,
                        message: "Please select the club category!",
                      },
                    ]}
                  >
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
                      options={categories}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Club Banner"
                    name="banner"
                    valuePropName="fileList"
                    getValueFromEvent={handleUpload}
                  >
                    <Upload
                      name="bannerPic"
                      beforeUpload={() => false}
                      listType="picture"
                    >
                      <Button icon={<UploadOutlined />}>Upload Banner</Button>
                    </Upload>
                  </Form.Item>
                </div>
              </Form>
            </div>

            <div className="setting-footer">
              <Button
                loading={loadingLeave}
                onClick={() => {
                  deleteClub(club_id);
                }}
                icon={<DeleteOutlined />}
              >
                Delete Club
              </Button>
              <Button
                loading={loadingLeave}
                onClick={() => {
                  leaveClub(club_id);
                }}
                icon={<LogoutOutlined />}
              >
                Leave Club
              </Button>
            </div>
          </TabPane>
        </Tabs>
      </div>

      <Modal
        title="Add New Event"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        centered
      >
        <Form
          name="addEventForm"
          onFinish={onFinishEventCreation}
          initialValues={{ date: null, startTime: null, endTime: null }}
          form={eventForm}
        >
          <div className="wrap">
            <LocalBarIcon />
            <Form.Item
              name="eventTitle"
              rules={[
                { required: true, message: "Please input the event title!" },
              ]}
            >
              <Input placeholder="Event Title" />
            </Form.Item>{" "}
          </div>

          <div className="wrap">
            <CalendarMonthIcon />

            <Form.Item
              name="date"
              rules={[{ required: true, message: "Please select the date!" }]}
            >
              <DatePicker />
            </Form.Item>
          </div>

          <div className="wrap">
            <WatchLaterIcon />
            <Form.Item
              name="startTime"
              rules={[
                { required: true, message: "Please select the start time!" },
              ]}
            >
              <TimePicker format="HH:mm" />
            </Form.Item>
            <span>-</span>
            <Form.Item
              name="endTime"
              rules={[
                { required: true, message: "Please select the end time!" },
              ]}
            >
              <TimePicker format="HH:mm" />
            </Form.Item>
          </div>

          <div className="wrap">
            <RoomIcon />
            <Form.Item
              name="location"
              rules={[{ required: true, message: "Please input the location" }]}
            >
              <Input placeholder="Location" />
            </Form.Item>
          </div>

          <div className="wrap">
            <FormatAlignLeftIcon />
            <Form.Item
              name="description"
              rules={[
                { required: true, message: "Please input the description" },
              ]}
            >
              <TextArea placeholder="Event Decription" rows={4} />
            </Form.Item>
          </div>

          <Form.Item>
            <Button loading={loading} type="primary" htmlType="submit">
              Create
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SpecificClub;
