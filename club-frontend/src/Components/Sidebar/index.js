import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import ExploreIcon from "@mui/icons-material/Explore";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LogoutIcon from "@mui/icons-material/Logout";
import profileImg from "../../Assets/images/Profile Pic.png";
import "./style.css";
import { getUser, handleLogout } from "../../Utils/UpdateUsersState";

const { Sider } = Layout;

const Sidebar = ({ setToken, setUser }) => {
  const [selectedId, setSelectedId] = useState("1");
  const navigate = useNavigate();
  const [user, setUserData] = useState();

  useEffect(() => {
    const func = async () => {
      const user = await getUser();
      setUserData(user);
    };
    func();
  }, []);

  const path = useLocation();
  const locationPath = path.pathname;

  useEffect(() => {
    if (locationPath.includes("/home")) {
      setSelectedId("1");
    } else if (locationPath.includes("/explore")) {
      setSelectedId("2");
    } else if (locationPath.includes("/calendar")) {
      setSelectedId("3");
    }
  }, [locationPath]);

  const handleLogoutButton = () => {
    handleLogout(setUser, setToken);
    navigate("/signin");
  };

  const onImageError = (e) => {
    e.target.src = profileImg;
  };

  return (
    <Sider
      className="sidebar"
      width={250}
      theme="dark"
      breakpoint="md"
      collapsedWidth="0"
      style={{ height: "100vh", position: "fixed", zIndex: "20" }}
    >
      <div className="sidebar-header">
        <div className="user-profile">
          <div className="user-img">
            <img
              width="100%"
              height="100%"
              src={user?.profile}
              alt="logo"
              style={{ borderRadius: "100px" }}
              onError={onImageError}
            />
          </div>
          <div className="user-details">
            <span className="user-name">{user?.first_name}</span>
            <span className="user-role">
              {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
            </span>
          </div>
        </div>
      </div>
      <Menu
        mode="vertical"
        theme="dark"
        defaultSelectedKeys={["1"]}
        selectedKeys={[selectedId]}
      >
        <Menu.Item key="1">
          <Link to="/home">
            <HomeIcon />
            <span className="menu-item-label">Home</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to="/explore">
            <ExploreIcon />
            <span className="menu-item-label">Explore</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="3">
          <Link to="/calendar">
            <CalendarTodayIcon />
            <span className="menu-item-label">Calendar</span>
          </Link>
        </Menu.Item>
      </Menu>

      <div className="sidebar-footer" onClick={handleLogoutButton}>
        <div className="logout-btn">
          <span className="logout-icon">
            <LogoutIcon />
          </span>
          <span className="logout-txt">Logout</span>
        </div>
      </div>
    </Sider>
  );
};

export default Sidebar;
