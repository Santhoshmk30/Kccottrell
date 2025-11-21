import React, { useState } from "react";

/* =============================================================
   3D SILO SHAPE MODEL
   ============================================================= */
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

      {/* Cylinder */}
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

      {/* Hopper */}
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

/* =============================================================
   SILO CARD
   ============================================================= */
function SiloCard({ totalVolumeFromFlow }) {
  const [inputs, setInputs] = useState({
    totalVolume: "",
    topDia: "",
    bottomDia: "",
    reposeAngle: "",
    valleyAngle: "60",
  });

  const [results, setResults] = useState(null);

  /* AUTO SET VOLUME FROM FLOW */
  React.useEffect(() => {
    if (totalVolumeFromFlow) {
      setInputs((prev) => ({
        ...prev,
        totalVolume: totalVolumeFromFlow.toFixed(3),
      }));
    }
  }, [totalVolumeFromFlow]);

  const handleChange = (e) =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });

  /* MAIN CALCULATE */
  const calculate = () => {
    const Vt = parseFloat(inputs.totalVolume);
    const D1 = parseFloat(inputs.topDia);
    const D2 = parseFloat(inputs.bottomDia);
    const alpha = parseFloat(inputs.reposeAngle) * (Math.PI / 180);
    const theta = parseFloat(inputs.valleyAngle) * (Math.PI / 180);

    const Hh = (D1 - D2) / (2 * Math.tan(theta / 2));
    const hopperVol =
      (Math.PI * Hh * (D1 * D1 + D1 * D2 + D2 * D2)) / 12;

    const reposeHeight = (D1 / 2) * Math.tan(alpha);
    const reposeVol =
      (1 / 3) * Math.PI * (D1 / 2) ** 2 * reposeHeight;

    const cylVolNeeded = Vt - (hopperVol + reposeVol);
    const Hc = cylVolNeeded / (Math.PI * (D1 / 2) ** 2);

    const totalHeight = Hh + Hc + reposeHeight;
    const ratio = totalHeight / D1;

    setResults({
      hopperVol,
      reposeVol,
      cylVolNeeded,
      Hh,
      Hc,
      reposeHeight,
      totalHeight,
      ratio,
    });
  };

  /* AUTO FIX RATIO FUNCTION */
  const fixRatio = (target) => {
    if (!results) return;

    const oldD1 = parseFloat(inputs.topDia);
    const oldD2 = parseFloat(inputs.bottomDia);

    const newD1 = results.totalHeight / target;
    const scale = newD1 / oldD1;
    const newD2 = oldD2 * scale;

    setInputs({
      ...inputs,
      topDia: newD1.toFixed(3),
      bottomDia: newD2.toFixed(3),
    });

    setResults(null); // Recalculate needed
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

      {/* Inputs */}
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
          }}
        />
      ))}

      <button
        onClick={calculate}
        style={{
          width: "100%",
          padding: "12px",
          background: "#3949ab",
          color: "#fff",
          borderRadius: "10px",
          marginBottom: "10px",
        }}
      >
        Calculate
      </button>

      {/* AUTO FIX RATIO BUTTONS */}
      <div style={{ display: "flex", gap: "5px", marginBottom: "10px" }}>
        <button
          onClick={() => fixRatio(1.5)}
          style={{
            flex: 1,
            padding: "10px",
            background: "#00897b",
            borderRadius: "10px",
            color: "#fff",
            border: "none",
          }}
        >
          Ratio 1.5
        </button>
        <button
          onClick={() => fixRatio(1.7)}
          style={{
            flex: 1,
            padding: "10px",
            background: "#6a1b9a",
            borderRadius: "10px",
            color: "#fff",
            border: "none",
          }}
        >
          Ratio 1.7
        </button>
        <button
          onClick={() => fixRatio(2.0)}
          style={{
            flex: 1,
            padding: "10px",
            background: "#2e7d32",
            borderRadius: "10px",
            color: "#fff",
            border: "none",
          }}
        >
          Ratio 2.0
        </button>
      </div>

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
            borderRadius: "12px",
            background: "#fafafa",
            border: "1px solid #ddd",
          }}
        >
          <h3>📌 Results</h3>
          <p>Hopper Height: {results.Hh.toFixed(3)} m</p>
          <p>Repose Height: {results.reposeHeight.toFixed(3)} m</p>
          <p>Cylinder Height: {results.Hc.toFixed(3)} m</p>
          <p><b>Total Height:</b> {results.totalHeight.toFixed(3)} m</p>
          <p><b>Ratio:</b> {results.ratio.toFixed(3)}</p>
        </div>
      )}
    </div>
  );
}

/* =============================================================
   FLOW CARD
   ============================================================= */
function FlowCard({ setTotalVolume }) {
  const [inputs, setInputs] = useState({
    flow: "",
    idc: "",
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
    let F2 = flow * idc;
    let F3 = (flow * idc) / 1000;
    let F4 = F3 * 3600;
    let F5 = F4 * density;
    let F6 = F5 * storage;

    setExtra({ F1, F2, F3, F4, F5, F6 });

    setTotalVolume(F6); // AUTO SEND TO SILO CARD
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
          }}
        />
      ))}

      <button
        onClick={calculate}
        style={{
          width: "100%",
          padding: "12px",
          background: "#d84315",
          color: "#fff",
          borderRadius: "10px",
        }}
      >
        Calculate
      </button>

      {extra && (
        <div
          style={{
            marginTop: "10px",
            padding: "15px",
            borderRadius: "12px",
            background: "#fafafa",
            border: "1px solid #ddd",
          }}
        >
          <h3>📌 Flow Outputs</h3>
          <p>Final Total = {extra.F6.toFixed(3)}</p>
        </div>
      )}
    </div>
  );
}

/* =============================================================
   FINAL PAGE WRAPPER
   ============================================================= */
export default function SiloFlowPage() {
  const [totalVolumeFromFlow, setTotalVolumeFromFlow] = useState(null);

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "20px",
        background: "#eef2f7",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        <SiloCard totalVolumeFromFlow={totalVolumeFromFlow} />
        <FlowCard setTotalVolume={setTotalVolumeFromFlow} />
      </div>
    </div>
  );
}
