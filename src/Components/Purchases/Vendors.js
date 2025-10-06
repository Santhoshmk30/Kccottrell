import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function VendorForm() {
  const navigate = useNavigate();
  
  const initialFormData = {
    vendor_id: "",
    first_name: "",
    last_name: "",
    phone: "",
    company_name: "",
    email: "",
    pan_number: "",
    pan_file: null,
    gst_number: "",
    gst_file: null,
    is_msme: false,
    registration_type: "",
    registration_number: "",
    registration_file: null,
    tds: "",
    tds_file: null,
    billing_street: "",
    billing_city: "",
    billing_state: "",
    billing_pincode: "",
    shipping_street: "",
    shipping_city: "",
    shipping_state: "",
    shipping_pincode: "",
    bank_name: "",
    account_number: "",
    ifsc_code: "",
    cancelled_check_file: null,
    remarks: ""
  };

  const [formData, setFormData] = useState(initialFormData);
  const [activeTab, setActiveTab] = useState("other");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();

      // Append text fields
      Object.keys(formData).forEach((key) => {
        if (!key.includes("_file")) form.append(key, formData[key]);
      });

      // Append files
      ["pan_file", "gst_file", "registration_file", "tds_file", "cancelled_check_file"].forEach(
        (key) => {
          if (formData[key]) form.append(key, formData[key]);
        }
      );

      const response = await fetch(
        "https://darkslategrey-shrew-424102.hostingersite.com/api/create_vendor.php",
        { method: "POST", body: form }
      );

      const result = await response.json();

      if (result.status === "success") {
        alert(`Vendor created successfully! ID: ${result.vendor_id}`);
        setFormData(initialFormData);

        // Clear file inputs
        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach((input) => (input.value = ""));

        navigate("/dashboard");
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const styles = {
    container: {
      minHeight: "100vh",
      fontFamily: "'Segoe UI', Arial, sans-serif",
      backgroundImage: `url(${require("./background.jpg")})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      padding: "50px 20px",
    },
    heading: {
      textAlign: "center",
      fontSize: 28,
      fontWeight: 600,
      marginBottom: 35,
      color: "#fefeffff",
    },
    card: {
      borderRadius: 12,
      padding: 25,
      marginBottom: 25,
      boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
      transition: "0.3s",
    },
    inputContainer: {
      position: "relative",
      marginBottom: 20,
    },
    input: {
      width: "80%",
      padding: "14px 12px",
      fontSize: 15,
      borderRadius: 8,
      border: "1px solid #d1d5db",
      outline: "none",
      transition: "0.3s",
      background: "transparent",
      color: "#ffffff",
    },
    input1: {
      width: "20%",
      padding: "14px 12px",
      fontSize: 15,
      borderRadius: 8,
      border: "1px solid #d1d5db",
      outline: "none",
      transition: "0.3s",
      background: "transparent",
      color: "#ffffff",
    },
    input2: {
      width: "60%",
      padding: "14px 12px",
      fontSize: 15,
      borderRadius: 8,
      border: "1px solid #d1d5db",
      outline: "none",
      transition: "0.3s",
      background: "transparent",
      color: "#ffffff",
      marginTop: 12,
    },
    label: {
      position: "absolute",
      left: 14,
      top: 14,
      fontSize: 15,
      color: "#e3e5e9ff",
      pointerEvents: "none",
      transition: "0.3s all",
      background: "transparent",
      padding: "0 4px",
    },
    labelActive: {
      top: -8,
      left: 10,
      fontSize: 12,
      color: "#ffffff",
      background: "#1a1a1a",
      padding: "0 4px",
    },
    checkboxLabel: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      fontSize: 15,
      color: "#f9fbfdff",
      marginBottom: 20,
    },
    tabs: {
      display: "flex",
      gap: 12,
      marginBottom: 25,
      position: "relative",
      overflow: "hidden",
      boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
      borderRadius: 8,
      border: "1px solid #d1d5db",
      outline: "none",
      transition: "0.3s",
      background: "transparent",
      color: "#ffffff",
    },
    tabButton: (active) => ({
      flex: 1,
      padding: 14,
      border: "none",
      cursor: "pointer",
      fontWeight: 500,
      fontSize: 15,
      background: active
        ? "linear-gradient(90deg, #ec4d37, #1D1B1B)"
        : "rgba(255,255,255,0.2)",
      color: active ? "#fff" : "#e3e5e9",
      transition: "all 0.3s",
      borderRadius: active ? "12px" : "0",
    }),
    tabContent: {
      padding: 20,
      background: "transparent",
      borderRadius: 12,
      boxShadow: "0 6px 15px rgba(0,0,0,0.06)",
      transition: "0.3s",
    },
    addressContainer: {
      display: "flex",
      gap: 20,
      flexWrap: "wrap",
    },
    formSection: {
      flex: 1,
      minWidth: 250,
      background: "transparent",
      padding: 20,
      borderRadius: 10,
      boxShadow: "0 5px 15px rgba(0,0,0,0.04)",
    },
    textarea: {
      width: "100%",
      padding: 14,
      border: "1px solid #d1d5db",
      borderRadius: 8,
      resize: "vertical",
      marginBottom: 16,
      fontSize: 14,
      outline: "none",
      background: "transparent",
      color: "white",
    },
    button: {
      background: "linear-gradient(90deg, #ec4d37, #1D1B1B)",
      color: "#fff",
      border: "none",
      cursor: "pointer",
      padding: "16px 30px",
      borderRadius: 10,
      fontSize: 16,
      fontWeight: 500,
      transition: "all 0.3s",
      marginTop: 15,
    },
    select: {
      width: "21.5%",
      padding: "14px 12px",
      fontSize: 15,
      borderRadius: 8,
      border: "1px solid #d1d5db",
      outline: "none",
      transition: "0.3s",
      background: "transparent",
      color: "#ffffff",
      appearance: "none",
      WebkitAppearance: "none",
      MozAppearance: "none",
      position: "relative",
      zIndex: 2,
    },
    option: {
      background: "rgba(0,0,0,0.7)",
      color: "#ffffff",
      padding: "10px",
      border: "none",
    },
    selectLabel: {
      position: "absolute",
      left: 14,
      top: -8,
      fontSize: 12,
      color: "#ffffff",
      background: "rgba(0,0,0,0.6)",
      padding: "0 4px",
      borderRadius: 4,
      zIndex: 3,
    },
    fileUpload: {
      width: "calc(15% - 10px)",
      padding: "12px",
      fontSize: 14,
      borderRadius: 8,
      border: "1px solid #d1d5db",
      outline: "none",
      background: "transparent",
      color: "#ffffff",
      cursor: "pointer",
      marginLeft: 10,
      transition: "0.3s",
    },
  };

  const getLabelStyle = (field) =>
    formData[field] ? { ...styles.label, ...styles.labelActive } : styles.label;

  return (
    <form style={styles.container} onSubmit={handleSubmit}>
      <h2 style={styles.heading}>Vendor Details</h2>

      {/* Primary Contact */}
      <div style={styles.card}>
        <h3 style={{ fontSize: 16, marginBottom: 15, color: "#ffffff" }}>Primary Contact</h3>
        <div style={{ display: "flex", gap: 15, flexWrap: "wrap" }}>
          <div style={styles.inputContainer}>
            <input
              type="text"
              style={styles.input}
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
            />
            <label style={getLabelStyle("first_name")}>First Name</label>
          </div>
          <div style={styles.inputContainer}>
            <input
              type="text"
              style={styles.input}
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
            />
            <label style={getLabelStyle("last_name")}>Last Name</label>
          </div>
          <div style={styles.inputContainer}>
            <input
              type="tel"
              style={styles.input}
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
            <label style={getLabelStyle("phone")}>Phone</label>
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.inputContainer}>
          <input
            type="text"
            style={styles.input1}
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
          />
          <label style={getLabelStyle("company_name")}>Company Name</label>
        </div>

        <div style={styles.inputContainer}>
          <input
            type="email"
            style={styles.input1}
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <label style={getLabelStyle("email")}>Email</label>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {["other", "address", "bank", "remarks"].map((tab) => (
          <button
            type="button"
            key={tab}
            style={styles.tabButton(activeTab === tab)}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div style={styles.tabContent}>
        {/* --- OTHER TAB --- */}
        {activeTab === "other" && (
          <div>
            <div style={styles.inputContainer}>
              <input
                type="text"
                style={styles.input1}
                name="pan_number"
                value={formData.pan_number}
                onChange={handleChange}
              />
              <label style={getLabelStyle("pan_number")}>PAN Number</label>
              <input
                type="file"
                style={styles.fileUpload}
                name="pan_file"
                onChange={handleFileChange}
              />
            </div>

            <div style={styles.inputContainer}>
              <input
                type="text"
                style={styles.input1}
                name="gst_number"
                value={formData.gst_number}
                onChange={handleChange}
              />
              <label style={getLabelStyle("gst_number")}>GST Number</label>
              <input
                type="file"
                style={styles.fileUpload}
                name="gst_file"
                onChange={handleFileChange}
              />
            </div>

            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="is_msme"
                checked={formData.is_msme}
                onChange={handleChange}
              />
              MSME Registered
            </label>

            {formData.is_msme && (
              <>
                <div style={styles.inputContainer}>
                  <select
                    style={styles.select}
                    name="registration_type"
                    value={formData.registration_type}
                    onChange={handleChange}
                  >
                    <option style={styles.option} value="">
                      Select Type
                    </option>
                    <option style={styles.option} value="Micro">
                      Micro
                    </option>
                    <option style={styles.option} value="Small">
                      Small
                    </option>
                    <option style={styles.option} value="Medium">
                      Medium
                    </option>
                  </select>
                  <label style={styles.selectLabel}>Registration Type</label>
                </div>

                <div style={styles.inputContainer}>
                  <input
                    type="text"
                    style={styles.input1}
                    name="registration_number"
                    value={formData.registration_number}
                    onChange={handleChange}
                  />
                  <label style={getLabelStyle("registration_number")}>Registration Number</label>
                  <input
                    type="file"
                    style={styles.fileUpload}
                    name="registration_file"
                    onChange={handleFileChange}
                  />
                </div>
              </>
            )}

            <div style={styles.inputContainer}>
              <select
                style={styles.input1}
                name="tds"
                value={formData.tds}
                onChange={handleChange}
              >
                <option style={styles.option} value="">
                  Select a TDS
                </option>
                <option style={styles.option}>Commission or Brokerage [2%]</option>
                <option style={styles.option}>Commission or Brokerage (Reduced) [3.75%]</option>
                <option style={styles.option}>Dividend [10%]</option>
                <option style={styles.option}>Dividend (Reduced) [7.5%]</option>
                <option style={styles.option}>Other Interest than securities [10%]</option>
                <option style={styles.option}>Other Interest than securities (Reduced) [7.5%]</option>
                <option style={styles.option}>Payment of contractors for Others [2%]</option>
                <option style={styles.option}>Payment of contractors for Others (Reduced) [1.5%]</option>
                <option style={styles.option}>Payment of contractors HUF/Indiv [1%]</option>
                <option style={styles.option}>Payment of contractors HUF/Indiv (Reduced) [0.75%]</option>
                <option style={styles.option}>Professional Fees [10%]</option>
                <option style={styles.option}>Professional Fees (Reduced) [7.5%]</option>
                <option style={styles.option}>Rent on land or furniture etc [10%]</option>
                <option style={styles.option}>Rent on land or furniture etc (Reduced) [7.5%]</option>
                <option style={styles.option}>Technical Fees (2%) [2%]</option>
              </select>
              <input
                type="file"
                style={styles.fileUpload}
                name="tds_file"
                onChange={handleFileChange}
              />
              <label style={styles.selectLabel}>TDS</label>
            </div>
          </div>
        )}

        {/* --- ADDRESS TAB --- */}
        {activeTab === "address" && (
          <div style={styles.addressContainer}>
            <div style={styles.formSection}>
              <h3 style={{ fontWeight: 500, marginBottom: 15, color: "#ffffff" }}>Billing Address</h3>
              <div style={styles.inputContainer}>
                <textarea
                  rows={4}
                  style={styles.input}
                  name="billing_street"
                  value={formData.billing_street}
                  onChange={handleChange}
                />
                <label style={getLabelStyle("billing_street")}>Street</label>
              </div>
              <div style={styles.inputContainer}>
                <input
                  type="text"
                  style={styles.input}
                  name="billing_city"
                  value={formData.billing_city}
                  onChange={handleChange}
                />
                <label style={getLabelStyle("billing_city")}>City</label>
              </div>
              <div style={styles.inputContainer}>
                <input
                  type="text"
                  style={styles.input}
                  name="billing_state"
                  value={formData.billing_state}
                  onChange={handleChange}
                />
                <label style={getLabelStyle("billing_state")}>State</label>
              </div>
              <div style={styles.inputContainer}>
                <input
                  type="text"
                  style={styles.input}
                  name="billing_pincode"
                  value={formData.billing_pincode}
                  onChange={handleChange}
                />
                <label style={getLabelStyle("billing_pincode")}>Pin Code</label>
              </div>
            </div>

            <div style={styles.formSection}>
              <h3 style={{ fontWeight: 500, marginBottom: 15, color: "#ffffff" }}>Shipping Address</h3>
              <div style={styles.inputContainer}>
                <textarea
                  rows={4}
                  style={styles.input}
                  name="shipping_street"
                  value={formData.shipping_street}
                  onChange={handleChange}
                />
                <label style={getLabelStyle("shipping_street")}>Street</label>
              </div>
              <div style={styles.inputContainer}>
                <input
                  type="text"
                  style={styles.input}
                  name="shipping_city"
                  value={formData.shipping_city}
                  onChange={handleChange}
                />
                <label style={getLabelStyle("shipping_city")}>City</label>
              </div>
              <div style={styles.inputContainer}>
                <input
                  type="text"
                  style={styles.input}
                  name="shipping_state"
                  value={formData.shipping_state}
                  onChange={handleChange}
                />
                <label style={getLabelStyle("shipping_state")}>State</label>
              </div>
              <div style={styles.inputContainer}>
                <input
                  type="text"
                  style={styles.input}
                  name="shipping_pincode"
                  value={formData.shipping_pincode}
                  onChange={handleChange}
                />
                <label style={getLabelStyle("shipping_pincode")}>Pin Code</label>
              </div>
            </div>
          </div>
        )}

        {/* --- BANK TAB --- */}
        {activeTab === "bank" && (
          <div style={styles.formSection}>
            <h3 style={{ fontWeight: 500, marginBottom: 15, color: "#ffffff" }}>Bank Details</h3>
            <div style={styles.inputContainer}>
              <input
                type="text"
                style={styles.input}
                name="bank_name"
                value={formData.bank_name}
                onChange={handleChange}
              />
              <label style={getLabelStyle("bank_name")}>Bank Name</label>
            </div>
            <div style={styles.inputContainer}>
              <input
                type="text"
                style={styles.input}
                name="account_number"
                value={formData.account_number}
                onChange={handleChange}
              />
              <label style={getLabelStyle("account_number")}>Account Number</label>
            </div>
            <div style={styles.inputContainer}>
              <input
                type="text"
                style={styles.input}
                name="ifsc_code"
                value={formData.ifsc_code}
                onChange={handleChange}
              />
              <label style={getLabelStyle("ifsc_code")}>IFSC Code</label>
            </div>
            <div style={styles.inputContainer}>
              <input
                type="file"
                style={styles.fileUpload}
                name="cancelled_check_file"
                onChange={handleFileChange}
              />
            </div>
          </div>
        )}

        {/* --- REMARKS TAB --- */}
        {activeTab === "remarks" && (
          <div>
            <textarea
              rows={5}
              style={styles.textarea}
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              placeholder="Any additional remarks..."
            />
          </div>
        )}
      </div>

      <button style={styles.button} type="submit">
        Submit Vendor
      </button>
    </form>
  );
}
