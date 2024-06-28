import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  ConfigProvider,
  Dropdown,
  Input,
  Menu,
  Spin,
} from "antd";
import clubPicture from "../../../Assets/images/club picture.png";
import "./style.css";
import { FilterOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getAllClubs } from "../../../API/Clubs";
import "../../../App.css";
import { getAllCategories } from "../../../API/Category";

const { Search } = Input;

const Explore = () => {
  const [clubsList, setClubsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await getAllClubs();
        setClubsList(res.data);
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

    fetchCategories();

    fetchClubs();
  }, []);

  const onSearch = (value, _e, info) => {
    if (value.trim() === "") {
      setClubsList(clubsList);
    } else {
      const filteredClubs = clubsList.filter((club) =>
        club.title.toLowerCase().includes(value.toLowerCase())
      );
      setClubsList(filteredClubs);
    }
  };

  const goToClub = (id) => {
    navigate(`/explore/${id}`);
  };

  return (
    <div className="explore">
      <div className="page-title">
        <span>Explore</span>
      </div>
      <div className="search-wrapper">
        <ConfigProvider
          theme={{
            components: {
              Input: {
                hoverBorderColor: "#660000",
                activeBorderColor: "#660000",
              },
            },
          }}
        >
          <Search placeholder="Search" allowClear onSearch={onSearch} />
        </ConfigProvider>
      </div>

      <div className="clubs-container">
        {loading ? (
          <Spin size="large" color="#660000" />
        ) : (
          clubsList.map((club, index) => (
            <div
              className="club-card"
              key={index}
              onClick={() => {
                goToClub(club?.id);
              }}
            >
              <img
                src={`${process.env.REACT_APP_BACKEND_URL}${club.banner}`}
                alt="Club"
                className="club-picture"
              />
              <div className="club-details">
                <h2 className="club-name">{club.title}</h2>
                <p className="club-description">{club.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Explore;
