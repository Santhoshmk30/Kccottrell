import React, { useState } from "react";

/* =============================
   ⚙️ CSS 3D SILO COMPONENT
   ============================= */
function Silo3D({ topDia = 2, Hh = 1, Hc = 2, color = "steel" }) {
  const themes = {
    steel: { cylinder: "#bfc7d1", cone: "#b0b8c4" },
    cement: { cylinder: "#d8d8d8", cone: "#c0c0c0" },
    blue: { cylinder: "#7da7d9", cone: "#6c95c8" },
  };

  const t = themes[color] || themes.steel;

  const cylHeight = Hc * 40;
  const coneHeight = Hh * 40;
  const cylWidth = topDia * 15;

  return (
    <div className="w-full flex flex-col items-center mt-4">
      <style>{`
        @keyframes spinSlow {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
      `}</style>

      {/* Cylinder */}
      <div
        className="rounded-t-full"
        style={{
          width: cylWidth + "px",
          height: cylHeight + "px",
          background: `linear-gradient(90deg, ${t.cylinder}, #eef1f4, ${t.cylinder})`,
          border: "2px solid #a5acb8",
          animation: "spinSlow 12s linear infinite",
        }}
      ></div>

      {/* Hopper / Cone */}
      <div
        style={{
          width: "0px",
          height: "0px",
          borderLeft: cylWidth / 2 + "px solid transparent",
          borderRight: cylWidth / 2 + "px solid transparent",
          borderTop: coneHeight + "px solid " + t.cone,
          animation: "spinSlow 12s linear infinite",
        }}
      ></div>

      {/* Shadow */}
      <div
        className="mt-2 rounded-full"
        style={{
          width: cylWidth + "px",
          height: "18px",
          background: "radial-gradient(rgba(0,0,0,0.25), transparent)",
        }}
      ></div>
    </div>
  );
}

/* =============================
   📐 MAIN CALCULATOR COMPONENT
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
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-gray-100 p-6 flex justify-center">
      <div className="flex flex-col md:flex-row gap-8 max-w-6xl w-full">

        {/* LEFT PANEL */}
        <div className="flex-1 bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">Silo Design Calculator</h1>

          {/* FORMULAS */}
          <div className="bg-gray-100 rounded-xl p-4 mb-6 shadow-inner border border-gray-300">
            <h2 className="text-lg font-semibold mb-2 text-blue-700">📘 Used Formulas</h2>
            <p className="text-sm">• Hh = (D1 - D2) / (2 × tan(θ/2))</p>
            <p className="text-sm">• Vh = π × Hh × (D1² + D1·D2 + D2²) / 12</p>
            <p className="text-sm">• hf = (D1 / 2) × tan(α)</p>
            <p className="text-sm">• Vr = (1/3) × π × r² × hf</p>
            <p className="text-sm">• Hc = Vc / (π × r²)</p>
          </div>

          {/* INPUTS */}
          <div className="grid grid-cols-1 gap-3">
            {Object.keys(inputs).map((key) => (
              <input
                key={key}
                name={key}
                value={inputs[key]}
                onChange={handleChange}
                placeholder={key}
                className="border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
              />
            ))}
          </div>

          {/* BUTTON */}
          <button
            onClick={calculate}
            className="w-full mt-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all font-semibold"
          >
            Calculate
          </button>

          {/* RESULTS */}
          {results && (
            <div className="mt-6 bg-white border border-gray-300 p-5 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">📌 Step-by-Step Results</h2>

              <div className="space-y-3 text-gray-700">
                <p><b>1️⃣ Hopper Height:</b> {results.Hh.toFixed(3)} m</p>
                <p><b>2️⃣ Hopper Volume:</b> {results.hopperVol.toFixed(3)} m³</p>
                <p><b>3️⃣ Repose Height:</b> {results.reposeHeight.toFixed(3)} m</p>
                <p><b>4️⃣ Repose Volume:</b> {results.reposeVol.toFixed(3)} m³</p>
                <p><b>5️⃣ Cylinder Volume Needed:</b> {results.cylVolNeeded.toFixed(3)} m³</p>
                <p><b>6️⃣ Cylinder Height:</b> {results.Hc.toFixed(3)} m</p>

                <h2 className="text-xl font-bold text-blue-700 mt-4">
                  Total Required Volume: {results.total.toFixed(2)} m³
                </h2>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANEL – SILO MODEL */}
        <div className="w-full md:w-1/3 bg-white p-4 rounded-2xl shadow-xl border flex justify-center items-start">
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
