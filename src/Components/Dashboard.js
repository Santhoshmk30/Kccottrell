import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip,   } from "recharts";

const Dashboard = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const navigate = useNavigate();


  const attendanceData = [
  { name: "On Time", value: 1254 },
  { name: "Late Attendance", value: 732 },
  { name: "Casual Leave", value: 658 },
  { name: "Permission", value: 714 },
  { name: "Sick Leave", value: 768 },
];
const COLORS = ["#2ecc71", "#f1c40f", "#3498db", "#e74c3c", "#9b59b6"];
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

  const employee = {
  employee_name: "SANTHOSH",
  designation: "Junior Engineer",
  intercom: "1234",
  email: "Santhosh@example.com",
  reporting_person: "VS",
  joined_date: "2022-01-15",
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
<div style={styles.topRow}>


  
 {/*   Employee ID Card    */}   


<div style={styles.idCard}>
  <div style={styles.idCardBody}>
    
    {/* Left side – Photo */}
    <div style={styles.photoSection}>
      <img 
        src={"/PROFILE.jpg"} 
        alt="Employee" 
        style={styles.photo} 
      />
    </div>

    {/* Right side – Details */}
    <div style={styles.detailsSection}>
      <div style={styles.idRow}>
        <span style={styles.idLabel}>Name:</span>
        <span style={styles.idValue}>{employee.employee_name}</span>
      </div>
      <div style={styles.idRow}>
        <span style={styles.idLabel}>Designation:</span>
        <span style={styles.idValue}>{employee.designation}</span>
      </div>
      <div style={styles.idRow}>
        <span style={styles.idLabel}>Intercom:</span>
        <span style={styles.idValue}>{employee.intercom}</span>
      </div>
      <div style={styles.idRow}>
        <span style={styles.idLabel}>Email:</span>
        <span style={styles.idValue}>{employee.email}</span>
      </div>
      <div style={styles.idRow}>
        <span style={styles.idLabel}>Reporting Person:</span>
        <span style={styles.idValue}>{employee.reporting_person}</span>
      </div>
      <div style={styles.idRow}>
        <span style={styles.idLabel}>Joined Date:</span>
        <span style={styles.idValue}>{employee.joined_date}</span>
      </div>
    </div>

  </div>
</div>

{/*   Attendance Overview    */}   

<div style={styles.attendanceCardHorizontal}>
  {/* Left side: Data + Legend */}
  <div style={styles.attendanceData}>
    <h3 style={styles.cardTitle}>Attendance Overview</h3>
    {attendanceData.map((item, index) => (
      <div key={index} style={styles.dataRow}>
        {/* Small color box */}
        <span
          style={{
            display: "inline-block",
            width: "10px",
            height: "10px",
            backgroundColor: COLORS[index % COLORS.length],
            marginRight: "8px",
            borderRadius: "10px",
          }}
        ></span>
        <span style={{ fontWeight: "600" }}>{item.name}:</span>
        <span style={{ marginLeft: 6 }}>{item.value}</span>
      </div>
    ))}
  </div>

  {/* Right side: Pie Chart */}
  <div style={styles.attendancePie}>
    <PieChart width={180} height={180}>
      <Pie
        data={attendanceData}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        innerRadius={50}
        outerRadius={80}
        paddingAngle={1}
        stroke="#fff"
      >
        {attendanceData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  </div>
</div>


</div>

<div style={styles.topRow}>
  

  {/*   Attendance    */}   



<div style={styles.card}>
  {/* Header */}
  <div style={styles.header1}>
    <span style={styles.headerTitle}>Attendance</span>
    <h3 style={styles.headerTime}>11 Mar 2025</h3>
  </div>

  {/* Circular Chart Section */}
  <div style={styles.circleWrapper}>
    <div style={styles.circleOuter}>
      <svg width="120" height="120">
        <circle
          cx="60"
          cy="60"
          r="54"
          stroke="#e6e6e6"
          strokeWidth="5"
          fill="none"
        />
        <circle
          cx="60"
          cy="60"
          r="54"
          stroke="#2ecc71"
          strokeWidth="5"
          fill="none"
          strokeDasharray="339"
          strokeDashoffset="100"
          strokeLinecap="round"
        />
      </svg>
      <div style={styles.circleText}>
        <span style={{ fontSize: "13px", color: "#777" }}>Total Hours</span>
        <h4 style={{ margin: 0 }}>5:45:32</h4>
      </div>
    </div>
  </div>

  {/* Info Rows */}
  <div style={styles.infoRow}>
    <span style={styles.infoBadge}>Production : 3.45 hrs</span>
  </div>
 <div style={styles.infoRow}>
  <img 
    src="/fingerprint.png"   
    alt="Fingerprint" 
    style={{ width: "18px", height: "18px", marginRight: "6px", verticalAlign: "middle" }} 
  />
  <span style={{ color: "#e74c3c" }}>Punch In at 09.30 AM</span>
</div>

  {/* Punch Button */}
  <button style={styles.punchBtn}>Punch Out</button>
</div>
 
 <div style={styles.timelineCard}>
  {/* Header with stats */}
  <div style={styles.header2}>
    <div style={styles.stat}>
      <span style={{ ...styles.dot, background: "#ccc" }}></span>
      <span>Total Working hours</span>
      <h3>12h 36m</h3>
    </div>
    <div style={styles.stat}>
      <span style={{ ...styles.dot, background: "#2ecc71" }}></span>
      <span>Productive Hours</span>
      <h3>08h 36m</h3>
    </div>
    <div style={styles.stat}>
      <span style={{ ...styles.dot, background: "#f1c40f" }}></span>
      <span>Break hours</span>
      <h3>22m 15s</h3>
    </div>
    <div style={styles.stat}>
      <span style={{ ...styles.dot, background: "#3498db" }}></span>
      <span>Overtime</span>
      <h3>02h 15m</h3>
    </div>
  </div>

  {/* Timeline Bar */}
  <div style={styles.timelineBar}>
    {/* Example Blocks */}
    <div style={{ ...styles.block, background: "#2ecc71", width: "20%" }}></div>
    <div style={{ ...styles.block, background: "#f1c40f", width: "5%" }}></div>
    <div style={{ ...styles.block, background: "#2ecc71", width: "25%" }}></div>
    <div style={{ ...styles.block, background: "#f1c40f", width: "10%" }}></div>
    <div style={{ ...styles.block, background: "#2ecc71", width: "20%" }}></div>
    <div style={{ ...styles.block, background: "#3498db", width: "5%" }}></div>
    <div style={{ ...styles.block, background: "#3498db", width: "5%" }}></div>
  </div>

  {/* Time Scale */}
  <div style={styles.timeScale}>
    {["06:00","07:00","08:00","09:00","10:00","11:00","12:00","01:00","02:00","03:00","04.00","05:00","06:00","07:00","08:00","09:00","10:00"].map((t) => (
      <span key={t}>{t}</span>
    ))}
  </div>
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
  container: { padding: 0, fontFamily: "sans-serif",background: "linear-gradient(to right, #feffffff, #f4f7f5ff)",  },
navbar: {
  backgroundColor: 'hsla(0, 0%, 100%, 0.00)', 
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
  height: "45px",     
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
 idCard: {
  width: "480px",
    border: "1px solid #f36f21",
    borderRadius: "12px",
    padding: "20px",
    margin: "20px",
    background: "linear-gradient(180deg, #fff 0%, #fff7f3 100%)",
    boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
},

  idCardTitle: {
    textAlign: "center",
    marginBottom: "10px",
    fontSize: "22px",
    fontWeight: "600",
    color: "#2c3e50",
    borderBottom: "2px solid #f0f0f0",
    paddingBottom: "10px"
  },
  idCardBody: {
    display: "flex",
    alignItems: "flex-start",
    gap: "25px"
  },
  
  photoSection: {
    flex: "0 0 140px",
    display: "flex",
    justifyContent: "center",
    marginTop:"20px",
  },
  photo: {
    width: "140px",
    height: "140px",
    borderRadius: "10px",
    objectFit: "cover",
    border: "2px solid #ddd",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
  },
  detailsSection: {
    flex: 1
  },
  idRow: {
    marginBottom: "13.2px",
    display: "flex",
    alignItems: "center"
  },
 idLabel: {
    fontWeight: "600",
    color: "#34495e",
    width: "160px",
    fontSize: "15px"
  },
idValue: {
    flex: 1,
    color: "#2c3e50",
    fontSize: "15px"
  },
  topRow: {
    display: "flex",
    gap: "10px",
    alignItems: "flex-start", // align top
    marginTop: "50px",
  },
    attendanceCardHorizontal: {
    display: "flex",
    background: "linear-gradient(180deg, #fff 0%, #fff7f3 100%)",
    borderRadius: "14px",
    padding: "20px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "150px",
    marginTop:"20px",
    height:"200px",
    border: "1px solid #f36f21",
  },
  attendanceData: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    gap: 10,
  },
  dataRow: {
    fontSize: 14,
    color: "#2c3e50",
  },
  cardTitle: {
    marginBottom: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#34495e",
  },
  attendancePie: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
   card: {
    border: "1px solid #f36f21",
    borderRadius: "8px",
    padding: "20px",
    width: "350px",
    margin: "20px",
    background: "linear-gradient(180deg, #fff 0%, #fff7f3 100%)",
    textAlign: "center",
    fontFamily: "'Segoe UI', Tahoma, sans-serif",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
  },
  header1: {
    marginBottom: "15px"
  },
  headerTitle: {
    fontSize: "14px",
    color: "#666"
  },
  headerTime: {
    fontSize: "18px",
    fontWeight: "600",
    marginTop: "5px",
    color: "#2c3e50"
  },
  circleWrapper: {
    display: "flex",
    justifyContent: "center",
    margin: "20px 0"
  },
  circleOuter: {
    position: "relative",
    width: "120px",
    height: "120px"
  },
  circleText: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center"
  },
  infoRow: {
    margin: "10px 0"
  },
  infoBadge: {
    background: "#333",
    color: "#fff",
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "600"
  },
  punchBtn: {
    marginTop: "15px",
    width: "100%",
    padding: "12px",
    background: "#f36f21",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },
 timelineCard: {
    border: "1px solid #f36f21",
    borderRadius: "8px",
    background: "linear-gradient(180deg, #fff 0%, #fff7f3 100%)",
    padding: "20px",
    maxWidth: "1200px",
    margin: "20px 0px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    width:"1200px", 
    fontFamily: "'Segoe UI', Tahoma, sans-serif"
  },
  header2: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px"
  },
  stat: {
    textAlign: "center",
    flex: 1
  },
  dot: {
    display: "inline-block",
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    marginRight: "6px"
  },
  timelineBar: {
    display: "flex",
    height: "20px",
    borderRadius: "6px",
    overflow: "hidden",
    marginBottom: "8px"
  },
  block: {
    height: "100%"
  },
  timeScale: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "12px",
    color: "#777"
  }
};

export default Dashboard;
