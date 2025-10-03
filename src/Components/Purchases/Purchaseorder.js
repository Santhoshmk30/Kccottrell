import React, {useEffect,useState } from 'react';
import axios from 'axios';

const tdsOptions = [
  { id: 1, name: 'Payment of contractors for Others (Reduced) 1.5%', rate: 1.5 },
  { id: 2, name: 'Other TDS Option', rate: 2 },
];

export default function PurchaseOrderPage() {
  const [formData, setFormData] = useState({
    admin_no: "",
    bill_date: "",
    project_code: "",
    itemDescription: "",
    supplier_name: "",
    po_number: "",
    bill_no: "",
    poYesNo: "",
    mode_of_transaction: "",
    payment_type: "",
    sanction_amount: "",
    in_favour_of: "",
    ddPlace: ""
  });

  const [rows, setRows] = useState([{ id: 1, invoiceNo: '', hsnSac: '', quantity: '', rate: '', per: '', basicValue: '' }]);
  const [gstPercent, setGstPercent] = useState(0);
  const [reimbursement, setReimbursement] = useState('');
  const [tdsOptionId, setTdsOptionId] = useState(1);
  const [deductionType, setDeductionType] = useState('advance');
  const [adjustment, setAdjustment] = useState(0);
    const [suppliers, setSuppliers] = useState([]); // <-- suppliers list


      // Fetch suppliers from API on mount
  useEffect(() => {
    fetch("https://darkslategrey-shrew-424102.hostingersite.com/api/vendors_data.php")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          const uniqueCompanies = Array.from(new Set(data.data.map(v => v.company_name)));
          setSuppliers(uniqueCompanies);
        }
      })
      .catch(err => console.error('Error fetching suppliers:', err));
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleChange1 = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = field === 'basicValue' ? parseFloat(value) || 0 : value;
    setRows(updatedRows);
  };

  const addRow = () => setRows([...rows, { id: Date.now(), invoiceNo: '', hsnSac: '', quantity: '', rate: '', per: '', basicValue: '' }]);
  const deleteRow = (index) => setRows(rows.filter((_, i) => i !== index));

  const subtotal = rows.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);
  const gstAmount = (subtotal * gstPercent) / 100;
  const selectedTdsOption = tdsOptions.find(opt => parseInt(tdsOptionId) === opt.id);
  const tdsAmount = selectedTdsOption ? ((subtotal + gstAmount + (parseFloat(reimbursement) || 0)) * selectedTdsOption.rate) / 100 : 0;
  const total = subtotal + gstAmount + (parseFloat(reimbursement) || 0) - tdsAmount - (parseFloat(adjustment) || 0);

  
const handleSubmit = async () => {
  try {
    // Ensure numeric values
    const reimbursementValue = parseFloat(reimbursement) || 0;
    const adjustmentValue = parseFloat(adjustment) || 0;
    const gstValue = parseFloat(gstPercent) || 0;
    const sanctionAmountValue = parseFloat(formData.sanction_amount) || 0;

    // Calculate subtotal from row.amount
    const subtotal = rows.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);

    // Calculate GST amount in ₹
    const gstAmount = (subtotal * gstValue) / 100;

    // Ensure tdsOptionId is numeric and get selected TDS
    const selectedTdsOption = tdsOptions.find(opt => opt.id === parseInt(tdsOptionId));

    // Calculate TDS amount in ₹
    const tdsAmount = selectedTdsOption
      ? ((subtotal + gstAmount + reimbursementValue) * selectedTdsOption.rate) / 100
      : 0;

    // Calculate total
    const totalAmount = subtotal + gstAmount + reimbursementValue - tdsAmount - adjustmentValue;

    // Build payload
    const payload = {
      admin_no: formData.admin_no || '',
      bill_no: formData.bill_no || '',
      bill_date: formData.bill_date || '',
      project_code: formData.project_code || '',
      po_number: formData.po_number || '',
      supplier_name: formData.supplier_name || '',
      gst_percent: gstValue,                  // percentage
      gst_amount: parseFloat(gstAmount.toFixed(2)),  // GST in ₹
      reimbursement: reimbursementValue,
      tds_name: selectedTdsOption ? selectedTdsOption.name : '',
      tds_rate: parseFloat(tdsAmount.toFixed(2)),     // TDS in ₹
      deduction_type: deductionType,
      adjustment: adjustmentValue,
      total_amount: totalAmount,
      mode_of_transaction: formData.mode_of_transaction || '',
      payment_type: formData.payment_type || '',
      sanction_amount: sanctionAmountValue,
      in_favour_of: formData.in_favour_of || '',
      items: rows.map(r => ({
        item: r.item || '',
        hsnSac: r.hsnSac || '',
        quantity: parseFloat(r.quantity) || 0,
        rate: parseFloat(r.rate) || 0,
        per: r.per || '',
        basicValue: parseFloat(r.amount) || 0      // use amount field
      }))
    };

    console.log("Payload to send:", payload);

    // Send to backend
    const response = await axios.post(
      'https://darkslategrey-shrew-424102.hostingersite.com/api/purchase_orders.php',
      payload,
      { headers: { 'Content-Type': 'application/json' } }
    );

    console.log("Backend response:", response.data);

    if (response.data.success) {
      alert(`Purchase Order submitted successfully! ID: ${response.data.order_id}`);
    } else {
      alert(`Failed to submit: ${response.data.error}`);
    }

  } catch (error) {
    console.error("Submission error:", error);
    alert('Failed to submit. Check console for details.');
  }
};





  return (
    <div style={{ padding: 20, fontFamily: 'Arial', maxWidth: 1000, margin: 'auto' }}>
      <h2>Purchase Order</h2>

      {/* Header */}
     <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)", // always 3 in a row
    gap: 30, // equal gap between inputs
    marginBottom: 20,
  }}
>{["admin_no", "bill_no", "bill_date"].map((name) => (
  <div
    key={name}
    style={{ display: "flex", flexDirection: "column" }}
  >
    <label style={styles.label}>
      {name === "admin_no"
        ? "ADMIN No"
        : name === "bill_no"
        ? "Bill Number"
        : "Bill Date"}
    </label>
    <input
      type={name === "bill_date" ? "date" : "text"}
      name={name}
      style={{ ...styles.input, width: "100%" }}
      value={formData[name]}
      onChange={handleChange}
    />
  </div>
))}

</div>


      {/* Project & Supplier Info */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
        {[
          { label: "Project / Contract Code", name: "project_code" },
          { label: "Invoice No", name: "invoicenumber" },
          { label: "Supplier’s Name", name: "supplier_name", type: "select" },
          { label: "Our P.O. No./Date", name: "poYesNo", type: "select" }
        ].map(({ label, name, type }) => (
          <div key={name} style={{ flex: '1 1 45%', display: 'flex', flexDirection: 'column' }}>
            <label style={styles.label}>{label}</label>
            {type === 'select' ? (
              <select
                name={name}
                style={styles.input}
                value={formData[name]}
                onChange={handleChange}
              >
                <option value="">{name === "supplier_name" ? "Select Supplier" : "Select"}</option>
                {name === "supplier_name"
                  ? suppliers.map((company, idx) => (
                      <option key={idx} value={company}>{company}</option>
                    ))
                  : ["Yes", "No"].map((opt, idx) => (
                      <option key={idx} value={opt}>{opt}</option>
                    ))
                }
              </select>
            ) : (
              <input
                type="text"
                name={name}
                style={styles.input}
                value={formData[name]}
                onChange={handleChange}
              />
            )}
          </div>
        ))}
        {formData.poYesNo === 'Yes' && (
          <div style={{ flex: '1 1 45%', display: 'flex', flexDirection: 'column' }}>
            <label style={styles.label}>Enter P.O. No./Date</label>
            <input type="text" name="po_number" style={styles.input} value={formData.po_number} onChange={handleChange} />
          </div>
        )}
      </div>

     {/* Item Table */}
<div style={{ overflowX: "auto", marginBottom: 20 }}>
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
          <td style={styles.td}>
            <input
              style={styles.inputWide}
              value={row.item}
              onChange={(e) => handleChange1(i, "item", e.target.value)}
            />
          </td>
          <td style={styles.td}>
            <input
              style={styles.inputSmall}
              value={row.hsnSac}
              onChange={(e) => handleChange1(i, "hsnSac", e.target.value)}
            />
          </td>
          <td style={styles.td}>
            <input
              type="number"
              style={styles.inputSmall}
              value={row.quantity}
              onChange={(e) => handleChange1(i, "quantity", e.target.value)}
            />
          </td>
          <td style={styles.td}>
            <input
              type="number"
              style={styles.inputSmall}
              value={row.rate}
              onChange={(e) => handleChange1(i, "rate", e.target.value)}
            />
          </td>
          <td style={styles.td}>
            <input
              style={styles.inputSmall}
              value={row.per}
              onChange={(e) => handleChange1(i, "per", e.target.value)}
            />
          </td>
 <td style={styles.td}>
  <input
    type="number"
    style={{
      ...styles.inputSmall,
      WebkitAppearance: "none", // Chrome, Safari, Edge
      MozAppearance: "textfield", // Firefox
      appearance: "none"          // Standard
    }}
    value={row.amount === 0 ? "" : row.amount}
    onChange={(e) => handleChange1(i, "amount", e.target.value)}
    onKeyDown={(e) => {
      // Prevent e, E, +, -, . if you want only integers
      if (["e", "E", "+", "-", "."].includes(e.key)) {
        e.preventDefault();
      }
    }}
  />
</td>



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
</div>


      

<div
  style={{
    flex: '0 0 400px', // fixed width on large screens
    width: '100%',      // full width on small screens
    maxWidth: 400,
    marginLeft: 'auto', // push to right on large screens
    border: '1px solid #ddd',
    padding: 20,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    boxSizing: 'border-box',
    fontFamily: 'Arial, sans-serif',
  }}
>
  {/* Sub Total */}
  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap' }}>
    <strong>Sub Total</strong>
    <span>₹{subtotal.toFixed(2)}</span>
  </div>

  {/* GST */}
  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12, gap: 8, flexWrap: 'wrap' }}>
    <label style={{ minWidth: 100 }}>GST</label>
    <select
      value={gstPercent}
      onChange={(e) => setGstPercent(parseFloat(e.target.value))}
      style={{
        flex: '1 1 150px',
        padding: 6,
        border: '1px solid #ccc',
        borderRadius: 4,
        outline: 'none',
      }}
    >
      <option value={0}>Select GST</option>
      <option value={5}>5%</option>
      <option value={12}>12%</option>
      <option value={18}>18%</option>
      <option value={28}>28%</option>
    </select>
    <span style={{ minWidth: 80, textAlign: 'right', flexShrink: 0 }}>₹{gstAmount.toFixed(2)}</span>
  </div>

{/* Reimbursement Section */}
<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)", // always 3 per row
    gap: 12,
    alignItems: "center",
    marginBottom: 12,
  }}
>
  <label style={{ minWidth: 100 }}>Reimbursement</label>
  <input
    type="number"
    value={reimbursement}
    onChange={(e) =>
      setReimbursement(e.target.value === "" ? "" : parseFloat(e.target.value))
    }
    style={{
      padding: 6,
      border: "1px solid #ccc",
      borderRadius: 4,
      outline: "none",
      width: "100%", // take full grid column space
    }}
  />
  <span style={{ textAlign: "right" }}>
    ₹{reimbursement ? reimbursement.toFixed(2) : "0.00"}
  </span>
</div>

{/* TDS */}
<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)", // always 3 columns
    gap: 12,
    alignItems: "center",
    marginBottom: 12,
  }}
>
  <label style={{ minWidth: 100 }}>TDS</label>
  <select
    value={tdsOptionId}
    onChange={(e) => setTdsOptionId(e.target.value)}
    style={{
      padding: 6,
      border: "1px solid #ccc",
      borderRadius: 4,
      outline: "none",
      width: "100%",
    }}
  >
    {tdsOptions.map((opt) => (
      <option key={opt.id} value={opt.id}>
        {opt.name}
      </option>
    ))}
  </select>
  <span style={{ textAlign: "right", fontWeight: "bold" }}>
    - ₹{tdsAmount.toFixed(2)}
  </span>
</div>

{/* Deduction / Adjustment */}
<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)", // always 3 columns
    gap: 12,
    alignItems: "center",
    marginBottom: 12,
  }}
>
  <select
    value={deductionType}
    onChange={(e) => setDeductionType(e.target.value)}
    style={{
      padding: 6,
      border: "1px solid #ccc",
      borderRadius: 4,
      outline: "none",
      width: "100%",
    }}
  >
    <option value="advance">Advance</option>
    <option value="less">Less</option>
    <option value="discount">Discount</option>
    <option value="other">Other Deduction</option>
  </select>

  <input
    type="number"
    value={adjustment}
    onChange={(e) =>
      setAdjustment(e.target.value === "" ? "" : parseFloat(e.target.value))
    }
    style={{
      padding: 6,
      border: "1px dashed #aaa",
      borderRadius: 4,
      outline: "none",
      width: "100%",
    }}
  />

  <span style={{ textAlign: "right", fontWeight: "bold" }}>
    - ₹{adjustment ? adjustment.toFixed(2) : "0.00"}
  </span>
</div>


  {/* Total */}
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      fontWeight: 'bold',
      fontSize: 18,
      borderTop: '1px solid #ccc',
      paddingTop: 10,
    }}
  >
    <span>Total</span>
    <span>₹{total.toFixed(2)}</span>
  </div>
</div>


      {/* Payment Info */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 16,marginTop:10, }}>
        {[
          { label: "Mode of Transaction", name: "mode_of_transaction", type: "select", options: ["", "cheque", "neft", "rtgs", "cash"] },
          { label: "Payment Type", name: "payment_type", type: "select", options: ["", "full", "partial", "advance"] },
          { label: "Sanction Amount", name: "sanction_amount", type: "number" },
        ].map(({ label, name, type, options }) => (
          <div key={name} style={{ flex: '1 1 250px', display: 'flex', flexDirection: 'column' }}>
            <label style={styles.label}>{label}</label>
            {type === 'select' ? (
              <select name={name} style={styles.input} value={formData[name]} onChange={handleChange}>
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            ) : (
              <input type={type} name={name} style={styles.input} value={formData[name]} onChange={handleChange} />
            )}
          </div>
        ))}
      </div>

      {/* In Favour Of */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 16 }}>
        <div style={{ flex: '1 1 250px', display: 'flex', flexDirection: 'column' }}>
          <label style={styles.label}>In Favour Of</label>
          <input type="text" name="in_favour_of" style={styles.input} value={formData.in_favour_of} onChange={handleChange} />
        </div>
      </div>

      {/* Submit Button */}
      <div style={{ marginTop: 20, textAlign: 'center' }}>
        <button onClick={handleSubmit} style={{ padding: '10px 20px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold' }}>
          Submit
        </button>
      </div>
    </div>
  );
}

const styles = {
  label: { fontWeight: 'bold', marginBottom: 6 },
  input: { padding: 8, fontSize: 14, borderRadius: 4, border: '1px solid #ccc' },
  inputstyle: { width: '90%', padding: 6, border: '1px solid #ccc', borderRadius: 4, outline: 'none' },
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
  inputSmall: {
    width: "70px",
    padding: "4px 6px",
    border: "1px solid #ccc",
    borderRadius: 4,
    outline: "none",
    textAlign: "center",
  },
};
