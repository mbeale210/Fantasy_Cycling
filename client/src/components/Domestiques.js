import React from "react";

const Domestiques = ({ activeRiders, benchRiders, onUpdate }) => {
  const handleActivate = (rider) => {
    if (activeRiders.length < 4) {
      onUpdate({
        active_domestiques: [...activeRiders.map((r) => r.id), rider.id],
        bench_domestiques: benchRiders
          .map((r) => r.id)
          .filter((id) => id !== rider.id),
      });
    }
  };

  const handleBench = (rider) => {
    onUpdate({
      active_domestiques: activeRiders
        .map((r) => r.id)
        .filter((id) => id !== rider.id),
      bench_domestiques: [...benchRiders.map((r) => r.id), rider.id],
    });
  };

  return (
    <div className="domestiques">
      <h3>Domestiques</h3>
      <div className="active-domestiques">
        <h4>Active Domestiques ({activeRiders.length}/4)</h4>
        {activeRiders.map((rider) => (
          <div key={rider.id}>
            {rider.name} - {rider.team}
            <button onClick={() => handleBench(rider)}>Bench</button>
          </div>
        ))}
      </div>
      <div className="bench-domestiques">
        <h4>Bench Domestiques</h4>
        {benchRiders.map((rider) => (
          <div key={rider.id}>
            {rider.name} - {rider.team}
            <button
              onClick={() => handleActivate(rider)}
              disabled={activeRiders.length >= 4}
            >
              Activate
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Domestiques;
