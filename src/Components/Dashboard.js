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

  const handleClose = () => {
    setSelected(null);
  };

  return (
    <div style={styles.container}>
<div
  style={styles.profileCard}
  onMouseOver={(e) => Object.assign(e.currentTarget.style, styles.profileCardHover)}
  onMouseOut={(e) => Object.assign(e.currentTarget.style, styles.profileCard)}
>
  <div style={styles.profileTop}>
    <div>
      <div style={styles.profileName}>Stephan Peralt</div>
      <div style={styles.profileTitle}>Senior Product Designer</div>
    </div>
  </div>
  <div style={styles.profileBody}>
    <div style={styles.profileBodyDiv}>
      <span style={styles.profileMuted}>Phone Number</span><br />
      +1 324 3453 545
    </div>
    <div style={styles.profileBodyDiv}>
      <span style={styles.profileMuted}>Email</span><br />
      Steperde124@example.com
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




