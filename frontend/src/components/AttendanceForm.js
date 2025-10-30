import React, { useState } from "react";
import "./../styles/app.css";

const AttendanceForm = ({ fetchAttendance, apiUrl }) => {
  const [employeeName, setEmployeeName] = useState("");
  const [employeeID, setEmployeeID] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("Present");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!employeeName || !employeeID || !date) return alert("Fill all fields");

    try {
      const res = await fetch(`${apiUrl}/attendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeName, employeeID, date, status }),
      });
      const data = await res.json();
      alert(data.message);
      setEmployeeName("");
      setEmployeeID("");
      setDate("");
      setStatus("Present");
      fetchAttendance();
    } catch (error) {
      alert("Error adding attendance: " + error);
    }
  };

  return (
    <form className="attendance-form" onSubmit={handleSubmit}>
      <h2>Add Attendance</h2>
      <input
        placeholder="Employee Name"
        value={employeeName}
        onChange={(e) => setEmployeeName(e.target.value)}
        required
      />
      <input
        placeholder="Employee ID"
        value={employeeID}
        onChange={(e) => setEmployeeID(e.target.value)}
        required
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="Present">Present</option>
        <option value="Absent">Absent</option>
      </select>
      <button type="submit">Add Attendance</button>
    </form>
  );
};

export default AttendanceForm;
