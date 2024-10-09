import React from "react";

const GCRiders = ({ activeRider, benchRiders, onActivate, onBench }) => {
  return (
    <div className="gc-riders">
      <h3>GC Riders</h3>
      <div className="active-gc">
        <h4>Active GC Rider</h4>
        {activeRider ? (
          <div>
            {activeRider.name} - {activeRider.team}
            <button onClick={() => onBench(activeRider)}>Bench</button>
          </div>
        ) : (
          <p>No active GC rider</p>
        )}
      </div>
      <div className="bench-gc">
        <h4>Bench GC Riders</h4>
        {benchRiders.map((rider) => (
          <div key={rider.id}>
            {rider.name} - {rider.team}
            <button onClick={() => onActivate(rider)}>Activate</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GCRiders;
