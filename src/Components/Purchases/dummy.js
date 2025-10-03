import React, { useState } from 'react';
import axios from 'axios';

const tdsOptions = [
  { id: 1, name: 'Payment of contractors for Others (Reduced) 1.5%', rate: 1.5 },
  { id: 2, name: 'Other TDS Option', rate: 2 },
];

export default function PurchaseOrderPage() {
  const [formData, setFormData] = useState({
    adminNo: "",
    date: "",
    projectCode: "",
    itemDescription: "",
    supplierName: "",
    poNumber: "",
    billNo: "",
    poYesNo: "",
    modeOfTransaction: "",
    paymentType: "",
    sanctionAmount: "",
    inFavourOf: ""
  });

  const [rows, setRows] = useState([{ id: 1, invoiceNo: '', hsnSac: '', quantity: '', rate: '', per: '', basicValue: '' }]);
  const [gstPercent, setGstPercent] = useState(0);
  const [reimbursement, setReimbursement] = useState('');
  const [tdsOptionId, setTdsOptionId] = useState(1);
  const [deductionType, setDeductionType] = useState('advance');
  const [adjustment, setAdjustment] = useState(0);

  // Handle input change for formData
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle change for item rows
  const handleChange1 = (index, field, value) => {
    const updatedRows = [...rows];
    if (['basicValue', 'quantity', 'rate'].includes(field)) {
      updatedRows[index][field] = parseFloat(value) || 0;
    } else {
      updatedRows[index][field] = value;
    }
    setRows(updatedRows);
  };

  const deleteRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  const addRow = () => {
    setRows([...rows, { id: Date.now(), invoiceNo: '', hsnSac: '', quantity: 0, rate: 0, per: '', basicValue: 0 }]);
  };

  // Calculations
  const subtotal = rows.reduce((sum, r) => sum + (parseFloat(r.basicValue) || 0), 0);
  const gstAmount = (subtotal * gstPercent) / 100;
  const selectedTdsOption = tdsOptions.find((opt) => opt.id === parseInt(tdsOptionId));
  const tdsAmount = selectedTdsOption ? ((subtotal + gstAmount + (parseFloat(reimbursement) || 0)) * selectedTdsOption.rate) / 100 : 0;
  const total = subtotal + gstAmount + (parseFloat(reimbursement) || 0) - tdsAmount - (parseFloat(adjustment) || 0);

  // Submit
  const handleSubmit = async () => {
    try {
      const payload = {
        formData,
        rows,
        gstPercent,
        reimbursement: parseFloat(reimbursement || 0),
        tdsOptionId,
        deductionType,
        adjustment: parseFloat(adjustment || 0),
        total,
      };

      await axios.post('https://your-backend-api.com/purchase-orders', payload);
      alert('Purchase Order submitted successfully!');

      // Reset form
      setFormData({
        adminNo: "",
        date: "",
        projectCode: "",
        itemDescription: "",
        supplierName: "",
        poNumber: "",
        billNo: "",
        poYesNo: "",
        modeOfTransaction: "",
        paymentType: "",
        sanctionAmount: "",
        inFavourOf: ""
      });
      setRows([{ id: 1, invoiceNo: '', hsnSac: '', quantity: '', rate: '', per: '', basicValue: '' }]);
      setGstPercent(0);
      setReimbursement('');
      setTdsOptionId(1);
      setDeductionType('advance');
      setAdjustment(0);
    } catch (error) {
      console.error('Error submitting purchase order', error);
      alert('Failed to submit. Please try again.');
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: 'Arial', maxWidth: 1000, margin: 'auto' }}>
      <h2>Purchase Order</h2>

      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
        {['adminNo', 'billNo', 'date'].map((name) => (
          <div key={name} style={{ flex: '1 1 250px', display: 'flex', flexDirection: 'column' }}>
            <label style={styles.label}>{name === 'adminNo' ? 'ADMIN No' : name === 'billNo' ? 'Bill Number' : 'Bill Date'}</label>
            <input
              type={name === 'date' ? 'date' : 'text'}
              name={name}
              style={{ ...styles.input, width: '100%' }}
              value={formData[name]}
              onChange={handleChange}
            />
          </div>
        ))}
      </div>

      {/* Project & Supplier Info */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
        {[
          { label: "Project / Contract Code", name: "projectCode" },
          { label: "Item (description)", name: "itemDescription" },
          { label: "Supplier’s Name", name: "supplierName" },
          { label: "Our P.O. No./Date", name: "poYesNo", type: "select" }
        ].map(({ label, name, type }) => (
          <div key={name} style={{ flex: '1 1 45%', display: 'flex', flexDirection: 'column' }}>
            <label style={styles.label}>{label}</label>
            {type === 'select' ? (
              <select name={name} style={styles.input} value={formData[name]} onChange={handleChange}>
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            ) : (
              <input type="text" name={name} style={styles.input} value={formData[name]} onChange={handleChange} />
            )}
          </div>
        ))}
        {formData.poYesNo === 'Yes' && (
          <div style={{ flex: '1 1 45%', display: 'flex', flexDirection: 'column' }}>
            <label style={styles.label}>Enter P.O. No./Date</label>
            <input type="text" name="poNumber" style={styles.input} value={formData.poNumber} onChange={handleChange} />
          </div>
        )}
      </div>

      {/* Item Table */}
      <div style={{ overflowX: 'auto', marginBottom: 20 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#007BFF', color: '#fff' }}>
            <tr>
              {['Item.No','HSN/SAC','Quantity','Rate','Per','Basic Value','Action'].map((th) => (
                <th key={th} style={styles.th}>{th}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#f9f9f9' : '#fff' }}>
                <td style={styles.td}>{i+1}</td>
                {['hsnSac','quantity','rate','per','basicValue'].map((field) => (
                  <td key={field} style={styles.td}>
                    <input type={['quantity','rate','basicValue'].includes(field)?'number':'text'}
                      value={row[field] || ''}
                      onChange={(e) => handleChange1(i, field, e.target.value)}
                      style={styles.inputstyle}
                    />
                  </td>
                ))}
                <td style={{ textAlign:'center', padding:'10px' }}>
                  <button onClick={()=>deleteRow(i)} style={{ color:'red', fontSize:'18px', background:'none', border:'none', cursor:'pointer' }}>❌</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={addRow} style={{ ...styles.button, backgroundColor:'#007BFF', color:'#fff', marginTop:10 }}>Add</button>
      </div>

      {/* Summary + Payment Info */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:20 }}>
        {/* Summary Box */}
        <div style={{ flex:'1 1 300px', border:'1px solid #ddd', borderRadius:8, padding:20, backgroundColor:'#f9f9f9', minWidth:280 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}><span>Sub Total</span><span>₹{subtotal.toFixed(2)}</span></div>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}><span>GST ({gstPercent}%)</span><span>₹{gstAmount.toFixed(2)}</span></div>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}><span>Reimbursement</span><span>₹{reimbursement ? reimbursement.toFixed(2):'0.00'}</span></div>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}><span>TDS</span><span>- ₹{tdsAmount.toFixed(2)}</span></div>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}><span>{deductionType}</span><span>- ₹{adjustment ? adjustment.toFixed(2):'0.00'}</span></div>
          <div style={{ display:'flex', justifyContent:'space-between', fontWeight:'bold', borderTop:'1px solid #ccc', paddingTop:10 }}><span>Total</span><span>₹{total.toFixed(2)}</span></div>
        </div>

        {/* Payment Info */}
        <div style={{ flex:'1 1 300px', display:'flex', flexDirection:'column', gap:12 }}>
          {[
            { label:'Mode of Transaction', name:'modeOfTransaction', type:'select', options:['Cheque','NEFT','RTGS','Cash'] },
            { label:'Payment Type', name:'paymentType', type:'select', options:['Full Payment','Partial Payment','Advance'] },
            { label:'Sanction Amount', name:'sanctionAmount', type:'number' },
            { label:'In Favour Of', name:'inFavourOf', type:'text' },
          ].map(({label,name,type,options}) => (
            <div key={name} style={{ display:'flex', flexDirection:'column' }}>
              <label style={styles.label}>{label}</label>
              {type==='select'?(
                <select name={name} value={formData[name]} onChange={handleChange} style={styles.input}>
                  <option value="">Select</option>
                  {options.map(opt=><option key={opt} value={opt}>{opt}</option>)}
                </select>
              ):(
                <input type={type} name={name} value={formData[name] || ''} onChange={handleChange} style={styles.input} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div style={{ marginTop:20, textAlign:'center' }}>
        <button onClick={handleSubmit} style={{ padding:'10px 20px', backgroundColor:'#28a745', color:'#fff', borderRadius:6 }}>Submit</button>
      </div>
    </div>
  );
}

const styles = {
  label:{ marginBottom:4, fontWeight:'bold', fontSize:14 },
  input:{ padding:'8px 10px', borderRadius:4, border:'1px solid #ccc', fontSize:14 },
  inputstyle:{ width:'100%', padding:'6px 8px', borderRadius:4, border:'1px solid #ccc', fontSize:14 },
  th:{ padding:10, border:'1px solid #ddd', textAlign:'left' },
  td:{ padding:10, border:'1px solid #ddd' },
  button:{ padding:'8px 16px', border:'none', borderRadius:4, cursor:'pointer' },
};





{/* Summary Box */}
<div
  style={{
    flex: '0 0 400px',       // fixed width on large screens
    width: '100%',           // full width on small screens
    maxWidth: 400,
    marginLeft: 'auto',      // push to right on larger screens
    border: '1px solid #ddd',
    padding: 20,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    boxSizing: 'border-box',
    fontFamily: 'Arial, sans-serif',
  }}
>
  {/* Sub Total */}
  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
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

  {/* Reimbursement */}
  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12, gap: 8, flexWrap: 'wrap' }}>
    <label style={{ minWidth: 100 }}>Reimbursement</label>
    <input
      type="number"
      value={reimbursement}
      onChange={(e) => setReimbursement(e.target.value === '' ? '' : parseFloat(e.target.value))}
      style={{
        flex: '1 1 150px',
        padding: 6,
        border: '1px solid #ccc',
        borderRadius: 4,
        outline: 'none',
      }}
    />
    <span style={{ minWidth: 80, textAlign: 'right', flexShrink: 0 }}>
      ₹{reimbursement ? reimbursement.toFixed(2) : '0.00'}
    </span>
  </div>

  {/* TDS */}
  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12, gap: 8, flexWrap: 'wrap' }}>
    <label style={{ minWidth: 100 }}>TDS</label>
    <div style={{ flex: '1 1 150px', border: '1px solid #ccc', borderRadius: 4, overflow: 'hidden' }}>
      <select
        value={tdsOptionId}
        onChange={(e) => setTdsOptionId(e.target.value)}
        style={{ width: '100%', padding: 6, border: 'none', outline: 'none', appearance: 'none' }}
      >
        {tdsOptions.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </select>
    </div>
    <span style={{ minWidth: 80, textAlign: 'right', fontWeight: 'bold', flexShrink: 0 }}>
      - ₹{tdsAmount.toFixed(2)}
    </span>
  </div>

  {/* Deduction / Adjustment */}
  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12, gap: 8, flexWrap: 'wrap' }}>
    <select
      value={deductionType}
      onChange={(e) => setDeductionType(e.target.value)}
      style={{
        flex: '1 1 150px',
        padding: 6,
        border: '1px solid #ccc',
        borderRadius: 4,
        outline: 'none',
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
      onChange={(e) => setAdjustment(e.target.value === '' ? '' : parseFloat(e.target.value))}
      style={{
        flex: '2 1 150px',
        padding: 6,
        border: '1px dashed #aaa',
        borderRadius: 4,
        outline: 'none',
      }}
    />

    <span style={{ minWidth: 80, textAlign: 'right', fontWeight: 'bold', flexShrink: 0 }}>
      - ₹{adjustment ? adjustment.toFixed(2) : '0.00'}
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