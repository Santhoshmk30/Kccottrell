import React, { useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; 

import citiesByState from "./states/Indian_Cities_In_States_JSON.json";
import cityTiers from "./states/cityTiers.json";
import allowances from "./states/allowances.json";





const TripRequestForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fromDate: '',
    Date: '',
    toDate: '',
    department: '',
    projectCode: '',
    place: '',
    workPlan: '', 
    purpose: '',
    purpose1: '',
    accommodation: '',
    dailyAllowance: '',
    transportAmount: '',
    parking: '',
    toll: '',
    communication: '',
    miscellaneous: '',
    others: '',
    modeOfPayment: '',
    ticketBookedBy: "",
    transports: [
    { transportMode: "", ticketBookedBy: "", from: "", to: "", amount: "" }
  ]
  });

  const [activeForm, setActiveForm] = useState("domestic");

  const [error, setError] = useState("");



  const getTier = (city) => {
    if (cityTiers.Tier1.includes(city)) return "Tier 1  ('A' Area)";
    if (cityTiers.Tier2.includes(city)) return "Tier 2 ('B' Area)";
    return "Tier 3 ('C' Area)"; 
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
  
    setFormData((prev) => {
      let updated = { ...prev, [name]: value };
  
      if (name === "fromDate" || name === "toDate") {
        if (updated.fromDate && updated.toDate) {
          const from = new Date(updated.fromDate);
          const to = new Date(updated.toDate);
  
          const diffTime = to.getTime() - from.getTime();
          if (diffTime >= 0) {
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  
            if (diffDays > 30) {
              setError("Period cannot exceed 30 days!");
              updated.workPlan = "";
              updated.days = "";
              updated.nights = "";
            } else {
              setError("");
              updated.workPlan = `${diffDays} days`;
              updated.days = diffDays;
              updated.nights = diffDays - 1 < 0 ? 0 : diffDays - 1; // ðŸ‘ˆ Nights = Days - 1
            }
          } else {
            setError("To date cannot be before From date!");
            updated.workPlan = "";
            updated.days = "";
            updated.nights = "";
          }
        }
      }
  
      return updated;
    });
  };

useEffect(() => {
  if (formData.designation && formData.place) {
    const tier = getTier(formData.place);
    const desig = formData.designation;

    if (allowances[desig] && allowances[desig][tier]) {
      setFormData((prev) => ({
        ...prev,
        accommodation: allowances[desig][tier].accommodation,
        dailyAllowance: allowances[desig][tier].daily
      }));
    }
  }
}, [formData.designation, formData.place]);


  

  const total = [
    formData.accommodation,
    formData.dailyAllowance,
    formData.transportAmount,
    formData.parking,
    formData.toll,
    formData.communication,
    formData.miscellaneous,
    formData.others,
  ]
    .map((val) => parseFloat(val) || 0)
    .reduce((a, b) => a + b, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://darkslategrey-shrew-424102.hostingersite.com/api/save_trip.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();
      console.log(result);

      if (result.status === "success") {
        alert("Trip request submitted successfully!");
        navigate("/dashboard");
      } else {
        alert("Failed to submit: " + result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Network error while submitting form.");
    }
  };

const addTransport = () => {
  setFormData((prev) => ({
    ...prev,
    transports: [
      ...prev.transports,
      { transportMode: "", ticketBookedBy: "", from: "", to: "", amount: "" }
    ]
  }));
};

const removeTransport = (index) => {
  setFormData((prev) => {
    const newTransports = [...prev.transports];
    newTransports.splice(index, 1);
    return { ...prev, transports: newTransports };
  });
};

const handleTransportChange = (index, field, value) => {
  setFormData((prev) => {
    const newTransports = [...prev.transports];
    newTransports[index][field] = value;
    return { ...prev, transports: newTransports };
  });
};

  useEffect(() => {
  if (formData.designation && formData.place) {
    const tier = getTier(formData.place);
    const desig = formData.designation;

    if (allowances[desig] && allowances[desig][tier]) {
      const baseAccommodation = allowances[desig][tier].accommodation;
      const baseDaily = allowances[desig][tier].daily;

      // Multiply by days & nights
      const totalAccommodation =
        (formData.nights || 0) * (parseFloat(baseAccommodation) || 0);
      const totalDaily =
        (formData.days || 0) * (parseFloat(baseDaily) || 0);

      setFormData((prev) => ({
        ...prev,
        accommodation: totalAccommodation,
        dailyAllowance: totalDaily,
      }));
    }
  }
}, [formData.designation, formData.place, formData.days, formData.nights]);



  return (
      <div style={styles.container}>
  <div style={styles.rightCard}>
    <div style={styles.body}>
       <div style={styles.card1}>
      <motion.div
        style={styles.overlay}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h2
          style={styles.heading}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
           
           <div style={styles.header}>
 
  <img 
    src="/logo full.png"  
    alt="Company Logo"
    style={{ width: "200px", height: "60px" }}
  />


  <h2 style={styles.heading}>New Trip Request</h2>

  <div>
  <button 
  style={styles.tabButton(activeForm === "domestic")}
  onClick={() => setActiveForm("domestic")}
>
  Domestic
</button>

<button 
  style={styles.tabButton(activeForm === "international")}
  onClick={() => setActiveForm("international")}
>
  International
</button>
  </div>
</div>

         
        </motion.h2>

        {activeForm === "domestic" ? (
        <div>
          <form onSubmit={handleSubmit} style={styles.form}>
<div
  style={{
    marginTop: "25px",
    padding: "25px",
    borderRadius: "15px",
    background: "linear-gradient(135deg, #e3f2fd, #ffffff)",
    boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
    border: "1px solid #bbdefb",
    fontFamily: "Segoe UI, sans-serif",
  }}
>
  <h3
    style={{
      marginBottom: "20px",
      color: "#1565c0",
      borderBottom: "2px solid #90caf9",
      paddingBottom: "8px",
      fontSize: "20px",
    }}
  >
   Travel Details
  </h3>

  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
    {/* From */}
    <div style={styles.field}>
      <label style={styles.label}>From</label>
      <input
        type="date"
        name="fromDate"
        value={formData.fromDate}
        min={new Date().toISOString().split("T")[0]}
        onChange={handleChange}
        style={styles.input1}
      />
    </div>

    {/* To */}
    <div style={styles.field}>
      <label style={styles.label}>To</label>
      <input
        type="date"
        name="toDate"
        value={formData.toDate}
        min={formData.fromDate}
        max={
          formData.fromDate
            ? new Date(
                new Date(formData.fromDate).setDate(
                  new Date(formData.fromDate).getDate() + 30
                )
              )
                .toISOString()
                .split("T")[0]
            : ""
        }
        onChange={handleChange}
        style={styles.input1}
      />
    </div>

    {/* Period */}
    <div style={styles.field}>
      <label style={styles.label}>Period</label>
      <input
        type="text"
        value={formData.workPlan}
        readOnly
        style={styles.input1}
      />
    </div>

    {/* Days */}
    <div style={styles.field}>
      <label style={styles.label}>Days</label>
      <input
        type="text"
        value={formData.days}
        readOnly
        style={styles.input1}
      />
    </div>


    {/* Department */}
    <div style={styles.field}>
      <label style={styles.label}>Department</label>
      <select
        name="department"
        value={formData.department}
        onChange={handleChange}
        style={{
          ...styles.select,
          backgroundColor: "#f1f8ff",
          border: "1px solid #90caf9",
        }}
      >
        <option value="">Select department</option>
        <option value="HR">HR</option>
        <option value="Finance">Finance</option>
        <option value="IT">IT</option>
      </select>
    </div>

    {/* Project Code */}
    <div style={styles.field}>
      <label style={styles.label}>Project Code</label>
      <input
        type="text"
        name="projectCode"
        value={formData.projectCode}
        onChange={handleChange}
        placeholder="Enter project code"
        style={styles.input}
      />
    </div>
          
  </div>

  {error && (
    <div style={{ color: "red", fontWeight: "600", marginTop: "10px" }}>
      {error}
    </div>
  )}
</div>

    
<div
  style={{
    marginTop: "25px",
    padding: "25px",
    borderRadius: "15px",
    background: "linear-gradient(135deg, #e3f2fd, #ffffff)",
    boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
    border: "1px solid #bbdefb",
    fontFamily: "Segoe UI, sans-serif",
  }}
>
  <h3
    style={{
      marginBottom: "20px",
      color: "#1565c0",
      borderBottom: "2px solid #90caf9",
      paddingBottom: "8px",
      fontSize: "20px",
    }}
  >
   Accommodation Details
  </h3>

  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
<div style={styles.row}>
  {/* State */}
  <div style={styles.field}>
    <label style={styles.label}>State</label>
    <select
      name="state"
      value={formData.state || ""}
      onChange={handleChange}
      style={styles.select}
    >
      <option value="">-- Select State --</option>
      {Object.keys(citiesByState).map((state, index) => (
        <option key={index} value={state}>
          {state}
        </option>
      ))}
    </select>
  </div>

  {/* City */}
  <div style={styles.field}>
    <label style={styles.label}>City</label>
    <select
      name="place"
      value={formData.place || ""}
      onChange={handleChange}
      style={styles.select}
      disabled={!formData.state}
    >
      <option value="">-- Select City --</option>
      {formData.state &&
        citiesByState[formData.state].map((city, index) => (
          <option key={index} value={city}>
            {city}
          </option>
        ))}
    </select>
  </div>

  {/* Tier */}
  <div style={styles.field}>
    <label style={styles.label}>Tier</label>
    <input
      type="text"
      value={formData.place ? getTier(formData.place) : ""}
      readOnly
      style={styles.input1}
    />
  </div>
</div>

<div style={styles.field}>
  <label style={styles.label}>Designation</label>
  <select
    name="designation"
    value={formData.designation || ""}
    onChange={handleChange}
    style={styles.select}
  >
    <option value="">-- Select Designation --</option>
    <option value="Managing Director/Director/COO/CFO">Managing Director/Director/COO/CFO</option>
    <option value="Assistant VicePresident (AVP)/VicePresident (VP)/SeniorVicePresident (Sr.VP)">Assistant VicePresident (AVP)/VicePresident (VP)/SeniorVicePresident (Sr.VP)</option>
    <option value="General Manager/Sr.General Manager">General Manager/Sr.General Manager</option>
  </select>
</div>

      <div style={styles.field}>
  <label style={styles.label}>Is Company Providing Accommodation?</label>
  <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
    <label>
      <input
        type="radio"
        name="companyProvidesAccommodation"
        value="Yes"
        checked={formData.companyProvidesAccommodation === "Yes"}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            companyProvidesAccommodation: e.target.value,
          }))
        }
      />
      Yes
    </label>

    <label>
      <input
        type="radio"
        name="companyProvidesAccommodation"
        value="No"
        checked={formData.companyProvidesAccommodation === "No"}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            companyProvidesAccommodation: e.target.value,
          }))
        }
      />
      No
    </label>
  </div>
</div>

<div style={styles.row}>
  <div style={styles.field}>
    <label style={styles.label}>Accommodation Allowance</label>
    <input
      type="text"
      name="accommodation"
      value={
        formData.companyProvidesAccommodation === "Yes" 
          ? " "   
          : formData.accommodation ?? ''  
      }
      readOnly
      style={styles.input1}
    />
  </div>

 </div>
       </div>

 

      <div style={styles.field}>
  <label style={styles.label}>Do You Need Special Approval</label>
      <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
    <label>
      <input
      type="radio"
      name="specialApproval"
      value="Yes"
      checked={formData.specialApproval === "Yes"}
      onChange={handleChange}
    />
    Yes
  </label>
  
  <label>
    <input
      type="radio"
      name="specialApproval"
      value="No"
      checked={formData.specialApproval === "No"}
      onChange={handleChange}
    />
    No
  </label>
        </div>
        {/* Conditionally render Extra Amount */}
{formData.specialApproval === "Yes" && (
  <div style={styles.field}>
    <label style={styles.label}>Extra Amount</label>
    <input
      type="number"
      name="extraAmount"
      value={formData.extraAmount ?? ""}
      onChange={handleChange}
      style={styles.input1}
      placeholder="Enter extra amount"
    />
  </div>

)}


</div>
</div>

  <div
  style={{
    marginTop: "25px",
    padding: "25px",
    borderRadius: "15px",
    background: "linear-gradient(135deg, #e3f2fd, #ffffff)",
    boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
    border: "1px solid #bbdefb",
    fontFamily: "Segoe UI, sans-serif",
  }}
>
  <h3
    style={{
      marginBottom: "20px",
      color: "#1565c0",
      borderBottom: "2px solid #90caf9",
      paddingBottom: "8px",
      fontSize: "20px",
    }}
  >
   Daily Allowance Details
  </h3>

  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
     

     <div style={styles.field}>
    <label style={styles.label}>Daily Allowance</label>
    <input
      type="text"
      name="dailyAllowance"
      value={formData.dailyAllowance ?? ''}
      readOnly
      style={styles.input1}
    />
       {/* Note */}
  <p style={{ fontSize: "12px", color: "gray", marginTop: "5px" }}>
    For any expenses more than the daily allowance, reimbursement requires 
    proper justification and special approval from the management.
  </p>
  </div>

       <div style={styles.field}>
  <label style={styles.label}>Do You Need Special Approval</label>
      <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
    <label>
      <input
      type="radio"
      name="specialApproval1"
      value="Yes"
      checked={formData.specialApproval1 === "Yes"}
      onChange={handleChange}
    />
    Yes
  </label>
  
  <label>
    <input
      type="radio"
      name="specialApproval1"
      value="No"
      checked={formData.specialApproval1 === "No"}
      onChange={handleChange}
    />
    No
  </label>
        </div>
        {/* Conditionally render Extra Amount */}
{formData.specialApproval1 === "Yes" && (
  <div style={styles.field}>
    <label style={styles.label}>Extra Amount</label>
    <input
      type="number"
      name="extraAmount"
      value={formData.extraAmount ?? ""}
      onChange={handleChange}
      style={styles.input1}
      placeholder="Enter extra amount"
    />
        
  </div>
)}

</div>     
</div>
     </div>

 

 



          <input
            type="text"
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            placeholder="Enter Purpose"
            style={styles.input}
          />

     

<div>

  {formData.transports?.map((item, index) => (
   
      {/* Transport Mode */}
      <div style={styles.field}>
        <label style={styles.label}>Transport Mode</label>
        <div style={styles.radioGroup}>
          {["Air", "Train", "Bus", "Taxi"].map((mode) => (
            <label key={mode} style={styles.radioLabel}>
              <input
                type="radio"
                name={`transportMode-${index}`}
                value={mode}
                checked={item.transportMode === mode}
                onChange={(e) =>
                  handleTransportChange(index, "transportMode", e.target.value)
                }
                style={styles.radioInput}
              />
              {mode}
            </label>
          ))}
        </div>
      </div>

      {/* Ticket Booked By */}
      <div style={styles.field}>
        <label style={styles.label}>Booked By</label>
        <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
          <label>
            <input
              type="radio"
              name={`ticketBookedBy-${index}`}
              value="Self"
              checked={item.ticketBookedBy === "Self"}
              onChange={(e) =>
                handleTransportChange(index, "ticketBookedBy", e.target.value)
              }
            />
            Self
          </label>
          <label>
            <input
              type="radio"
              name={`ticketBookedBy-${index}`}
              value="Company"
              checked={item.ticketBookedBy === "Company"}
              onChange={(e) =>
                handleTransportChange(index, "ticketBookedBy", e.target.value)
              }
            />
            Company
          </label>
        </div>
      </div>

      {/* From / To / Amount */}
      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <input
          type="text"
          placeholder="From"
          value={item.from}
          onChange={(e) =>
            handleTransportChange(index, "from", e.target.value)
          }
          style={styles.input1}
        />
        <input
          type="text"
          placeholder="To"
          value={item.to}
          onChange={(e) => handleTransportChange(index, "to", e.target.value)}
          style={styles.input1}
        />
        {item.ticketBookedBy === "Self" && (
          <input
            type="number"
            placeholder="Amount"
            value={item.amount}
            onChange={(e) =>
              handleTransportChange(index, "amount", e.target.value)
            }
            style={styles.input1}
          />
        )}
      </div>

      {/* Remove Button */}
      <button
        type="button"
        onClick={() => removeTransport(index)}
        style={{
          marginTop: "10px",
          padding: "5px 10px",
          background: "red",
          color: "#fff",
          border: "none",
          borderRadius: "5px"
        }}
      >
        Remove
      </button>
    
  ))}

  {/* Add Button */}
  <button
    type="button"
    onClick={addTransport}
    style={{
      padding: "8px 15px",
      background: "green",
      color: "#fff",
      border: "none",
      borderRadius: "5px"
    }}
  >
    + Add Transport
  </button>
</div>
    

         
          <input
            type="number"
            name="miscellaneous"
            value={formData.miscellaneous}
            onChange={handleChange}
            placeholder="Miscellaneous"
            style={styles.input}
          />

     

          <div style={styles.totalBox}>
            Total Amount: {total}
          </div>

          <motion.button
            type="submit"
            style={styles.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Submit
          </motion.button>
        </form>
        </div>
      ) : (
        <div>
          {/* ðŸ‘‰ International Form Component call pannunga */}
          <p>International Form will be displayed here</p>
        </div>
      )}


        
      </motion.div>
      </div>
    </div>
  </div>
    </div>
  );
};


  const styles = {
   container: {
    display: "flex",
    justifyContent: "flex-end",
    padding: "90px",
    backgroundcolor: "#ffffff",
    minHeight: "100vh",
    boxSizing: "border-box",
  },
  rightCard: {
    width: "100%",
    maxWidth: "1000px",
    background: "#fff",
    borderRadius: "75px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
    padding: "30px",
    border: "2px solid #000",
    marginRight: "0", 
    marginLeft: "auto", 
  },
  body: {
    background: "transparent", 
    padding: "0",
    margin: "0",
    fontFamily: "Segoe UI, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: "15px",
    borderBottom: "2px solid #eee",
    marginBottom: "25px",
  },
  heading: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#1a237e",
    textAlign: "center",
    marginBottom: "20px",
  },
  subheading: {
    background: "linear-gradient(90deg, #2196f3, #21cbf3)",
    color: "#fff",
    padding: "10px 15px",
    borderRadius: "6px",
    margin: "25px 0 15px 0",
    fontWeight: "600",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  row: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "15px",
  },
  field: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontWeight: "600",
    marginBottom: "8px",
    fontSize: "14px",
  },
    transportSection: {
      marginTop: "20px",
      padding: "15px",
      border: "1px solid #ddd",
      borderRadius: "8px",
      backgroundColor: "#fafafa"
    },
    radioGroup: {
      display: "flex",
      gap: "20px",
      marginTop: "10px"
    },
    radioLabel: {
      fontSize: "14px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "5px"
    },
    radioInput: {
      cursor: "pointer"
    },
    resultBox: {
      marginTop: "15px",
      padding: "10px",
      backgroundColor: "#e9f5ff",
      border: "1px solid #b3daff",
      borderRadius: "6px",
      fontWeight: "600",
      fontSize: "14px"
    },
    resultText: {
      color: "#0073e6"
    },
     input: {
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    fontSize: "14px",
    outline: "none",
    background: "transparent",
  },
  input1: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    fontSize: "14px",
    minWidth: "150px",
    background: "transparent",
  },
    inputFocus: {
      borderColor: "#2980b9",
      boxShadow: "0 0 6px rgba(41, 128, 185, 0.25)",
    },
   select: {
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "14px",
    backgroundColor: "white",
  },
    totalBox: {
      marginTop: "25px",
      padding: "14px",
      backgroundColor: "#f0f8ff",
      borderRadius: "8px",
      fontSize: "18px",
      textAlign: "center",
      fontWeight: "bold",
      color: "#0d47a1",
      border: "1px solid #bbdefb",
    },
   button: {
    marginTop: "25px",
    padding: "14px",
    background: "linear-gradient(135deg, #2980b9, #3498db)",
    color: "white",
    fontWeight: "bold",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    width: "100%",
    transition: "all 0.3s ease",
  },
    buttonHover: {
      background: "linear-gradient(135deg, #1f6391, #2980b9)",
    },
    tabButton: (isActive) => ({
      padding: "8px 15px",
      marginLeft: "10px",
      borderRadius: "20px",
      border: "none",
      cursor: "pointer",
      background: isActive ? "#2196f3" : "#ddd",
      color: isActive ? "white" : "black",
      fontWeight: "600",
      transition: "0.3s",
    }),
    error: {
      color: "red",
      fontSize: "14px",
      marginTop: "4px",
      fontWeight: "500",
    }
  };


export default TripRequestForm;
























































