import React, { useEffect, useState } from "react";
import AttendanceForm from "./components/AttendanceForm";
import AttendanceDashboard from "./components/AttendanceDashboard";
import "./styles/app.css";

function App() {
  const [records, setRecords] = useState([]);

  // Replace with your deployed backend API URL
  const apiUrl = "https://employee-4hcd.onrender.com/api";

  const fetchAttendance = async () => {
    try {
      const res = await fetch(`${apiUrl}/attendance`);
      const data = await res.json();
      setRecords(data);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  return (
    <div className="container">
      <h1>Employee Attendance Tracker</h1>
      <div className="flex-container">
        <div className="flex-item">
          <AttendanceForm fetchAttendance={fetchAttendance} apiUrl={apiUrl} />
        </div>
        <div className="flex-item table-wrapper">
          <AttendanceDashboard records={records} fetchAttendance={fetchAttendance} apiUrl={apiUrl} />
        </div>
      </div>
    </div>
  );
}

export default App;
