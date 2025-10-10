import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VendorsTable = () => {
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "vendor_id", direction: "asc" });

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://darkslategrey-shrew-424102.hostingersite.com/api/get_vendors.php")
      .then((res) => {
        if (res.data.status === "success") {
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

  // Verify function
  const handleVerify = async (vendor) => {
    try {
      await axios.post(
        "https://darkslategrey-shrew-424102.hostingersite.com/api/update_vendor_status.php",
        {
          vendor_id: vendor.vendor_id,
          status: "Verified",
        }
      );

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

      <input
        type="text"
        placeholder="Search by name or company..."
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        style={styles.search}
      />

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
              <tr key={vendor.vendor_id} style={styles.tr}>
                <td>{vendor.vendor_id}</td>
                <td>{vendor.company_name}</td>
                <td>{vendor.gst_number}</td>
                <td>{vendor.pan_number}</td>
                <td>{vendor.bank_name}</td>
                <td>{vendor.account_number}</td>
                <td>{vendor.ifsc_code}</td>
                <td>
                  {vendor.status !== "Verified" ? (
                    <button style={styles.verifyBtn} onClick={() => handleVerify(vendor)}>
                      Verify
                    </button>
                  ) : (
                    <span style={{ color: "green", fontWeight: "600" }}>Verified</span>
                  )}
                </td>
                <td>
                  <button
                    style={styles.viewBtn}
                    onClick={() => navigate(`/vendor/${vendor.vendor_id}`)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: "30px", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", backgroundColor: "#f4f6f8", minHeight: "100vh" },
  title: { color: "#333", marginBottom: "20px", fontSize: "28px", fontWeight: "700" },
  search: { width: "100%", maxWidth: "400px", padding: "10px 15px", borderRadius: "8px", border: "1px solid #ccc", marginBottom: "25px", fontSize: "16px" },
  tableWrapper: { overflowX: "auto", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", borderRadius: "10px" },
  table: { width: "100%", borderCollapse: "collapse", backgroundColor: "#fff", minWidth: "800px" },
  th: { padding: "14px", backgroundColor: "#da9589ff", color: "#020202ff", cursor: "pointer", textAlign: "left", fontSize: "15px", position: "sticky", top: 0 },
  tr: { borderBottom: "1px solid #695757ff", transition: "background-color 0.2s" },
  verifyBtn: { padding: "6px 14px", backgroundColor: "#ffc107", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "500" },
  viewBtn: { padding: "6px 14px", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "500" },
};

export default VendorsTable;
