import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import PrivateRoutes from "./privateRoutes";
import PublicRoutes from "./publicRoutes";
import { getToken, getUser, handleLogout } from "../Utils/UpdateUsersState";
import axios from "axios";

const Routes = () => {
  const [user, setUser] = useState({});
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error?.response?.status === 401) {
        handleLogout(setUser, setToken);
        window.location.href = "/signin";
      }
    }
  );

  useEffect(() => {
    const func = async () => {
      const user = await getUser();
      setUser(user);
    };
    func();
    setToken(getToken());
    setLoading(false);
  }, []);

  return (
    <BrowserRouter>
      {loading ? null : (
        <>
          {token ? (
            <PrivateRoutes setToken={setToken} setUser={setUser} />
          ) : (
            <PublicRoutes setToken={setToken} setUser={setUser} />
          )}
        </>
      )}
    </BrowserRouter>
  );
};

export default Routes;
