import React, { useState } from "react";

/* =============================
   CSS 3D SILO (INLINE CSS)
   ============================= */
function Silo3D({ topDia = 2, Hh = 1, Hc = 2 }) {
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

      <div
        style={{
          width: cylWidth,
          height: cylHeight,
          borderRadius: "20px 20px 0 0",
          background: `linear-gradient(90deg, #bfc7d1, #eef1f4, #bfc7d1)`,
          border: "2px solid #a5acb8",
          animation: "spinSlow 12s linear infinite",
        }}
      ></div>

      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: cylWidth / 2 + "px solid transparent",
          borderRight: cylWidth / 2 + "px solid transparent",
          borderTop: coneHeight + "px solid #b0b8c4",
          animation: "spinSlow 12s linear infinite",
        }}
      ></div>

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
   MAIN CALCULATOR
   ============================= */
export default function Silo() {
  const [inputs, setInputs] = useState({
    totalVolume: "",
    topDia: "",
    bottomDia: "",
    reposeAngle: "",
    valleyAngle: "60",

    // NEW INPUTS
    flow: "",
    idc: "",
    temp: "",
    density: "",
    storage: "",
  });

  const [results, setResults] = useState(null);
  const [extra, setExtra] = useState(null);

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const calculate = () => {
    const Vt = parseFloat(inputs.totalVolume);
    const D1 = parseFloat(inputs.topDia);
    const D2 = parseFloat(inputs.bottomDia);
    const α = parseFloat(inputs.reposeAngle) * (Math.PI / 180);
    const θ = parseFloat(inputs.valleyAngle) * (Math.PI / 180);

    const flow = parseFloat(inputs.flow);
    const idc = parseFloat(inputs.idc);
    const density = parseFloat(inputs.density);
    const storage = parseFloat(inputs.storage);

    if (isNaN(Vt) || isNaN(D1) || isNaN(D2) || isNaN(α)) return;

    const Hh = (D1 - D2) / (2 * Math.tan(θ / 2));
    const hopperVol = (Math.PI * Hh * (D1 * D1 + D1 * D2 + D2 * D2)) / 12;

    const reposeHeight = (D1 / 2) * Math.tan(α);
    const reposeVol = (1 / 3) * Math.PI * (D1 / 2) ** 2 * reposeHeight;

    const cylVolNeeded = Vt - (hopperVol + reposeVol);
    const Hc = cylVolNeeded / (Math.PI * (D1 / 2) ** 2);

    setResults({ hopperVol, reposeVol, cylVolNeeded, Hh, Hc, total: Vt, reposeHeight });

    // EXTRA FLOW + IDC + DENSITY + STORAGE CALCULATIONS
    let F1 = flow / 3600;
    let F2 = flow * idc;
    let F3 = (flow * idc) / 1000;
    let F4 = F3 * 3600;
    let F5 = F4 * density;
    let F6 = F5 * storage;

    setExtra({ F1, F2, F3, F4, F5, F6 });
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
            Silo Design Calculator
          </h1>

          {/* INPUT FIELDS */}
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
              borderRadius: "12px",
              border: "none",
              color: "#fff",
              fontSize: "18px",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            Calculate
          </button>

          {/* SILO RESULTS */}
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
                📌 Silo Results
              </h2>

              <p><b>Hopper Height:</b> {results.Hh.toFixed(3)} m</p>
              <p><b>Hopper Volume:</b> {results.hopperVol.toFixed(3)} m³</p>
              <p><b>Repose Height:</b> {results.reposeHeight.toFixed(3)} m</p>
              <p><b>Repose Volume:</b> {results.reposeVol.toFixed(3)} m³</p>
              <p><b>Cylinder Volume Needed:</b> {results.cylVolNeeded.toFixed(3)} m³</p>
              <p><b>Cylinder Height:</b> {results.Hc.toFixed(3)} m</p>

              <h3 style={{ marginTop: "12px", color: "#1e88e5", fontSize: "20px" }}>
                Total Volume: {results.total.toFixed(2)} m³
              </h3>
            </div>
          )}

          {/* EXTRA CALCULATIONS */}
          {extra && (
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
                🔬 Flow + IDC + Density Results
              </h2>

              <p><b>flow / 3600 :</b> {extra.F1.toFixed(3)}</p>
              <p><b>flow × idc :</b> {extra.F2.toFixed(3)}</p>
              <p><b>(flow × idc) ÷ 1000 :</b> {extra.F3.toFixed(3)}</p>
              <p><b>(flow × idc ÷ 1000) × 3600 :</b> {extra.F4.toFixed(3)}</p>
              <p><b>Above × density :</b> {extra.F5.toFixed(3)}</p>
              <p><b>FINAL (× storage) :</b> {extra.F6.toFixed(3)}</p>
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
            boxShadow: "0px 8px 20px rgba(0,0,0,0.15)",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Silo3D
            topDia={parseFloat(inputs.topDia) || 2}
            Hh={results?.Hh || 1}
            Hc={results?.Hc || 2}
          />
        </div>

      </div>
    </div>
  );
}
