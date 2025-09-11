import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://darkslategrey-shrew-424102.hostingersite.com/api/get_request.php')
      .then(res => res.json())
      .then(data => {
        setRequests(data);
        setFilteredRequests(data);
      })
      .catch(err => console.error('Fetch error:', err));
  }, []);

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilterStatus(value);
    if (value === 'All') {
      setFilteredRequests(requests);
    } else {
      setFilteredRequests(requests.filter(item => item.status === value));
    }
  };

  const handleView = (item) => {
    setSelected(item);
  };
  
    const cardStyle = {
  background: "#fff",
  borderRadius: "12px",
  padding: "16px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
};

  const handleClose = () => {
    setSelected(null);
  };

  return (
    <div style={styles.container}>
 <div
      style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: "20px",
        padding: "20px",
        background: "#f4f6f9",
        minHeight: "100vh",
      }}
    >
      {/* Left side main content */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Profile */}
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 18 }}>John Doe</div>
              <div style={{ color: "#7f8c8d", fontSize: 13 }}>
                UI/UX Designer
              </div>
            </div>
            <img
              src="https://via.placeholder.com/60"
              alt="profile"
              style={{ borderRadius: "50%" }}
            />
          </div>
          <div style={{ marginTop: 10, color: "#7f8c8d", fontSize: 13 }}>
            <div>Employee ID: EMP001</div>
            <div>Joining Date: 12 Mar 2020</div>
          </div>
        </div>

        {/* Leave Donut */}
        <div style={cardStyle}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>
            Leave Status
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 16,
            }}
          >
            {/* Fake Donut Chart */}
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                background: "conic-gradient(#3498db 0 70%, #ecf0f1 70% 100%)",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%,-50%)",
                  fontSize: 14,
                  fontWeight: "700",
                }}
              >
                70%
              </div>
            </div>
            {/* Legend */}
            <div>
              <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                <span
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: "#3498db",
                  }}
                ></span>
                <span>Approved (14)</span>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <span
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: "#ecf0f1",
                  }}
                ></span>
                <span>Pending (6)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Leave Summary */}
        <div style={cardStyle}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>
            Leave Summary
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 12,
              marginBottom: 12,
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: 18 }}>12</div>
              <div style={{ color: "#7f8c8d", fontSize: 13 }}>Annual</div>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 18 }}>4</div>
              <div style={{ color: "#7f8c8d", fontSize: 13 }}>Sick</div>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 18 }}>2</div>
              <div style={{ color: "#7f8c8d", fontSize: 13 }}>Casual</div>
            </div>
          </div>
          <button
            style={{
              border: 0,
              padding: "10px 14px",
              borderRadius: 6,
              background: "#0b132b",
              color: "#fff",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            Apply Leave
          </button>
        </div>

        {/* Timeline */}
        <div style={cardStyle}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>
            Timeline
          </div>
          <div style={{ fontSize: 13, color: "#7f8c8d" }}>
            <div style={{ marginBottom: 8 }}>09:00 AM - Logged In</div>
            <div style={{ marginBottom: 8 }}>01:00 PM - Lunch Break</div>
            <div>06:00 PM - Logged Out</div>
          </div>
        </div>
      </div>

      {/* Right side small cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Attendance */}
        <div style={{ ...cardStyle, height: "200px" }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>
            Attendance
          </div>
          <div style={{ textAlign: "center", padding: 8 }}>
            <div style={{ fontWeight: 700, fontSize: 18, color: "#7f8c8d" }}>
              Present
            </div>
            <div
              style={{
                marginTop: 8,
                fontSize: 24,
                fontWeight: "bold",
                color: "#2ecc71",
              }}
            >
              26 Days
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ ...cardStyle }}>
            <div style={{ fontSize: 13, color: "#7f8c8d" }}>Projects</div>
            <div style={{ fontWeight: 800, fontSize: 20 }}>8</div>
          </div>
          <div style={{ ...cardStyle }}>
            <div style={{ fontSize: 13, color: "#7f8c8d" }}>Tasks</div>
            <div style={{ fontWeight: 800, fontSize: 20 }}>24</div>
          </div>
          <div style={{ ...cardStyle }}>
            <div style={{ fontSize: 13, color: "#7f8c8d" }}>Clients</div>
            <div style={{ fontWeight: 800, fontSize: 20 }}>5</div>
          </div>
        </div>
      </div>
    </div>

  <div style={styles.headerWrapper}>
  <h1 style={styles.heading}>Trip Request</h1>
  <button onClick={() => navigate('/request')} style={styles.addBtn}>
    + Trip Request
  </button>
</div>
     

      <div style={styles.filterWrapper}>
        <label>Status Filter:</label>
        <select value={filterStatus} onChange={handleFilterChange} style={styles.dropdown}>
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
                    item.status === 'Certified' ? '#2980b9' :
                      item.status === 'Approved' ? '#27ae60' :
                        item.status === 'Rejected' ? '#e74c3c' :
                          '#bdc3c7',
                  color: 'white',
                  padding: '4px 10px',
                  borderRadius: 10,
                  fontSize: 13
                }}
              >
                {item.status}
              </span>
            </div>
            <div style={styles.cell}>
              <button onClick={() => handleView(item)} style={styles.viewBtn}>View</button>
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
                  <div style={styles.gridLabel}>{key.replace(/_/g, ' ').toUpperCase()}</div>
                  <div style={styles.gridValue}>{value}</div>
                </div>
              ))}
            </div>

            <div style={styles.buttonGroup}>
              <button onClick={handleClose} style={styles.cancelBtn}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: 30, fontFamily: 'sans-serif' },
  heading: { fontSize: 28, marginBottom: 20 },
  filterWrapper: { marginBottom: 20 },
  dropdown: { padding: 8, fontSize: 14, marginLeft: 10, borderRadius: 6 },
  table: { border: '1px solid #ccc', borderRadius: 8, overflow: 'hidden' },
  row: { display: 'flex', padding: 12, borderBottom: '1px solid #eee', alignItems: 'center' },
  header: { background: '#f2f2f2', fontWeight: 'bold' },
  cell: { flex: 1, fontSize: 14 },
  viewBtn: { padding: '5px 10px', border: 'none', background: '#333', color: 'white', borderRadius: 4, cursor: 'pointer' },
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999
  },
  modalCard: {
    background: '#fefefe',
    borderRadius: '12px',
    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.2)',
    width: '90%',
    maxWidth: '700px',
    maxHeight: '85vh',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column'
  },
  modalHeader: {
    background: 'linear-gradient(to right, #4facfe, #00f2fe)',
    padding: '20px',
    borderTopLeftRadius: '12px',
    borderTopRightRadius: '12px',
    color: '#fff'
  },
  modalTitle: {
    margin: 0,
    fontSize: '20px',
    textAlign: 'center'
  },
  detailGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    padding: '20px'
  },
  gridRow: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f7f9fa',
    borderRadius: '8px',
    padding: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
  },
  gridLabel: {
    fontSize: '12px',
    color: '#7f8c8d',
    marginBottom: '4px',
    fontWeight: 600
  },
  gridValue: {
    fontSize: '14px',
    color: '#2c3e50',
    fontWeight: 500
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '20px',
    borderTop: '1px solid #eee'
  },
  actionBtn: {
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
    flex: 1,
    margin: '0 8px'
  },
  cancelBtn: {
    backgroundColor: '#bdc3c7',
    color: '#2c3e50',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
    flex: 1,
    margin: '0 8px'
  },
  headerWrapper: {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 20
},
addBtn: {
  padding: '10px 16px',
  background: 'linear-gradient(to right, #00c6ff, #0072ff)',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: 'bold',
  cursor: 'pointer',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
},
 
  profileCard: {
    background: '#fff',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 6px 15px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.3s ease',
  },
  profileCardHover: {
    transform: 'translateY(-3px)',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.12)',
  },
  profileTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  profileName: {
    fontWeight: 700,
    fontSize: '18px',
    color: '#2c3e50',
  },
  profileTitle: {
    color: 'var(--muted, #7f8c8d)',
    fontSize: '13px',
    marginTop: '4px',
  },
  profileBody: {
    marginTop: '12px',
  },
  profileMuted: {
    color: 'var(--muted, #95a5a6)',
    marginTop: '6px',
    fontSize: '13px',
  },
  profileBodyDiv: {
    marginBottom: '10px',
    fontSize: '14px',
    color: '#34495e',
  },

};
export default Dashboard;





