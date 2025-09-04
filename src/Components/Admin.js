import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logo from './logo.png';


const ApprovedList = () => {
  const [approvedData, setApprovedData] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch('https://darkslategrey-shrew-424102.hostingersite.com/api/get_certified_requests.php')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const approvedOnly = data.filter(item => item.status?.toLowerCase().trim() === 'approved');
          setApprovedData(approvedOnly);
        } else {
          setApprovedData([]);
        }
      })
      .catch(err => {
        console.error('❌ Fetch error:', err);
        alert('Failed to load approved data');
      });
  }, []);

  const handleView = (item) => setSelected(item);
  const handleClose = () => setSelected(null);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(approvedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Approved Requests");
  
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "approved_requests.xlsx");
  };
  
  const exportSelectedToPDF = () => {
    if (!selected) return;
  
    const doc = new jsPDF();
  
    const img = new Image();
    img.src = logo;
  
    img.onload = () => {
      // Add image
      doc.addImage(img, 'PNG', 10, 10, 40, 20);
    
      // Add text next to image
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("KCC Cottrell India Pvt. Ltd.", 55, 22); // adjust position as needed
    
      // Add date on top right
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Date: " + new Date().toLocaleDateString(), 160, 15);
    
      // Add heading below
      doc.setFontSize(16);
      doc.text("Approved Request Details", 14, 40);
      // 🔽 Table data
      const body = Object.entries(selected).map(([key, value]) => [
        key.replace(/_/g, ' ').toUpperCase(),
        value || "-"
      ]);
  
      autoTable(doc, {
        head: [["Field", "Value"]],
        body: body,
        startY: 50,
        theme: "grid",
        headStyles: { fillColor: [41, 128, 185] }
      });
  
      // 🔽 Save PDF
      doc.save(`Request_${selected.id}.pdf`);
    };
  
    img.onerror = () => {
      alert('Failed to load logo image.');
    };
  };

  return (
    <div style={{ padding: 30, fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: 28, marginBottom: 20 }}>Approved Requests</h1>

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

        {approvedData.length > 0 ? (
          approvedData.map((item, i) => (
            <div key={i} style={{ display: 'flex', padding: 12, borderBottom: '1px solid #eee' }}>
              <div style={{ flex: 1 }}>{item.from_date || '-'}</div>
              <div style={{ flex: 1 }}>{item.to_date || '-'}</div>
              <div style={{ flex: 1 }}>{item.department || '-'}</div>
              <div style={{ flex: 1 }}>{item.project_code || '-'}</div>
              <div style={{ flex: 1 }}>{item.place || '-'}</div>
              <div style={{ flex: 1 }}>
                <span style={{ background: '#27ae60', color: 'white', padding: '4px 10px', borderRadius: 10 }}>
                  Approved
                </span>
              </div>
              <div style={{ flex: 1 }}>
                <button
                  onClick={() => handleView(item)}
                  style={{
                    padding: '6px 12px',
                    border: 'none',
                    background: '#34495e',
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
          <div style={{ padding: 20, textAlign: 'center' }}>No approved requests found</div>
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

            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
 

  <button
    onClick={exportSelectedToPDF}
    style={{ padding: '8px 16px', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 5, cursor: 'pointer',margin:20, }}
  >
    Export to PDF
  </button>
</div>


            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 20,marginBottom:10, }}>
              <button style={modalStyles.closeBtn} onClick={handleClose}>Close</button>
            </div>
          </div>
        </div>
      )}
       <button
    onClick={exportToExcel}
    style={{ padding: '8px 26px ', background: '#2ecc71', color: '#fff', border: 'none', borderRadius: 5, cursor: 'pointer',marginTop:10 }}
  >
    Export to Excel
  </button>
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

export default ApprovedList;
