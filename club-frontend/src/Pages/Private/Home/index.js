import React, { useEffect, useState } from "react";
import { Button, Input, Spin } from "antd";

import { PlusOutlined } from "@ant-design/icons";
import "./style.css";
import { useNavigate } from "react-router-dom";
import { getUserClubs } from "../../../API/Clubs";

const { Search } = Input;

const Home = () => {
  const [clubsList, setClubsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUserClubs = async () => {
      try {
        setLoading(true);
        const res = await getUserClubs();
        setClubsList(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching clubs:", error);
        setLoading(false);
      }
    };

    fetchUserClubs();
  }, []);

  const onSearch = (value) => {
    setSearchQuery(value.trim().toLowerCase());
  };

  const filteredClubs = clubsList.filter((club) =>
    club.title.toLowerCase().includes(searchQuery)
  );

  const navigate = useNavigate();

  const goToClub = (id) => {
    navigate(`/home/${id}`);
  };

  const goToCreate = () => {
    navigate("/create-club");
  };

  return (
    <div className="home">
      <div className="page-title">
        <span>My Clubs</span>
      </div>
      <Search placeholder="Search" allowClear onSearch={onSearch} />
      {loading ? (
        <Spin
          style={{ marginTop: "100px", marginBottom: "100px" }}
          size="large"
          color="#660000"
        />
      ) : (
        <div className="clubs-container">
          {filteredClubs.map((club, index) => (
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
              <h2 className="club-name">{club.title}</h2>
              <p className="club-description">{club.description}</p>
            </div>
          ))}
        </div>
      )}

      <div className="create-club-btn-wrapper">
        <Button onClick={goToCreate} icon={<PlusOutlined />} size="large">
          Create New Club
        </Button>
      </div>
    </div>
  );
};

export default Home;
