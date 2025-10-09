import React, { useState, useEffect } from "react";
import axios from "axios";

const VendorsTable = () => {
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
  const [selectedVendor, setSelectedVendor] = useState(null);

  useEffect(() => {
    axios
      .get("https://darkslategrey-shrew-424102.hostingersite.com/api/get_vendors.php")
      .then((res) => {
        if (res.data.status === "success") {
          // Set default status to "Pending" if not present
          const vendorsWithStatus = res.data.data.map((vendor) => ({
            ...vendor,
            status: vendor.status || "Pending",
          }));
          setVendors(vendorsWithStatus);
          setFilteredVendors(vendorsWithStatus);
        }
      })
      .catch((err) => console.error("Error fetching vendors:", err));
  }, []);

  // Search filter
  const handleSearch = (text) => {
    setSearch(text);
    const filtered = vendors.filter(
      (item) =>
        item.first_name?.toLowerCase().includes(text.toLowerCase()) ||
        item.last_name?.toLowerCase().includes(text.toLowerCase()) ||
        item.company_name?.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredVendors(filtered);
  };

  // Sorting
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });

    const sorted = [...filteredVendors].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredVendors(sorted);
  };

  // Close modal
  const closeModal = () => setSelectedVendor(null);

  // Verify function
  const handleVerify = async (vendor) => {
    try {
      // API call to update status in DB
      await axios.post(
        "https://darkslategrey-shrew-424102.hostingersite.com/api/update_vendor_status.php",
        {
          vendor_id: vendor.vendor_id,
          status: "Verified",
        }
      );

      // Update local state
      const updatedVendors = vendors.map((v) =>
        v.vendor_id === vendor.vendor_id ? { ...v, status: "Verified" } : v
      );
      setVendors(updatedVendors);
      setFilteredVendors(updatedVendors);

      alert(`${vendor.company_name} has been verified!`);
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to verify vendor.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Vendor Management</h2>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search by name or company..."
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        style={styles.search}
      />

      {/* Responsive Table */}
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              {[
                "vendor_id",
                "company_name",
                "gst_number",
                "pan_number",
                "bank_name",
                "account_number",
                "ifsc_code",
              ].map((col) => (
                <th key={col} style={styles.th} onClick={() => handleSort(col)}>
                  {col.replace("_", " ").toUpperCase()}{" "}
                  {sortConfig.key === col ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                </th>
              ))}
              <th style={styles.th}>Verify</th>
              <th style={styles.th}>View</th>
            </tr>
          </thead>

          <tbody>
            {filteredVendors.map((vendor) => (
              <tr key={vendor.id} style={styles.tr}>
                <td>{vendor.vendor_id}</td>
                <td>{vendor.company_name}</td>
                <td>{vendor.gst_number}</td>
                <td>{vendor.pan_number}</td>
                <td>{vendor.bank_name}</td>
                <td>{vendor.account_number}</td>
                <td>{vendor.ifsc_code}</td>
                <td>
  {vendor.status !== "Verified" ? (
    <button
      style={styles.verifyBtn}
      onClick={() => handleVerify(vendor)}
    >
      Verify
    </button>
  ) : (
    <span style={{ color: "green", fontWeight: "600" }}>Verified</span>
  )}
</td>

                <td>
                  <button style={styles.viewBtn} onClick={() => setSelectedVendor(vendor)}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedVendor && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>{selectedVendor.company_name} Details</h3>
            <button style={styles.closeBtn} onClick={closeModal}>
              ×
            </button>
            <div style={styles.modalContent}>
              {Object.keys(selectedVendor).map((key) => (
                <div style={styles.detailRow} key={key}>
                  <span style={styles.detailKey}>{key.replace("_", " ").toUpperCase()}</span>
                  <span style={styles.detailValue}>{selectedVendor[key]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "30px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f4f6f8",
    minHeight: "100vh",
  },
  title: { color: "#333", marginBottom: "20px", fontSize: "28px", fontWeight: "700" },
  search: {
    width: "100%",
    maxWidth: "400px",
    padding: "10px 15px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginBottom: "25px",
    fontSize: "16px",
  },
  tableWrapper: {
    overflowX: "auto",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    borderRadius: "10px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#fff",
    minWidth: "800px",
  },
  th: {
    padding: "14px",
    backgroundColor: "#da9589ff",
    color: "#020202ff",
    cursor: "pointer",
    textAlign: "left", // Header text left-aligned
    fontSize: "15px",
    position: "sticky",
    top: 0,
  },
  tr: {
    borderBottom: "1px solid #695757ff",
    transition: "background-color 0.2s",
  },
  td: {
    padding: "20px",
    fontSize: "14px",
    color: "#333",
    textAlign: "center", // Cell values centered
  },
  verifyBtn: {
    padding: "6px 14px",
    backgroundColor: "#ffc107",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
  },
  viewBtn: {
    padding: "6px 14px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
    padding: "10px",
  },
  modal: {
    backgroundColor: "#fff",
    padding: "25px 35px",
    borderRadius: "15px",
    width: "100%",
    maxWidth: "600px",
    maxHeight: "90vh",
    overflowY: "auto",
    position: "relative",
    boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
  },
  closeBtn: {
    position: "absolute",
    top: "12px",
    right: "20px",
    fontSize: "24px",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontWeight: "700",
  },
  modalContent: { marginTop: "20px" },
  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    borderBottom: "1px solid #eee",
  },
  detailKey: { fontWeight: "600", color: "#555" },
  detailValue: { color: "#333" },
};


export default VendorsTable;
