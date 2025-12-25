import React from "react";
import { Outlet } from "react-router-dom"; // Renders child routes
import StudentNavbar from "./StudentNavbar";

export default function StudentLayout() {
  return (
    <div className="student-layout">
      <StudentNavbar />
      <div className="student-content">
        <Outlet />
      </div>
    </div>
  );
}
