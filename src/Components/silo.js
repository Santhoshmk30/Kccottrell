import React, { useState } from "react";

/* =============================
   CSS 3D SILO (INLINE CSS)
   ============================= */
function Silo3D({ topDia = 2, Hh = 1, Hc = 2, color = "steel" }) {
  const themes = {
    steel: { cylinder: "#bfc7d1", cone: "#b0b8c4" },
    cement: { cylinder: "#d8d8d8", cone: "#c0c0c0" },
    blue: { cylinder: "#7da7d9", cone: "#6c95c8" },
  };

  const t = themes[color];

  const cylHeight = Hc * 40;
  const coneHeight = Hh * 40;
  const cylWidth = topDia * 15;

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", marginTop: "20px" }}>
      <style>{`
        @keyframes spinSlow {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
      `}</style>

      {/* Cylinder */}
      <div
        style={{
          width: cylWidth,
          height: cylHeight,
          borderRadius: "20px 20px 0 0",
          background: `linear-gradient(90deg, ${t.cylinder}, #eef1f4, ${t.cylinder})`,
          border: "2px solid #a5acb8",
          animation: "spinSlow 12s linear infinite",
        }}
      ></div>

      {/* Hopper */}
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: cylWidth / 2 + "px solid transparent",
          borderRight: cylWidth / 2 + "px solid transparent",
          borderTop: coneHeight + "px solid " + t.cone,
          animation: "spinSlow 12s linear infinite",
        }}
      ></div>

      {/* Shadow */}
      <div
        style={{
          width: cylWidth,
          height: 18,
          marginTop: 10,
          borderRadius: "50%",
          background: "radial-gradient(rgba(0,0,0,0.3), transparent)",
        }}
      ></div>
    </div>
  );
}

/* =============================
   MAIN CALCULATOR (INLINE CSS)
   ============================= */
export default function Silo() {
  const [inputs, setInputs] = useState({
    totalVolume: "",
    topDia: "",
    bottomDia: "",
    reposeAngle: "",
    valleyAngle: "60",
  });

  const [results, setResults] = useState(null);

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const calculate = () => {
    const Vt = parseFloat(inputs.totalVolume);
    const D1 = parseFloat(inputs.topDia);
    const D2 = parseFloat(inputs.bottomDia);
    const α = parseFloat(inputs.reposeAngle) * (Math.PI / 180);
    const θ = parseFloat(inputs.valleyAngle) * (Math.PI / 180);

    if (isNaN(Vt) || isNaN(D1) || isNaN(D2) || isNaN(α) || isNaN(θ)) return;

    const Hh = (D1 - D2) / (2 * Math.tan(θ / 2));
    const hopperVol = (Math.PI * Hh * (D1 * D1 + D1 * D2 + D2 * D2)) / 12;

    const reposeHeight = (D1 / 2) * Math.tan(α);
    const reposeVol = (1 / 3) * Math.PI * (D1 / 2) ** 2 * reposeHeight;

    const cylVolNeeded = Vt - (hopperVol + reposeVol);
    const Hc = cylVolNeeded / (Math.PI * (D1 / 2) ** 2);

    setResults({
      hopperVol,
      reposeVol,
      cylVolNeeded,
      Hh,
      Hc,
      total: Vt,
      reposeHeight,
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "linear-gradient(135deg, #e3f2fd, #eceff1)",
        padding: "30px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: window.innerWidth < 768 ? "column" : "row",
          gap: "30px",
          maxWidth: "1200px",
          width: "100%",
        }}
      >
        {/* LEFT PANEL */}
        <div
          style={{
            flex: 1,
            background: "#fff",
            padding: "25px",
            borderRadius: "20px",
            boxShadow: "0px 8px 20px rgba(0,0,0,0.15)",
            border: "1px solid #ddd",
          }}
        >
          <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "15px", color: "#222" }}>
            Silo Design 
          </h1>

          {/* FORMULA BOX */}
          <div
            style={{
              background: "#f7f7f7",
              padding: "15px",
              borderRadius: "12px",
              border: "1px solid #ccc",
              marginBottom: "20px",
            }}
          >
            <h2 style={{ color: "#1e88e5", fontSize: "18px", marginBottom: "8px" }}> Used Formulas</h2>
            <p>• Hopper Height = (D1 - D2) / (2 × tan(θ/2))</p>
            <p>• Hopper Volume = π × Hopper Height × (D1² + D1·D2 + D2²) / 12</p>
            <p>• Repose Height = (D1 / 2) × tan(α)</p>
            <p>• Repose Volume = (1/3) × π × r² × Repose Height</p>
             <p>• Cylidrical Volume = Total Volume - (Hopper Volume + Repose volume )</p>
            <p>• Cylindrical Height = Cylindrical Volume / (π × r²)</p>
          </div>

          {/* INPUTS */}
          {Object.keys(inputs).map((key) => (
            <input
              key={key}
              name={key}
              value={inputs[key]}
              onChange={handleChange}
              placeholder={key}
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "12px",
                borderRadius: "10px",
                border: "1px solid #bbb",
                fontSize: "16px",
                outline: "none",
                background: "#fafafa",
              }}
            />
          ))}

          {/* BUTTON */}
          <button
            onClick={calculate}
            style={{
              width: "100%",
              padding: "12px",
              background: "linear-gradient(to right, #1e88e5, #3949ab)",
              border: "none",
              borderRadius: "12px",
              color: "#fff",
              fontSize: "18px",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            Calculate
          </button>

          {/* RESULTS */}
          {results && (
            <div
              style={{
                marginTop: "20px",
                background: "#fff",
                padding: "20px",
                borderRadius: "15px",
                border: "1px solid #ccc",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              }}
            >
              <h2 style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "10px" }}>
                 Results
              </h2>

              <p><b>1️⃣ Hopper Height:</b> {results.Hh.toFixed(3)} m</p>
              <p><b>2️⃣ Hopper Volume:</b> {results.hopperVol.toFixed(3)} m³</p>
              <p><b>3️⃣ Repose Height:</b> {results.reposeHeight.toFixed(3)} m</p>
              <p><b>4️⃣ Repose Volume:</b> {results.reposeVol.toFixed(3)} m³</p>
              <p><b>5️⃣ Cylinder Volume Needed:</b> {results.cylVolNeeded.toFixed(3)} m³</p>
              <p><b>6️⃣ Cylinder Height:</b> {results.Hc.toFixed(3)} m</p>

              <h3 style={{ marginTop: "12px", color: "#1e88e5", fontSize: "20px" }}>
                Total Volume: {results.total.toFixed(2)} m³
              </h3>
            </div>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div
          style={{
            width: "350px",
            background: "#fff",
            padding: "20px",
            borderRadius: "20px",
            border: "1px solid #ccc",
            boxShadow: "8px 20px rgba(0,0,0,0.15)",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Silo3D
            topDia={parseFloat(inputs.topDia) || 2}
            Hh={results?.Hh || 1}
            Hc={results?.Hc || 2}
            color="steel"
          />
        </div>
      </div>
    </div>
  );
}
