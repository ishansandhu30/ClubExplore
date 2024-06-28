import React, { useCallback, useEffect, useState } from "react";
import { Button, Spin, notification } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";
import { login } from "../../../../API/auth";
import updateUserStates from "../../../../Utils/UpdateUsersState";
import { encryptText } from "../../../../Utils/Encryption";
import logo from "../../../../Assets/images/logo.png";
import "./style.css";
const { REACT_APP_GOOGLE_CLIENT_ID, REACT_APP_GOGGLE_REDIRECT_URL_ENDPOINT } =
  process.env;

const SignUp = ({ setToken, setUser }) => {
  const [api, contextHolder] = notification.useNotification();
  let location = useLocation();
  const [loading, setLoading] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const values = queryString.parse(location.search);
    const code = values.code ? values.code : null;

    if (code) {
      setLoading(true);
      const func = async () => {
        const res = await login(values);
        if (res?.status === 200) {
          localStorage.setItem(
            encryptText("user"),
            encryptText(JSON.stringify(res?.data.user))
          );
          localStorage.setItem(
            encryptText("token"),
            encryptText(res?.data.token)
          );
          updateUserStates(setUser, setToken);
          navigate("/home");
        } else {
          const openNotificationWithIcon = (type) => {
            api[type]({
              message: "Invalid Login",
              description: "Please login using a valid google account.",
            });
          };
          openNotificationWithIcon("warning");
        }
        setLoading(false);
      };
      func();
    }
  }, [location.search, navigate]);

  const openGoogleLoginPage = useCallback(() => {
    const googleAuthUrl = "https://accounts.google.com/o/oauth2/v2/auth";

    const scope = [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ].join(" ");

    const params = new URLSearchParams({
      response_type: "code",
      client_id: REACT_APP_GOOGLE_CLIENT_ID,
      redirect_uri: `${REACT_APP_GOGGLE_REDIRECT_URL_ENDPOINT}/signin`,
      prompt: "select_account",
      access_type: "offline",
      scope,
    });

    const url = `${googleAuthUrl}?${params}`;

    window.location.href = url;
  }, []);

  return (
    <div
      className="sign-in"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      {contextHolder}
      <div style={{ textAlign: "center" }}>
        <div className="head-wrapper">
          <div className="img-wrapper">
            <img src={logo} alt="logo" />
          </div>
          <div className="app-name-wrapper">
            <h1>Club</h1>
            <h1 style={{ color: "#660000" }}>Explore</h1>
          </div>
        </div>
        <h1>Login</h1>
        {loading ? (
          <Spin />
        ) : (
          <Button
            type="primary"
            size="large"
            onClick={openGoogleLoginPage}
            icon={<GoogleOutlined />}
            style={{ marginTop: "20px", backgroundColor: "#660000" }}
          >
            Login with Google
          </Button>
        )}
      </div>
    </div>
  );
};

export default SignUp;
