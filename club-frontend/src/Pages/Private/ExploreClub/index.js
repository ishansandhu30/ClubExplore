import React, { useEffect, useState } from "react";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import "./style.css";
import { Button, notification } from "antd";
import { getClub, joinClubAPI } from "../../../API/Clubs";
import { useParams } from "react-router-dom";
import { Spin } from "antd";

const ExploreClub = () => {
  const { club_id } = useParams();
  const [clubDetails, setClubDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
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

    fetchClubDetails();
  }, []);

  const joinClub = async (id) => {
    setLoading2(true);
    const res = await joinClubAPI(id);
    console.log(res);
    if (Math.floor(res?.status / 100) === 2) {
      notification.success({
        message: "Club Joined",
        description: `You are now a member of the club ${clubDetails?.title}`,
      });
    } else {
      const data = await res.json();
      notification.error({
        message: "Invalid Request",
        description: data?.error,
      });
    }
    setLoading2(false);
  };

  return loading ? (
    <div className="center">
      <Spin size="large" color="#660000" />
    </div>
  ) : (
    <div className="explore-club">
      <div className="page-title">
        <span>{clubDetails?.title}</span>
      </div>
      <div className="club-info-wrapper">
        <div className="img-wrapper">
          <img
            src={`${process.env.REACT_APP_BACKEND_URL}${clubDetails?.banner}`}
            alt="img-banner"
          />
        </div>

        <div className="club-info">
          <div className="member-count-wrap">
            <div
              className="circle"
              style={{ backgroundColor: clubDetails?.color }}
            ></div>
            <div className="members-count">
              <span>{clubDetails.members} Active Members</span>
            </div>
            <div className="category">{clubDetails?.category_name}</div>
          </div>

          <div className="club-desc">{clubDetails?.description}</div>
          <div className="join-club">
            <Button
              loading={loading2}
              onClick={() => {
                joinClub(clubDetails?.id);
              }}
              icon={<PlusOutlined />}
            >
              Join Club
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreClub;
