import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(
      "https://darkslategrey-shrew-424102.hostingersite.com/api/get_request.php"
    )
      .then((res) => res.json())
      .then((data) => {
        setRequests(data);
        setFilteredRequests(data);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilterStatus(value);
    if (value === "All") {
      setFilteredRequests(requests);
    } else {
      setFilteredRequests(requests.filter((item) => item.status === value));
    }
  };

  const handleView = (item) => {
    setSelected(item);
  };

  const handleClose = () => {
    setSelected(null);
  };

  return (
    <div style={styles.container}>
     <div style={styles.navbar}>
  {/* 🔹 Logo image */}
  <img 
    src="/logologin.png" 
    alt="Logo" 
    style={styles.logoImg} 
  />

  {/* 🔹 Navigation Links */}
  <div style={styles.navLinks}>
    <span style={styles.navItem} onClick={() => navigate("/dashboard")}>
      Dashboard
    </span>
    <span style={styles.navItem} onClick={() => navigate("/request")}>
      New Request
    </span>
    <span style={styles.navItem} onClick={() => navigate("/profile")}>
      Profile
    </span>
    <span style={styles.navItem} onClick={() => navigate("/logout")}>
      Logout
    </span>
  </div>
</div>


      <div style={styles.headerWrapper}>
        <h1 style={styles.heading}>Trip Request</h1>
        <button onClick={() => navigate("/request")} style={styles.addBtn}>
          + Trip Request
        </button>
      </div>

      <div style={styles.filterWrapper}>
        <label>Status Filter:</label>
        <select
          value={filterStatus}
          onChange={handleFilterChange}
          style={styles.dropdown}
        >
          <option value="All">All</option>
          <option value="Certified">Certified</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div style={styles.table}>
        <div style={{ ...styles.row, ...styles.header }}>
          <div style={styles.cell}>From</div>
          <div style={styles.cell}>To</div>
          <div style={styles.cell}>Department</div>
          <div style={styles.cell}>Project</div>
          <div style={styles.cell}>Place</div>
          <div style={styles.cell}>Status</div>
          <div style={styles.cell}>Action</div>
        </div>

        {filteredRequests.map((item, i) => (
          <div key={i} style={styles.row}>
            <div style={styles.cell}>{item.from_date}</div>
            <div style={styles.cell}>{item.to_date}</div>
            <div style={styles.cell}>{item.department}</div>
            <div style={styles.cell}>{item.project_code}</div>
            <div style={styles.cell}>{item.place}</div>
            <div style={styles.cell}>
              <span
                style={{
                  background:
                    item.status === "Certified"
                      ? "#2980b9"
                      : item.status === "Approved"
                      ? "#27ae60"
                      : item.status === "Rejected"
                      ? "#e74c3c"
                      : "#bdc3c7",
                  color: "white",
                  padding: "4px 10px",
                  borderRadius: 10,
                  fontSize: 13,
                }}
              >
                {item.status}
              </span>
            </div>
            <div style={styles.cell}>
              <button
                onClick={() => handleView(item)}
                style={styles.viewBtn}
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Trip Request Summary</h2>
            </div>

            <div style={styles.detailGrid}>
              {Object.entries(selected).map(([key, value], index) => (
                <div key={index} style={styles.gridRow}>
                  <div style={styles.gridLabel}>
                    {key.replace(/_/g, " ").toUpperCase()}
                  </div>
                  <div style={styles.gridValue}>{value}</div>
                </div>
              ))}
            </div>

            <div style={styles.buttonGroup}>
              <button onClick={handleClose} style={styles.cancelBtn}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: 0, fontFamily: "sans-serif" },
navbar: {
  background: "linear-gradient(to right, #0D9488, #065F46)", 
  color: "#fff",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 30px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
  position: "sticky",
  top: 0,
  zIndex: 1000,
},



logoImg: {
  height: "45px",      // unga logo ku fit size kudunga
  objectFit: "contain",
  cursor: "pointer",
},

navLinks: {
  display: "flex",
  gap: "25px",
},

navItem: {
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "500",
  color: "#f5f5f5",
  transition: "all 0.3s ease",
},

  heading: { fontSize: 28, marginBottom: 20 },
  filterWrapper: { marginBottom: 20, padding: "0 30px" },
  dropdown: { padding: 8, fontSize: 14, marginLeft: 10, borderRadius: 6 },
  table: {
    border: "1px solid #ccc",
    borderRadius: 8,
    overflow: "hidden",
    margin: "0 30px",
  },
  row: {
    display: "flex",
    padding: 12,
    borderBottom: "1px solid #eee",
    alignItems: "center",
  },
  header: { background: "#f2f2f2", fontWeight: "bold" },
  cell: { flex: 1, fontSize: 14 },
  viewBtn: {
    padding: "5px 10px",
    border: "none",
    background: "#333",
    color: "white",
    borderRadius: 4,
    cursor: "pointer",
  },
  headerWrapper: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "30px",
  },
  addBtn: {
    padding: "10px 16px",
    background: "linear-gradient(to right, #434343, #000000)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
  },
  /* Modal styles same as before */
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  modalCard: {
    background: "#fefefe",
    borderRadius: "12px",
    boxShadow: "0 12px 30px rgba(0, 0, 0, 0.2)",
    width: "90%",
    maxWidth: "700px",
    maxHeight: "85vh",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
  },
  modalHeader: {
    background: "linear-gradient(to right, #2c3e50, #000000)",
    padding: "20px",
    borderTopLeftRadius: "12px",
    borderTopRightRadius: "12px",
    color: "#fff",
  },
  modalTitle: { margin: 0, fontSize: "20px", textAlign: "center" },
  detailGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    padding: "20px",
  },
  gridRow: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#f7f9fa",
    borderRadius: "8px",
    padding: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },
  gridLabel: {
    fontSize: "12px",
    color: "#7f8c8d",
    marginBottom: "4px",
    fontWeight: 600,
  },
  gridValue: { fontSize: "14px", color: "#2c3e50", fontWeight: 500 },
  buttonGroup: {
    display: "flex",
    justifyContent: "space-around",
    padding: "20px",
    borderTop: "1px solid #eee",
  },
  cancelBtn: {
    backgroundColor: "#bdc3c7",
    color: "#2c3e50",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
    flex: 1,
    margin: "0 8px",
  },
};

export default Dashboard;
