import React, { useState } from "react";

const AttendanceDashboard = ({ records, fetchAttendance }) => {
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      r.employeeID.toLowerCase().includes(search.toLowerCase());
    const matchesDate = filterDate ? r.date === filterDate : true;
    return matchesSearch && matchesDate;
  });

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/attendance/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      alert(data.message);
      fetchAttendance();
    } catch (error) {
      alert("Error deleting record: " + error);
    }
  };

  return (
    <div>
      <h2>Attendance Records</h2>

      <div className="filter-container">
        <input
          type="text"
          placeholder="Search by Name or ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
      </div>

      <table border="1" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            <th>Name</th>
            <th>ID</th>
            <th>Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredRecords.length === 0 ? (
            <tr>
              <td colSpan="5">No records found</td>
            </tr>
          ) : (
            filteredRecords.map((r) => (
              <tr key={r.id}>
                <td>{r.employeeName}</td>
                <td>{r.employeeID}</td>
                <td>{r.date}</td>
                <td className={r.status === "Present" ? "status-present" : "status-absent"}>
                  {r.status}
                </td>
                <td>
                  <button className="delete-btn" onClick={() => handleDelete(r.id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceDashboard;
