
import React, {useEffect, useState } from "react";

const PurchaseOrder = () => {
  const [formData, setFormData] = useState({
    vendorCode: "",
    orderNo: "",
    date: "",
    goods: "",
    qty: "",
    contactPerson1: "",
    mobile1: "",
    email1: "",
    contactPerson2: "",
    phone2: "",
    email2: "",
    gst1: "",
    pan1: "",
    gst2: "",
    pan2: "",
    reference: "",
    note: "",
    supplier_name: "",
    in_favour_of: "",
    billing_street: "",
    billing_city: "",
    billing_state: "",
    billing_pincode: "",
    address: "",

  });

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  

   const handleChange1 = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;

    // Recalculate amount
    const qty = parseFloat(updatedRows[index].quantity) || 0;
    const rate = parseFloat(updatedRows[index].rate) || 0;
    const amount = qty * rate;
    updatedRows[index].amount = amount;

    // Recalculate GST
    const gstPercent = parseFloat(updatedRows[index].gstPercent) || 0;
    updatedRows[index].gstAmount = (amount * gstPercent) / 100;

    setRows(updatedRows);
  };


const handleGstChange = (index, value) => {
  setRows(prevRows => {
    const newRows = [...prevRows];
    newRows[index].gstPercent = value;
    const amount = parseFloat(newRows[index].amount) || 0;
    newRows[index].gstAmount = (amount * value) / 100;
    return newRows;
  });
};

 const [rows, setRows] = useState([{ id: 1, invoiceNo: '', hsnSac: '', quantity: '', rate: '', per: '', basicValue: '',gstPercent: 0, gstAmount: 0  }]);

  const addRow = () => setRows([...rows, { id: Date.now(), invoiceNo: '', hsnSac: '', quantity: '', rate: '', per: '', basicValue: '' }]);
  const deleteRow = (index) => setRows(rows.filter((_, i) => i !== index));

  const subtotal = rows.reduce(
  (sum, r) =>
    sum + (parseFloat(r.amount) || 0) + (parseFloat(r.gstAmount) || 0),
  0
);


    const [suppliers, setSuppliers] = useState([]); // <-- suppliers list

const [suppliersData, setSuppliersData] = useState([]); // full API data

 
   // Fetch suppliers once
    useEffect(() => {
      fetch("https://darkslategrey-shrew-424102.hostingersite.com/api/vendors_data.php")
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data) {
            const uniqueCompanies = Array.from(new Set(data.data.map(v => v.company_name)));
            setSuppliers(uniqueCompanies);
            setSuppliersData(data.data);
          }
        })
        .catch(err => console.error('Error fetching suppliers:', err));
    }, []);

 
  // State to manage date and time
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');

  // Handle date and time change
  const handleDateChange = (e) => setDeliveryDate(e.target.value);
  const handleTimeChange = (e) => setDeliveryTime(e.target.value);


 const handleSupplierChange = (e) => {
    const value = e.target.value;

    setFormData((prev) => {
      const updatedData = { ...prev, supplier_name: value };

      // Auto-fill "In Favour Of" only if empty
      if (!prev.in_favour_of) updatedData.in_favour_of = value;

      const supplierInfo = suppliersData.find(
        (s) => s.company_name === value
      );

      if (supplierInfo) {
        // Billing / Address
        updatedData.billing_street = supplierInfo.billing_street || "";
        updatedData.billing_city = supplierInfo.billing_city || "";
        updatedData.billing_state = supplierInfo.billing_state || "";
        updatedData.billing_pincode = supplierInfo.billing_pincode || "";
        updatedData.address = `${supplierInfo.billing_street || ""}\n${supplierInfo.billing_city || ""}, ${supplierInfo.billing_state || ""} - ${supplierInfo.billing_pincode || ""}`;

        // Contact details
        updatedData.contactPerson1 = supplierInfo.first_name || "";
        updatedData.mobile1 = supplierInfo.phone || "";
        updatedData.email1 = supplierInfo.email || "";

        // GST / PAN
        updatedData.gst1 = supplierInfo.gst_number|| "";
        updatedData.pan1 = supplierInfo.pan_number || "";
      } else {
        // Clear all fields if no supplier selected
        updatedData.billing_street = "";
        updatedData.billing_city = "";
        updatedData.billing_state = "";
        updatedData.billing_pincode = "";
        updatedData.address = "";
        updatedData.contactPerson1 = "";
        updatedData.mobile1 = "";
        updatedData.email1 = "";
        updatedData.gst1 = "";
        updatedData.pan1 = "";
      }

      return updatedData;
    });



  // Exit early if no value or suppliers data is empty
  if (!value || suppliersData.length === 0) return;


};




  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    alert("Purchase Order Submitted Successfully!");
  };

  const styles = {
    container: {
      maxWidth: "1200px",
      margin: "30px auto",
      fontFamily: "Arial, sans-serif",
      color: "#333",
      backgroundColor: "#f8f9fa",
      padding: "20px",
    },
    row: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-between",
      marginBottom: "20px",
      gap: "10px",
    },
    th: {
    padding: "10px",
    border: "1px solid #ddd",
    textAlign: "center",
    fontWeight: "600",
    fontSize: "14px",
  },
  td: {
    padding: "6px",
    border: "1px solid #ddd",
    textAlign: "center",
    fontSize: "13px",
  },
  inputWide: {
    width: "90%",
    padding: "5px 8px",
    border: "1px solid #ccc",
    borderRadius: 4,
    outline: "none",
  },
  
    input1: {
      margin: "5px",
      padding: "8px",
      borderRadius: "4px",
      border: "1px solid #ccc",
    },

  inputSmall: {
    width: "70px",
    padding: "4px 6px",
    border: "1px solid #ccc",
    borderRadius: 4,
    outline: "none",
    textAlign: "center",
  },
    card: {
      flex: "1",
      minWidth: "300px",
      background: "#fff",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      overflow: "hidden",
      border: "1px solid #eee",
    },
    header: (color1, color2) => ({
      background: `linear-gradient(to right, ${color1}, ${color2})`,
      color: "#fff",
      padding: "8px 15px",
      fontWeight: "bold",
      fontSize: "13px",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    }),
    body: {
      padding: "15px",
      fontSize: "14px",
      lineHeight: "1.6",
    },
    fieldRow: {
      display: "flex",
      alignItems: "center",
      marginBottom: "10px",
      gap: "10px",
    },
    label: {
      width: "110px",
      color: "#007bff",
      fontWeight: "bold",
      fontSize: "13px",
      textAlign: "right",
    },
    input: {
      flex: 1,
      border: "1px solid #ccc",
      borderRadius: "4px",
      padding: "6px",
      fontSize: "14px",
    },
    textArea: {
      width: "100%",
      border: "1px solid #ccc",
      borderRadius: "4px",
      padding: "6px",
      fontSize: "14px",
      minHeight: "60px",
      resize: "vertical",
    },
    noteBox: {
      background: "#eef5ff",
      borderRadius: "8px",
      padding: "20px",
      lineHeight: "1.8",
      fontSize: "14px",
    },
    button: {
      background: "linear-gradient(to right, #2575fc, #6a11cb)",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      padding: "10px 25px",
      cursor: "pointer",
      fontWeight: "bold",
      marginTop: "20px",
      display: "block",
      width: "100%",
    },
      
  cardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "20px",
    marginTop: "10px", // below gradient
  },
  logo: 
    { width: 180, height: 80, objectFit: "contain" },
  companyName: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#333",
  },
  title: {
    textAlign: "center",
    fontSize: "24px",
    marginBottom: "20px",
    color: "#333",
    fontWeight: "bold",
  },
bottomLine: {
  height: "5px",
  width: "80%",
  margin: "1px auto 0",
  borderRadius: "3px",
  background: "linear-gradient(to right, transparent, #2575fc, #6a11cb, transparent)",
  marginBottom:"20px",
},

section: {
      padding: "15px",
      marginBottom: "15px",
      borderRadius: "8px",
    },
    title1: {
      fontSize: "18px",
      fontWeight: "bold",
      color:"#1e90ff"
    },
    title2: {
      fontSize: "18px",
      fontWeight: "bold",
       color:"#17a2b8"
    },
    title3: {
      fontSize: "18px",
      fontWeight: "bold",
       color:"#b817abff"
    },
    paragraph: {
      fontSize: "16px",
    },
    pricesScope: {
      backgroundColor: "#cce6ff", // Light blue background
      borderLeft: "5px solid #1e90ff", // Blue left border
    },
    specialConditions: {
      backgroundColor: "#d9f7ff", // Light green background
      borderLeft: "5px solid #17a2b8", // Green left border
    },
    technicalQuality: {
      backgroundColor: "#fed9ffff", // Light cyan background
      borderLeft: "5px solid #b817abff", // Cyan left border
    },
    rejection: {
      backgroundColor: "#fff2e6", // Light orange background
      borderLeft: "5px solid #fd7e14", // Orange left border
    },
    cancellation: {
      backgroundColor: "#f8d7da", // Light red background
      borderLeft: "5px solid #dc3545", // Red left border
    },
    subContracting: {
      backgroundColor: "#f1f1f1", // Light grey background
      borderLeft: "5px solid #6c757d", // Grey left border
    },
    container1: {
      maxWidth: "1200px",
      margin: "30px auto",
      fontFamily: "Arial, sans-serif",
      color: "#333",
      backgroundColor: "#f0f8ff", // Light blue background
      padding: "20px",
      borderRadius: "8px", // Rounded corners
      border: "1px solid #e0e0e0", // Light gray border
    },

        list: {
      listStyleType: "none",
      paddingLeft: "0",
    },
    listItem: {
      fontSize: "14px",
      marginBottom: "10px",
    },
    listItemBold: {
      fontWeight: "bold",
      color: "#4B0082", // Purple for the bold section headings
    },
    descriptionText: {
      color: "#333", // Regular blackish color for descriptions
      marginLeft: "20px", // Indentation for the description
      marginTop: "5px",
    },
    subListItem: {
      fontSize: "14px",
      marginLeft: "40px", // Further indent for sublist items
      color: "#333",
    },


  };
// Helper function to convert number to words
function numberToWords(num) {
  const a = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen",
    "Sixteen", "Seventeen", "Eighteen", "Nineteen"
  ];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  if (num === 0) return "Zero";

  function inWords(n) {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
    if (n < 1000) return a[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + inWords(n % 100) : "");
    if (n < 100000) return inWords(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + inWords(n % 1000) : "");
    if (num < 10000000) return inWords(Math.floor(n / 100000)) + " Lakh" + (n % 100000 ? " " + inWords(n % 100000) : "");
    return inWords(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 ? " " + inWords(n % 10000000) : "");
  }

  return inWords(num);
}

  return (
    <form style={styles.container} onSubmit={handleSubmit}>
          <div style={styles.topGradient}></div>

    {/* Logo + Company Name */}
    <div style={styles.cardHeader}>
      <img
        src="/logologin.png" // replace with your logo path
        alt="Logo"
        style={styles.logo}
      />
      <h3 style={styles.companyName}>KC Cottrell Engineering Services Private Limited</h3>
    </div>

  
    <div style={styles.topLine}></div>

    {/* Title */}
    <h2 style={styles.title}>Purchase Order</h2>

    {/* Bottom Gradient Line */}
    <div style={styles.bottomLine}></div>


      {/* Supplier & Purchase Details */}
      <div style={styles.row}>
        {/* Supplier */}
        <div style={styles.card}>
          <div style={styles.header("#007bff", "#00c6ff")}>SUPPLIER</div>
          <div style={styles.body}>
            <div style={styles.fieldRow}>
               <label style={styles.label}>Supplier’s Name</label>
    <select
      name="supplier_name"
      style={styles.input}
      value={formData.supplier_name}
      onChange={handleSupplierChange}
    >
      <option value="">Select Supplier</option>
      {suppliers.map((company, idx) => (
        <option key={idx} value={company}>{company}</option>
      ))}
    </select>
            </div>
            <div style={styles.fieldRow}>
              <label style={styles.label}>Address:</label>
              
        <textarea
          style={{ display: "block", width: "100%", padding: "8px", marginTop: "5px" }}
          value={formData.address}
          onChange={(e) => handleChange("address", e.target.value)}
          rows={4}
        />

            </div>
          </div>
        </div>

        {/* Purchase Details */}
        <div style={styles.card}>
          <div style={styles.header("#9b2bcf", "#d657d4")}>PURCHASE DETAILS</div>
          <div style={styles.body}>
            <div style={styles.fieldRow}>
              <label style={styles.label}>Order No.</label>
              <input
                style={styles.input}
                value={formData.orderNo}
                onChange={(e) => handleChange("orderNo", e.target.value)}
              />
            </div>
            <div style={styles.fieldRow}>
              <label style={styles.label}>Date</label>
              <input
                type="date"
                style={styles.input}
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
              />
            </div>
            <div style={styles.fieldRow}>
              <label style={styles.label}>Goods/Services</label>
             <textarea
  style={{
    ...styles.input,
    overflow: "hidden",
    resize: "none",
  }}
  value={formData.goods}
  onChange={(e) => {
    handleChange("goods", e.target.value);

    // Auto-resize height
    e.target.style.height = "auto"; // reset
    e.target.style.height = e.target.scrollHeight + "px"; // set to scroll height
  }}
  rows={1} // start with 1 row
/>

            </div>
            <div style={styles.fieldRow}>
              <label style={styles.label}>Qty.</label>
              <input
                style={styles.input}
                value={formData.qty}
                onChange={(e) => handleChange("qty", e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Supplier Details */}
        <div style={styles.row}>
      <div style={styles.card}>
        <div style={styles.header("#00997a", "#00d4a0")}>SUPPLIER DETAILS</div>
        <div style={styles.body}>
          <div style={styles.row}>
            <div style={{ flex: 1 }}>
                    <div style={styles.fieldRow}>
        <label style={styles.label}>Contact Person</label>
        <input
          style={styles.input}
          value={formData.contactPerson1}
          onChange={(e) => handleChange("contactPerson1", e.target.value)}
        />
      </div>

                    <div style={styles.fieldRow}>
        <label style={styles.label}>Mobile No</label>
        <input
          style={styles.input}
          value={formData.mobile1}
          onChange={(e) => handleChange("mobile1", e.target.value)}
        />
      </div>

             
      <div style={styles.fieldRow}>
        <label style={styles.label}>Email</label>
        <input
          style={styles.input}
          value={formData.email1}
          onChange={(e) => handleChange("email1", e.target.value)}
        />
      </div>

              <div style={{ flex: 1 }}>
            
      <div style={styles.fieldRow}>
        <label style={styles.label}>GST No.</label>
        <input
          style={styles.input}
          value={formData.gst1}
          onChange={(e) => handleChange("gst1", e.target.value)}
        />
      </div>

                    <div style={styles.fieldRow}>
        <label style={styles.label}>PAN No.</label>
        <input
          style={styles.input}
          value={formData.pan1}
          onChange={(e) => handleChange("pan1", e.target.value)}
        />
      </div>

            </div>
            </div>
            
          </div>
        </div>
      </div>

      {/* Purchaser Details */}
      <div style={{ ...styles.card}}>
        <div style={styles.header("#ff7e00", "#ffb347")}>PURCHASER DETAILS</div>
        <div style={styles.body}>
         
           <div style={{ flex: 1 }}>
              <div style={styles.fieldRow}>
                <label style={styles.label}>Contact Person</label>
                <input
                  style={styles.input}
                  value={formData.contactPerson2}
                  onChange={(e) => handleChange("contactPerson2", e.target.value)}
                />
              </div>
              <div style={styles.fieldRow}>
                <label style={styles.label}>Phone</label>
                <input
                  style={styles.input}
                  value={formData.phone1}
                  onChange={(e) => handleChange("phone2", e.target.value)}
                />
              </div>
              <div style={styles.fieldRow}>
                <label style={styles.label}>Email</label>
                <input
                  style={styles.input}
                  value={formData.email2}
                  onChange={(e) => handleChange("email2", e.target.value)}
                />
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={styles.fieldRow}>
                <label style={styles.label}>GST No.</label>
                <input
                  style={styles.input}
                  value={formData.gst2}
                  onChange={(e) => handleChange("gst2", e.target.value)}
                />
              </div>
              <div style={styles.fieldRow}>
                <label style={styles.label}>PAN No.</label>
                <input
                  style={styles.input}
                  value={formData.pan2}
                  onChange={(e) => handleChange("pan2", e.target.value)}
                />
              </div>
            </div>
        </div>
      </div>
</div>
      {/* References */}
      <div style={{ ...styles.card, marginTop: "20px" }}>
        <div style={styles.header("#e91e63", "#ff4081")}>REFERENCES :</div>
        <div style={styles.body}>
          <textarea
            style={styles.textArea}
            value={formData.reference}
            onChange={(e) => handleChange("reference", e.target.value)}
          />
        </div>
      </div>






           {/* Item Table */}
<div style={{ overflowX: "auto", marginBottom: 20 ,marginTop:"20px"}}>
    <h3 style={{ textAlign: "center", marginBottom: 20, fontFamily: "Arial, sans-serif" }}>
    Annexure - A
  </h3>

   <table
    style={{
      width: "100%",
      borderCollapse: "collapse",
      minWidth: 800,
      border: "1px solid #ddd",
      borderRadius: 8,
      overflow: "hidden",
      fontFamily: "Arial, sans-serif",
    }}
  >
    <thead
      style={{
        backgroundColor: "#007BFF",
        color: "#fff",
        position: "sticky",
        top: 0,
        zIndex: 2,
      }}
    >
      <tr>
        <th style={styles.th}>Item.No</th>
        <th style={styles.th}>Item</th>
        <th style={styles.th}>HSN/SAC</th>
        <th style={styles.th}>Quantity</th>
        <th style={styles.th}>Rate</th>
        <th style={styles.th}>Per</th>
        <th style={styles.th}>Amount</th>
        <th style={styles.th}>GST</th>
        <th style={styles.th}>Action</th>
      </tr>
    </thead>
    <tbody>
      {rows.map((row, i) => (
        <tr
          key={i}
          style={{
            backgroundColor: i % 2 === 0 ? "#f9fbff" : "#ffffff",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#e6f2ff")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.background =
              i % 2 === 0 ? "#f9fbff" : "#ffffff")
          }
        >
          <td style={styles.td}>{i + 1}</td>

          {/* Item */}
          <td style={styles.td}>
            <input
              style={styles.inputWide}
              value={row.item}
              onChange={(e) => handleChange1(i, "item", e.target.value)}
            />
          </td>

          {/* HSN/SAC */}
          <td style={styles.td}>
            <input
              style={styles.inputSmall}
              value={row.hsnSac}
              onChange={(e) => handleChange1(i, "hsnSac", e.target.value)}
            />
          </td>

          {/* Quantity */}
          <td style={styles.td}>
            <input
              type="number"
              style={styles.inputSmall}
              value={row.quantity}
              onChange={(e) => handleChange1(i, "quantity", e.target.value)}
            />
          </td>

          {/* Rate */}
          <td style={styles.td}>
            <input
              type="number"
              style={styles.inputSmall}
              value={row.rate}
              onChange={(e) => handleChange1(i, "rate", e.target.value)}
            />
          </td>

          {/* Per */}
          <td style={styles.td}>
            <input
              style={styles.inputSmall}
              value={row.per}
              onChange={(e) => handleChange1(i, "per", e.target.value)}
            />
          </td>

          {/* Amount */}
          <td style={styles.td}>
            <input
              type="number"
              style={{
                ...styles.inputSmall,
                WebkitAppearance: "none",
                MozAppearance: "textfield",
                appearance: "none",
              }}
              value={row.amount === 0 ? "" : row.amount}
              onChange={(e) => handleChange1(i, "amount", e.target.value)}
              onKeyDown={(e) => {
                if (["e", "E", "+", "-", "."].includes(e.key)) {
                  e.preventDefault();
                }
              }}
            />
          </td>

          {/* GST */}
          <td style={styles.td}>
            <select
              value={row.gstPercent || 0}
              onChange={(e) => handleGstChange(i, parseFloat(e.target.value))}
              style={{
                flex: "1 1 150px",
                padding: 6,
                border: "1px solid #ccc",
                borderRadius: 4,
                outline: "none",
                width:"70px"
              }}
            >
              <option value={0}>Select GST</option>
              <option value={5}>5%</option>
              <option value={12}>12%</option>
              <option value={18}>18%</option>
              <option value={28}>28%</option>
            </select>
            <span
              style={{
                minWidth: 80,
                textAlign: "right",
                flexShrink: 0,
                display: "inline-block",
                marginLeft: 8,
              }}
            >
              ₹{(row.gstAmount || 0).toFixed(2)}
            </span>
          </td>

          {/* Delete */}
          <td style={styles.td}>
            <button
              onClick={() => deleteRow(i)}
              style={{
                color: "red",
                cursor: "pointer",
                border: "none",
                background: "none",
                fontSize: 18,
              }}
            >
              ❌
            </button>
          </td>
        </tr>
      ))}
    </tbody>
    

  </table>



  <button
    onClick={addRow}
    style={{
      marginTop: 12,
      padding: "10px 18px",
      backgroundColor: "#007BFF",
      color: "#fff",
      border: "none",
      borderRadius: 6,
      cursor: "pointer",
      fontWeight: "bold",
    }}
  >
    Add Row
  </button>

<div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
  <h3>Total Payable: ₹ {subtotal.toFixed(2)}</h3>
</div>
</div>



    <div style={styles.container1}>
      <p style={styles.title1}>Dear Sir/Mam,</p>
     <p style={styles.paragraph}>
  With reference to the above and subsequent discussion, we KC Cottrell Engineering
  Services Pvt. Ltd. (hereafter referred as "Purchaser") are pleased to issue our
  Purchase Order to M/s.{formData.supplier_name} (hereafter referred as "Supplier"),
  for Supply of{" "}
  <input
    type="text"
    value={formData.itemName}
    onChange={(e) =>
      setFormData({ ...formData, itemName: e.target.value })
    }
    placeholder=" "
    style={{ padding: "2px 5px", fontSize: "inherit", width: "150px" }}
  />{" "}
  as per Annexure- A.
</p>

    </div>

      <div style={{ ...styles.section, ...styles.pricesScope }}>
        <p style={styles.title1}>A. Prices & Scope of Supply:</p>
        <p style={styles.paragraph}>
          Total Purchase Order Value is ₹ {subtotal.toFixed(2)}/- (Rupees {numberToWords(Math.floor(subtotal))} Only) price break up as per Annexure-A towards Supply of {" "}
  <input
    type="text"
    value={formData.itemName}
    onChange={(e) =>
      setFormData({ ...formData, itemName: e.target.value })
    }
    placeholder=" "
    style={{ padding: "2px 5px", fontSize: "inherit", width: "150px" }}
  />{" "} at Chennai Office.
        </p>
      </div>

      <div style={{ ...styles.section, ...styles.specialConditions }}>
        <p style={styles.title2}>B. Technical Specifications::</p>
        <p style={styles.paragraph}>
          The Product should confirm to the applicable standards.
        </p>
      </div>

     <div style={{ ...styles.section, ...styles.technicalQuality }}>
  <p style={styles.title3}>C. Special Conditions</p>

      
      <ul style={styles.list}>
        <li style={styles.listItem}>
          <span style={styles.listItemBold}>1. Price Basis:</span>
          <div style={styles.descriptionText}>
            1.1.Above prices are for Site, Chennai and inclusive of standard packing, Door Delivery services at Chennai Office. <br></br>
            1.2.Price shall be firm and fixed during the entire contract period & till the execution of the complete order without any price escalation, what so ever.
          </div>
        </li>
        <li style={styles.listItem}>
          <span style={styles.listItemBold}>2. Delivery Schedule:</span>
          <div style={styles.descriptionText}>
            2.1.Delivery shall be completed on 
              <input
                type="date"
                value={deliveryDate}
                onChange={handleDateChange}
                style={styles.input1}
              />
 @ 
              <input
                type="time"
                value={deliveryTime}
                onChange={handleTimeChange}
                style={styles.input1}
              />
.
          </div>
        </li>
        <li style={styles.listItem}>
          <span style={styles.listItemBold}>3. Payment Terms:</span>
          <div style={styles.descriptionText}>
           3.1.50% Advance payment and 50% after the delivery.
          </div>
        </li>
        <li style={styles.listItem}>
          <span style={styles.listItemBold}>4. Taxes & Duties:</span>
          <div style={styles.descriptionText}>
            4.1.All taxes are inclusive in the order price. <br></br>
            4.2.TDS shall be deducted from Suppliers/Contractor bills as applicable.
          </div>
        </li>
        <li style={styles.listItem}>
          <span style={styles.listItemBold}>5. Consignee Details:</span>
          <div style={styles.descriptionText}>
            5.1.The consignee details will be issued separately after the final inspection.
          </div>
        </li>
        <li style={styles.listItem}>
          <span style={styles.listItemBold}>6. Invoice/Billing Address:</span>
          <div style={styles.descriptionText}>
            6.1.KC Cottrell Engineering Services Private Limited, Super A16 & A17, RR Tower 4, 7th Floor, Thiru-Vi-Ka Industrial Estate, Guindy, Chennai – 600 032.
          </div>
        </li>
        <li style={styles.listItem}>
          <span style={styles.listItemBold}>7. Freight & Insurance:</span>
          <div style={styles.descriptionText}>
            7.1.Freight & Insurance shall be in scope of Supplier.
          </div>
        </li>
        <li style={styles.listItem}>
          <span style={styles.listItemBold}>8. Guarantee:</span>
          <div style={styles.descriptionText}>
            8.1.Supplier shall provide Warranty as per your offer.<br></br> 8.2.Supplier shall submit the Letter of Commitments along with the supply.
          </div>
        </li>
        <li style={styles.listItem}>
          <span style={styles.listItemBold}>9. Dispatch Instruction:</span>
          <div style={styles.descriptionText}>
            9.1.Supplier should provide all documents and support to obtain the Road Permit, if required.
          </div>
        </li>
        <li style={styles.listItem}>
          <span style={styles.listItemBold}>10. Dispatch Documents:</span>
          <div style={styles.descriptionText}>
            10.1.Supplier shall submit 1 (one) original and 4 (four) copies of the following documents along with supplies:
          </div>
          <ul style={styles.list}>
            <li style={styles.subListItem}>i) Challan</li>
            <li style={styles.subListItem}>ii) Packing List</li>
            <li style={styles.subListItem}>iii) Guarantee/Warranty certificate</li>
          </ul>
        </li>
        <li style={styles.listItem}>
          <span style={styles.listItemBold}>11. Packing, Identification & Marking:</span>
          <div style={styles.descriptionText}>
            11.1.All the items should be properly marked before dispatch.<br></br>11.2.Cost incurred due to damages if any during transportation due to improper packing shall be borne by Supplier.
          </div>
        </li>
        <li style={styles.listItem}>
          <span style={styles.listItemBold}>12. Responsibility:</span>
          <div style={styles.descriptionText}>
            12.1.Even if the items are inspected by Purchaser representative at Supplier premises prior to dispatch, the basic responsibility lies with Supplier for quality of items and the pre-dispatch inspection and clearance does not absolve Supplier responsibility.
          </div>
        </li>
        <li style={styles.listItem}>
          <span style={styles.listItemBold}>13. Technical & Quality:</span>
          <div style={styles.descriptionText}>
            13.1.All technical & quality specification shall be as per standard parameter of item and model no.
          </div>
        </li>
        <li style={styles.listItem}>
          <span style={styles.listItemBold}>14. Rectification:</span>
          <div style={styles.descriptionText}>
            14.1.Supplier shall depute representative at Purchaser office to rectify item with defect / problem / mismatch found after dispatch of the item and all relevant cost shall be borne by Supplier.
          </div>
        </li>
        <li style={styles.listItem}>
          <span style={styles.listItemBold}>15. Cancellation:</span>
          <div style={styles.descriptionText}>
            15.1.Timely delivery is the essence of this purchase order. We are at liberty to cancel the order without any price implication on Purchaser, in case Supplier fail to deliver the required items as per the above-mentioned delivery schedule.
          </div>
        </li>
        <li style={styles.listItem}>
          <span style={styles.listItemBold}>16. Jurisdiction:</span>
          <div style={styles.descriptionText}>
            16.1.Jurisdiction & Arbitration: Disputes, if any, will be subject to Jurisdiction of Gurgaon. The dispute will first be referred to arbitration in accordance with Indian Arbitration and Conciliation Act 1996.This order and its annexure constitute the entire understanding between the Contractor & Employer and terms of these present. It shall super cede all prior correspondence to the extent of inconsistency of repugnance to the provisions of this order and its annexure. Any modification on this order or its annexure and conditions of contract shall be effected only by a written instrument signed by the Authorized Representative.
          </div>
        </li>
        <li style={styles.listItem}>
          <span style={styles.listItemBold}>17. Sub-contracting:</span>
          <div style={styles.descriptionText}>
            Not Applicable.
          </div>
        </li>
        <li style={styles.listItem}>
          <span style={styles.listItemBold}>18. Acceptance:</span>
          <div style={styles.descriptionText}>
            18.1.Duplicate copy of the Purchase Order may please be signed and returned to KCCES on the same day of receipt as token of acceptance of the same. If no communication is received within a days of receipt of Purchase Order, it will be treated that order has been accepted in entirely
          </div>
        </li>
      </ul>

</div>

      <button type="submit" style={styles.button}>
        Submit Purchase Order
      </button>
    </form>
  );
};

export default PurchaseOrder;