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
            <td>{rider.team}</td> {/* Team name or Open Rider */}
            <td>{rider.career_points || 0}</td> {/* Show career points or 0 */}
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
