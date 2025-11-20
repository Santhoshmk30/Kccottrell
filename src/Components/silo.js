import { useState } from "react";

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
export default function SiloCalculator() {
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

    setResults({ hopperVol, reposeVol, cylVolNeeded, Hh, Hc, total: Vt, reposeHeight });
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 max-w-5xl mx-auto">
      {/* LEFT SIDE UI */}
      <div className="flex-1 space-y-6">
        <h1 className="text-3xl font-bold">All-in-One Silo Design Calculator</h1>

        <div className="p-4 border rounded bg-gray-50 space-y-2 shadow">
          <h2 className="text-xl font-semibold">📘 Used Formulas</h2>
          <p>Hh = (D1 - D2) / (2 × tan(θ/2))</p>
          <p>Vh = π × Hh × (D1² + D1·D2 + D2²) / 12</p>
          <p>hf = (D1 / 2) × tan(α)</p>
          <p>Vr = (1/3) × π × r² × hf</p>
          <p>Hc = Vc / (π × r²)</p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {Object.keys(inputs).map((key) => (
            <input
              key={key}
              name={key}
              value={inputs[key]}
              onChange={handleChange}
              placeholder={key}
              className="border p-2 rounded shadow"
            />
          ))}
        </div>

        <button
          onClick={calculate}
          className="bg-blue-600 text-white px-4 py-2 rounded mt-4 shadow hover:bg-blue-700"
        >
          Calculate
        </button>

        {results && (
          <div className="mt-6 p-4 border rounded space-y-4 shadow bg-white">
            <h2 className="text-lg font-semibold">📌 Step-by-Step Calculation</h2>

            <div>
              <p className="font-bold">1️⃣ Hopper Height (Hh)</p>
              <p>= ({inputs.topDia} - {inputs.bottomDia}) / (2 × tan({inputs.valleyAngle}/2))</p>
              <p>= {results.Hh.toFixed(3)} m</p>
            </div>

            <div>
              <p className="font-bold">2️⃣ Hopper Volume (Vh)</p>
              <p>= {results.hopperVol.toFixed(3)} m³</p>
            </div>

            <div>
              <p className="font-bold">3️⃣ Repose Height (hf)</p>
              <p>= {results.reposeHeight.toFixed(3)} m</p>
            </div>

            <div>
              <p className="font-bold">4️⃣ Repose Volume (Vr)</p>
              <p>= {results.reposeVol.toFixed(3)} m³</p>
            </div>

            <div>
              <p className="font-bold">5️⃣ Cylinder Volume Needed (Vc)</p>
              <p>= {results.cylVolNeeded.toFixed(3)} m³</p>
            </div>

            <div>
              <p className="font-bold">6️⃣ Cylinder Height (Hc)</p>
              <p>= {results.Hc.toFixed(3)} m</p>
            </div>

            <h2 className="text-lg font-bold">Total Volume: {results.total.toFixed(2)} m³</h2>
          </div>
        )}
      </div>

      {/* RIGHT SIDE 3D SILO */}
      <div className="w-full md:w-1/3 flex justify-center items-start">
        <Silo3D
          topDia={parseFloat(inputs.topDia) || 2}
          Hh={results?.Hh || 1}
          Hc={results?.Hc || 2}
          color="steel"
        />
      </div>
    </div>
  );
}
