import React from "react";

const Domestiques = ({ activeRiders, benchRiders, onActivate, onBench }) => {
  return (
    <div className="domestiques">
      <h3>Domestiques</h3>
      <div className="active-domestiques">
        <h4>Active Domestiques ({activeRiders.length}/4)</h4>
        {activeRiders.map((rider) => (
          <div key={rider.id}>
            {rider.name} - {rider.team}
            <button onClick={() => onBench(rider)}>Bench</button>
          </div>
        ))}
      </div>
      <div className="bench-domestiques">
        <h4>Bench Domestiques</h4>
        {benchRiders.map((rider) => (
          <div key={rider.id}>
            {rider.name} - {rider.team}
            <button
              onClick={() => onActivate(rider)}
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
