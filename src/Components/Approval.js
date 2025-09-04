import React, { useEffect, useState } from 'react';

const Approval = () => {
  const [certified, setCertified] = useState([]);
  const [selected, setSelected] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('All');

  useEffect(() => {
    fetch('https://darkslategrey-shrew-424102.hostingersite.com/api/get_certified_requests.php')
      .then(res => res.json())
      .then(data => {
        console.log('✅ Fetched data:', data);
        if (Array.isArray(data)) {
          setCertified(data);
        } else {
          console.warn('⚠️ API did not return an array:', data);
          setCertified([]);
        }
      })
      .catch(err => {
        console.error('❌ Fetch error:', err);
        alert('API Error: ' + err.message);
      });
  }, []);

  const statusOptions = ['All', 'Certified', 'Approved', 'Rejected'];

  const filteredCertified = certified.filter(item => {
    const status = item.status?.toLowerCase().trim();
    if (selectedStatus === 'All') return ['certified', 'approved', 'rejected'].includes(status);
    return status === selectedStatus.toLowerCase();
  });

  const handleView = (item) => setSelected(item);
  const handleClose = () => setSelected(null);

  const updateStatus = (id, newStatus) => {
    const payload = { id, status: newStatus };

    console.log("📤 Sending to backend:", payload);

    fetch("https://darkslategrey-shrew-424102.hostingersite.com/api/update_status.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        console.log("✅ Response from backend:", data);
        if (data.status === "success") {
          setCertified(prev =>
            prev.map(req => req.id === id ? { ...req, status: newStatus } : req)
          );
          setSelected(null);
        } else {
          alert("Update failed");
        }
      })
      .catch(err => {
        console.error("❌ Fetch error:", err);
        alert("Network error occurred");
      });
  };

  return (
    <div style={{ padding: 30, fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: 28, marginBottom: 20 }}>Requests</h1>

      {/* Status Filter Buttons */}
      <div style={{ marginBottom: 20 }}>
        {statusOptions.map(status => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            style={{
              padding: '8px 16px',
              marginRight: 10,
              borderRadius: 6,
              border: selectedStatus === status ? '2px solid #333' : '1px solid #ccc',
              backgroundColor: selectedStatus === status ? '#333' : '#f2f2f2',
              color: selectedStatus === status ? '#fff' : '#000',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Table Header */}
      <div style={{ border: '1px solid #ccc', borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ display: 'flex', padding: 12, background: '#f2f2f2', fontWeight: 'bold' }}>
          <div style={{ flex: 1 }}>From</div>
          <div style={{ flex: 1 }}>To</div>
          <div style={{ flex: 1 }}>Department</div>
          <div style={{ flex: 1 }}>Project</div>
          <div style={{ flex: 1 }}>Place</div>
          <div style={{ flex: 1 }}>Status</div>
          <div style={{ flex: 1 }}>Action</div>
        </div>

        {/* Data Rows */}
        {filteredCertified.length > 0 ? (
          filteredCertified.map((item, i) => (
            <div key={i} style={{ display: 'flex', padding: 12, borderBottom: '1px solid #eee' }}>
              <div style={{ flex: 1 }}>{item.from_date || '-'}</div>
              <div style={{ flex: 1 }}>{item.to_date || '-'}</div>
              <div style={{ flex: 1 }}>{item.department || '-'}</div>
              <div style={{ flex: 1 }}>{item.project_code || '-'}</div>
              <div style={{ flex: 1 }}>{item.place || '-'}</div>
              <div style={{ flex: 1 }}>
                <span
                  style={{
                    background:
                      item.status === 'Certified' ? '#2980b9' :
                      item.status === 'Approved' ? '#27ae60' :
                      item.status === 'Rejected' ? '#e74c3c' : '#bdc3c7',
                    color: 'white',
                    padding: '4px 10px',
                    borderRadius: 10
                  }}
                >
                  {item.status}
                </span>
              </div>
              <div style={{ flex: 1 }}>
                <button
                  onClick={() => handleView(item)}
                  style={{
                    padding: '6px 12px',
                    border: 'none',
                    background: '#333',
                    color: '#fff',
                    borderRadius: 4,
                    cursor: 'pointer'
                  }}
                >
                  View
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ padding: 20, textAlign: 'center' }}>No data available for this status</div>
        )}
      </div>

      {/* Modal */}
      {selected && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.card}>
            <h2 style={modalStyles.title}>Request Details</h2>

            <div style={modalStyles.detailGrid}>
              {Object.entries(selected).map(([key, value], index) => (
                <div key={index} style={modalStyles.row}>
                  <div style={modalStyles.label}>{key.replace(/_/g, ' ').toUpperCase()}</div>
                  <div style={modalStyles.value}>{value !== null && value !== "" ? value : '-'}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-around', paddingTop: 20 }}>
              <button
                style={{ ...modalStyles.btn, backgroundColor: '#27ae60' }}
                onClick={() => updateStatus(selected.id, 'Approved')}
              >
                Approve
              </button>
              <button
                style={{ ...modalStyles.btn, backgroundColor: '#e74c3c' }}
                onClick={() => updateStatus(selected.id, 'Rejected')}
              >
                Reject
              </button>
              <button style={modalStyles.closeBtn} onClick={handleClose}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999
  },
  card: {
    background: '#fefefe',
    borderRadius: '12px',
    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.2)',
    width: '90%',
    maxWidth: '700px',
    maxHeight: '85vh',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    scrollbarWidth: 'none', 
    msOverflowStyle: 'none'
  },
  
  title: {
    background: 'linear-gradient(to right, #4facfe, #00f2fe)',
    padding: '20px',
    borderTopLeftRadius: '12px',
    borderTopRightRadius: '12px',
    color: '#fff'
  },
  detailGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    padding: '20px'
  },
  row: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f7f9fa',
    borderRadius: '8px',
    padding: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
  },
  label: {
    fontSize: '12px',
    color: '#7f8c8d',
    marginBottom: '4px',
    fontWeight: 600
  },
  value: {
    fontSize: '14px',
    color: '#2c3e50',
    fontWeight: 500
  },
  btn: {
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: 6,
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  closeBtn: {
    backgroundColor: '#bdc3c7',
    color: '#2c3e50',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer'
  }
};

export default Approval;
