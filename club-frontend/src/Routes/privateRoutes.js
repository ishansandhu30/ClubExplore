import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import AppLayout from "../Components/Layout/AppLayout";
import Home from "../Pages/Private/Home";
import Explore from "../Pages/Private/Explore";
import SpecificClub from "../Pages/Private/SpecificClub";
import CalendarComponent from "../Pages/Private/Calendar";
import CreateClub from "../Pages/Private/CreateClub";
import ExploreClub from "../Pages/Private/ExploreClub";

const PrivateRoutes = ({ setToken, setUser }) => {
  return (
    <AppLayout setToken={setToken} setUser={setUser}>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/home/:club_id" element={<SpecificClub />} />
        <Route path="/create-club" element={<CreateClub />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/explore/:club_id" element={<ExploreClub />} />
        <Route path="/calendar" element={<CalendarComponent />} />
        <Route path="/*" element={<Home />} />
      </Routes>
    </AppLayout>
  );
};

export default PrivateRoutes;
