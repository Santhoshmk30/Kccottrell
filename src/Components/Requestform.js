import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const TripRequestForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fromDate: '',
    toDate: '',
    department: '',
    projectCode: '',
    place: '',
    workPlan: '',
    purpose: '',
    accommodation: '',
    dailyAllowance: '',
    transportMode: '',
    transportAmount: '',
    parking: '',
    toll: '',
    communication: '',
    miscellaneous: '',
    others: '',
    modeOfPayment: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  useEffect(() => {
    // Inject custom CSS to remove number input arrows
    const style = document.createElement('style');
    style.innerHTML = `
      input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      input[type=number] {
        -moz-appearance: textfield;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const transportModes = ['Air', 'Rail', 'Bus', 'Taxi'];


  const total = [
    formData.accommodation,
    formData.dailyAllowance,
    formData.transportAmount,
    formData.parking,
    formData.toll,
    formData.communication,
    formData.miscellaneous,
    formData.others
  ]
    .map(val => parseFloat(val) || 0)
    .reduce((a, b) => a + b, 0);


    const handleSubmit = async (e) => {
      e.preventDefault();
    
      try {
        const response = await fetch("https://darkslategrey-shrew-424102.hostingersite.com/api/save_trip.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        });
    
        const result = await response.json();
        console.log(result);
    
        if (result.status === "success") {
          alert("Trip request submitted successfully!");
          navigate('/dashboard');
        } else {
          alert("Failed to submit: " + result.message);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Network error while submitting form.");
      }
    };
    
    
  const styles = {
    body: {
      backgroundImage: 'url("https://i.gifer.com/8UnC.gif")', // You can replace with your own GIF URL
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      padding: '60px 15px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '"Segoe UI", sans-serif'
    },
    overlay: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      padding: '35px',
      borderRadius: '15px',
      maxWidth: '700px',
      width: '100%',
      boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)'
    },
    heading: {
      fontSize: '26px',
      fontWeight: 'bold',
      marginBottom: '25px',
      color: '#34495e',
      textAlign: 'center'
    },
    subheading: {
      marginTop: '30px',
      fontSize: '18px',
      color: '#34495e',
      fontWeight: '600'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    row: {
      display: 'flex',
      gap: '20px',
      flexWrap: 'wrap'
    },
    field: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column'
    },
    label: {
      marginBottom: '6px',
      fontWeight: '500',
      color: '#2f3640'
    },
    input: {
      padding: '12px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      fontSize: '14px'
    },
    totalBox: {
    marginTop: '25px',
    padding: '12px',
    backgroundColor: '#e3f2fd',
    borderRadius: '6px',
    fontSize: '18px',
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#0d47a1'
  },
    select: {
      padding: '12px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      fontSize: '14px',
      backgroundColor: 'white'
    },
    button: {
      marginTop: '20px',
      padding: '12px',
      background: '#2980b9',
      color: 'white',
      fontWeight: 'bold',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '16px',
      alignSelf: 'center',
      width: '150px'
    },
    radioGroup: {
      display: 'flex',
      gap: '15px',
      marginTop: '10px',
      marginBottom: '10px',
      flexWrap: 'wrap',
    },
    radioLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      fontSize: '14px',
      color: '#333',
      backgroundColor: '#f1f1f1',
      padding: '6px 12px',
      borderRadius: '8px',
      cursor: 'pointer'
    },
  };

  return (
    <div style={styles.body}>
      <div style={styles.overlay}>
        <h2 style={styles.heading}>New Trip Request</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>From</label>
              <input type="date" name="fromDate" value={formData.fromDate} onChange={handleChange} style={styles.input} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>To</label>
              <input type="date" name="toDate" value={formData.toDate} onChange={handleChange} style={styles.input} />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Department</label>
              <select name="department" value={formData.department} onChange={handleChange} style={styles.select}>
                <option value="">Select department</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="IT">IT</option>
              </select>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Project Code</label>
              <input type="text" name="projectCode" value={formData.projectCode} onChange={handleChange} placeholder="Enter project code" style={styles.input} />
            </div>
          </div>
          <h2 style={styles.heading}>Work Plan</h2>

          <div style={styles.field}>
            <label style={styles.label}>Peroid</label>
            <input type="text" name="workPlan" value={formData.workPlan} onChange={handleChange} placeholder="Enter Peroid" style={styles.input} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Place</label>
            <input type="text" name="place" value={formData.place} onChange={handleChange} placeholder="Enter place" style={styles.input} />
          </div>

          

          <div style={styles.field}>
            <label style={styles.label}>Purpose</label>
            <input type="text" name="purpose" value={formData.purpose} onChange={handleChange} placeholder="Enter purpose" style={styles.input} />
          </div>

          <h2 style={styles.heading}>Advance Breakdown</h2>

      <div style={styles.field}>
        <label style={styles.label}>Accommodation</label>
        <input type="number" name="accommodation" value={formData.accommodation} onChange={handleChange} placeholder="Enter amount" style={styles.input} />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Daily Allowance</label>
        <input type="number" name="dailyAllowance" value={formData.dailyAllowance} onChange={handleChange} placeholder="Enter amount" style={styles.input} />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Transport</label>
        <div style={styles.radioGroup}>
          {transportModes.map(mode => (
            <label key={mode} style={styles.radioLabel}>
              <input
                type="radio"
                name="transportMode"
                value={mode}
                checked={formData.transportMode === mode}
                onChange={handleChange}
              />
              {mode}
            </label>
          ))}
        </div>
        <input
          type="number"
          name="transportAmount"
          value={formData.transportAmount}
          onChange={handleChange}
          placeholder={`Enter ${formData.transportMode || 'transport'} amount`}
          style={styles.input}
        />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Parking</label>
        <input type="number" name="parking" value={formData.parking} onChange={handleChange} placeholder="Enter amount" style={styles.input} />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Toll Charges</label>
        <input type="number" name="toll" value={formData.toll} onChange={handleChange} placeholder="Enter amount" style={styles.input} />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Communication</label>
        <input type="number" name="communication" value={formData.communication} onChange={handleChange} placeholder="Enter amount" style={styles.input} />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Miscellaneous</label>
        <input type="number" name="miscellaneous" value={formData.miscellaneous} onChange={handleChange} placeholder="Enter amount" style={styles.input} />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Others</label>
        <input type="number" name="others" value={formData.others} onChange={handleChange} placeholder="Enter amount" style={styles.input} />
      </div>

      <div style={styles.totalBox}>
        <strong>Total Advance Required: ₹{total}</strong>
      </div>
          <div style={styles.field}>
            <label style={styles.label}>Mode of Payment</label>
            <select name="modeOfPayment" value={formData.modeOfPayment} onChange={handleChange} style={styles.select}>
              <option value="">Select mode of payment</option>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="Online Transfer">Online Transfer</option>
            </select>
          </div>

          <button type="submit" style={styles.button}>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default TripRequestForm;

