import React, { useState, useEffect } from "react";

export default function PurchaseOrder() {
  const [formData, setFormData] = useState({ supplier_name: "" });
  const [suppliers, setSuppliers] = useState([]);      // just names
  const [suppliersData, setSuppliersData] = useState([]); // full API data
  const [tdsName, setTdsName] = useState("");          // selected TDS name
  const [tdsRate, setTdsRate] = useState(0);          // numeric TDS rate

  const tdsOptions = [
    { id: 1, name: 'Payment of contractors for Others (Reduced) 1.5%', rate: 1.5 },
    { id: 2, name: 'Other TDS Option', rate: 1 },
  ];

  // Fetch suppliers from API
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
      .catch(err => console.error(err));
  }, []);

  // Handle supplier change
  const handleChange2 = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === "supplier_name") {
      const supplier = suppliersData.find(v => v.company_name === value);
      const supplierTdsName = supplier?.tds || "";

      setTdsName(supplierTdsName);

      const tdsOption = tdsOptions.find(opt => opt.name.trim() === supplierTdsName.trim());
      setTdsRate(tdsOption?.rate || 0);
    }
  };

  // Optional: allow manual TDS change
  const handleTdsChange = (e) => {
    const selectedName = e.target.value;
    setTdsName(selectedName);

    const tdsOption = tdsOptions.find(opt => opt.name.trim() === selectedName.trim());
    setTdsRate(tdsOption?.rate || 0);
  };

  return (
    <div>
      {/* Supplier Select */}
      <label>Supplier:</label>
      <select name="supplier_name" value={formData.supplier_name} onChange={handleChange2}>
        <option value="">Select Supplier</option>
        {suppliers.map((company, idx) => (
          <option key={idx} value={company}>{company}</option>
        ))}
      </select>

      {/* TDS Select */}
      <label>TDS:</label>
      <select value={tdsName} onChange={handleTdsChange}>
        <option value="">Select TDS</option>
        {tdsOptions.map(opt => (
          <option key={opt.id} value={opt.name}>
            {opt.name} ({opt.rate}%)
          </option>
        ))}
      </select>

      {/* Display TDS Rate */}
      <label>TDS Rate (%):</label>
      <input type="number" value={tdsRate} readOnly />
    </div>
  );
}
