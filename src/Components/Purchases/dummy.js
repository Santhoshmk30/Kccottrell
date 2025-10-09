import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = ["#4CAF50", "#FF9800", "#F44336", "#2196F3"]; // Example colors

const AttendanceCard = ({ attendanceData }) => {
  const [hover, setHover] = useState(false);
  const isMobile = window.innerWidth <= 768;

  const styles = {
    card: {
      position: "relative",
      width: isMobile ? "90%" : "550px",
      padding: isMobile ? "15px" : "20px",
      margin: "20px auto",
      borderRadius: 20,
      background: "linear-gradient(145deg, #FAF7EB, #F0E6D6)",
      boxShadow: hover
        ? "0 12px 25px rgba(224, 74, 74, 0.25)"
        : "0 6px 20px rgba(0,0,0,0.1)",
      transform: hover ? "translateY(-4px) scale(1.02)" : "scale(1)",
      transition: "all 0.3s ease",
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      alignItems: "center",
      gap: isMobile ? "15px" : "25px",
      overflow: "hidden",
    },
    shimmerBorder: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: 20,
      background:
        "linear-gradient(130deg, rgba(255, 255, 255, 0.3), rgba(250, 247, 247, 0.6), rgba(146, 130, 130, 0.3))",
      backgroundSize: "200% 200%",
      animation: hover ? "shimmerMove 3s linear infinite" : "none",
      zIndex: 0,
    },
    legend: {
      flex: 1,
      position: "relative",
      zIndex: 1,
    },
    cardTitle: {
      marginBottom: 12,
      fontSize: isMobile ? 16 : 18,
      fontWeight: 600,
      color: "#2c3e50",
    },
    dataRow: {
      display: "flex",
      alignItems: "center",
      marginBottom: 8,
      fontSize: isMobile ? 13 : 14,
      color: "#2c3e50",
    },
    pieContainer: {
      flexShrink: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: isMobile ? "100%" : 180,
      height: isMobile ? 180 : 180,
      marginTop: isMobile ? 15 : 0,
      position: "relative",
      zIndex: 1,
    },
  };

  // Create gradient definitions for Pie slices
  const renderPieWithGradients = () => (
    <PieChart width={isMobile ? 150 : 180} height={isMobile ? 150 : 180}>
      <defs>
        {attendanceData.map((entry, index) => (
          <radialGradient
            key={`grad-${index}`}
            id={`grad-${index}`}
            cx="50%"
            cy="50%"
            r="70%"
          >
            <stop offset="0%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.8} />
            <stop offset="100%" stopColor={COLORS[index % COLORS.length]} stopOpacity={1} />
          </radialGradient>
        ))}
      </defs>
      <Pie
        data={attendanceData}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        innerRadius={isMobile ? 35 : 50}
        outerRadius={isMobile ? 70 : 80}
        paddingAngle={1}
        stroke="#fff"
      >
        {attendanceData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={`url(#grad-${index})`} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );

  return (
    <div
      style={styles.card}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Shimmer Border */}
      <div style={styles.shimmerBorder}></div>

      {/* Left: Legend */}
      <div style={styles.legend}>
        <h3 style={styles.cardTitle}>Attendance Overview</h3>
        {attendanceData.map((item, index) => (
          <div key={index} style={styles.dataRow}>
            <span
              style={{
                display: "inline-block",
                width: "12px",
                height: "12px",
                backgroundColor: COLORS[index % COLORS.length],
                marginRight: "8px",
                borderRadius: "50%",
              }}
            ></span>
            <span style={{ fontWeight: "600" }}>{item.name}:</span>
            <span style={{ marginLeft: 6 }}>{item.value}</span>
          </div>
        ))}
      </div>

      {/* Right: Pie Chart with gradients */}
      <div style={styles.pieContainer}>{renderPieWithGradients()}</div>

      {/* Shimmer Animation Keyframes */}
      <style>
        {`
          @keyframes shimmerMove {
            0% { background-position: 0% 50%; }
            100% { background-position: 200% 50%; }
          }
        `}
      </style>
    </div>
  );
};

export default AttendanceCard;
