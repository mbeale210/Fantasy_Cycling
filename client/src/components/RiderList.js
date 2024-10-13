import React from "react";

const RiderList = ({ riders, showRank, onDraft }) => {
  return (
    <table>
      <thead>
        <tr>
          {showRank && <th>Rank</th>}
          <th>Name</th>
          <th>Team</th>
          <th>Points</th>
          <th>Type</th>
          {onDraft && <th>Action</th>}
        </tr>
      </thead>
      <tbody>
        {riders.map((rider, index) => (
          <tr key={rider.id}>
            {showRank && <td>{index + 1}</td>} {/* Add the ranking number */}
            <td>{rider.name}</td>
            <td>{rider.team || "N/A"}</td>{" "}
            {/* Show team name or N/A if not available */}
            <td>{rider.points || 0}</td>{" "}
            {/* Show points or 0 if not available */}
            <td>{rider.is_gc ? "GC" : "Domestique"}</td>
            {onDraft && (
              <td>
                <button onClick={() => onDraft(rider)}>Draft</button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RiderList;
