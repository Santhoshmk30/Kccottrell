import React, { useState } from "react";

/* =============================
   SILO 3D MODEL (INLINE CSS)
   ============================= */
function Silo3D({ topDia = 2, Hh = 1, Hc = 2 }) {
  const cylHeight = Hc * 40;
  const coneHeight = Hh * 40;
  const cylWidth = topDia * 15;

  return (
    <div style={{ textAlign: "center", marginTop: "10px" }}>
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
          background: "linear-gradient(90deg, #bfc7d1, #eef1f4, #bfc7d1)",
          border: "2px solid #999",
          borderRadius: "20px 20px 0 0",
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
    </div>
  );
}

/* =============================
   CARD 1 — SILO CALCULATOR
   ============================= */
function SiloCard() {
  const [inputs, setInputs] = useState({
    totalVolume: "",
    topDia: "",
    bottomDia: "",
    reposeAngle: "",
    valleyAngle: "60",
  });

  const [results, setResults] = useState(null);

  const handleChange = (e) =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });

  const calculate = () => {
    const Vt = parseFloat(inputs.totalVolume);
    const D1 = parseFloat(inputs.topDia);
    const D2 = parseFloat(inputs.bottomDia);
    const α = parseFloat(inputs.reposeAngle) * (Math.PI / 180);
    const θ = parseFloat(inputs.valleyAngle) * (Math.PI / 180);

    const Hh = (D1 - D2) / (2 * Math.tan(θ / 2));
    const hopperVol =
      (Math.PI * Hh * (D1 * D1 + D1 * D2 + D2 * D2)) / 12;

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
        width: "380px",
        background: "#fff",
        padding: "20px",
        borderRadius: "18px",
        margin: "10px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
        border: "1px solid #ccc",
      }}
    >
      <h2 style={{ fontSize: "22px", marginBottom: "10px" }}>
        🏗️ Silo Calculator
      </h2>

      {Object.keys(inputs).map((key) => (
        <input
          key={key}
          name={key}
          value={inputs[key]}
          onChange={handleChange}
          placeholder={key.toUpperCase()}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "10px",
            border: "1px solid #aaa",
            background: "#f9f9f9",
            fontSize: "15px",
          }}
        />
      ))}

      <button
        onClick={calculate}
        style={{
          width: "100%",
          padding: "12px",
          background: "linear-gradient(to right, #1e88e5, #3949ab)",
          borderRadius: "10px",
          border: "none",
          color: "#fff",
          fontSize: "16px",
          marginBottom: "10px",
          cursor: "pointer",
        }}
      >
        Calculate
      </button>

      <Silo3D
        topDia={parseFloat(inputs.topDia) || 2}
        Hh={results?.Hh || 1}
        Hc={results?.Hc || 2}
      />

      {results && (
        <div
          style={{
            marginTop: "10px",
            padding: "15px",
            background: "#fafafa",
            borderRadius: "12px",
            border: "1px solid #ddd",
          }}
        >
          <h3>📌 Results</h3>
          <p>Hopper Height: {results.Hh.toFixed(3)}</p>
          <p>Hopper Volume: {results.hopperVol.toFixed(3)}</p>
          <p>Repose Height: {results.reposeHeight.toFixed(3)}</p>
          <p>Repose Volume: {results.reposeVol.toFixed(3)}</p>
          <p>Cylinder Height: {results.Hc.toFixed(3)}</p>
        </div>
      )}
    </div>
  );
}

/* =============================
   CARD 2 — FLOW CALCULATOR
   ============================= */
function FlowCard() {
  const [inputs, setInputs] = useState({
    flow: "",
    idc: "",
    temp: "",
    density: "",
    storage: "",
  });

  const [extra, setExtra] = useState(null);

  const handleChange = (e) =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });

  const calculate = () => {
    const flow = parseFloat(inputs.flow);
    const idc = parseFloat(inputs.idc);
    const density = parseFloat(inputs.density);
    const storage = parseFloat(inputs.storage);

    let F1 = flow / 3600;
    let F2 = F1 * idc;
    let F3 = (F1 * idc) / 1000;
    let F4 = F3 * 3600;
    let F5 = F4 / density;
    let F6 = F5 * storage;

    setExtra({ F1, F2, F3, F4, F5, F6 });
  };

  return (
    <div
      style={{
        width: "380px",
        background: "#fff",
        padding: "20px",
        borderRadius: "18px",
        margin: "10px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
        border: "1px solid #ccc",
      }}
    >
      <h2 style={{ fontSize: "22px", marginBottom: "10px" }}>
        🔬 Flow Calculator
      </h2>

      {Object.keys(inputs).map((key) => (
        <input
          key={key}
          name={key}
          value={inputs[key]}
          onChange={handleChange}
          placeholder={key.toUpperCase()}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "10px",
            border: "1px solid #aaa",
            background: "#f9f9f9",
            fontSize: "15px",
          }}
        />
      ))}

      <button
        onClick={calculate}
        style={{
          width: "100%",
          padding: "12px",
          background: "linear-gradient(to right, #ff7043, #d84315)",
          borderRadius: "10px",
          border: "none",
          color: "#fff",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Calculate
      </button>

      {extra && (
        <div
          style={{
            marginTop: "10px",
            padding: "15px",
            background: "#fafafa",
            borderRadius: "12px",
            border: "1px solid #ddd",
          }}
        >
          <h3>📌 Results</h3>
          <p>flow / 3600 = {extra.F1.toFixed(3)}</p>
          <p>flow × idc = {extra.F2.toFixed(3)}</p>
          <p>(flow × idc) ÷ 1000 = {extra.F3.toFixed(3)}</p>
          <p>× 3600 = {extra.F4.toFixed(3)}</p>
          <p>× density = {extra.F5.toFixed(3)}</p>
          <p>× storage = {extra.F6.toFixed(3)}</p>
        </div>
      )}
    </div>
  );
}

/* =============================
   FINAL PAGE — BOTH CARDS
   ============================= */
export default function SiloFlowPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "20px",
        background: "#f1f4f8",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        <SiloCard />
        <FlowCard />
      </div>
    </div>
  );
}
