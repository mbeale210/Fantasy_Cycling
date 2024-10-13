import React from "react";

const RiderList = ({ riders, showRank, onDraft, showTeam = true }) => {
  return (
    <div className="rider-list-container">
      <table className="rider-table">
        <thead>
          <tr>
            {showRank && <th>Rank</th>}
            <th>Name</th>
            {showTeam && <th>Team</th>}
            <th>Points</th>
            <th>Type</th>
            {onDraft && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {riders.map((rider, index) => (
            <tr key={rider.id}>
              {showRank && <td>{index + 1}</td>}
              <td>{rider.name}</td>
              {showTeam && <td>{rider.team}</td>}
              <td>{rider.career_points || 0}</td>
              <td>{rider.is_gc ? "GC" : "Domestique"}</td>
              {onDraft && (
                <td>
                  <button
                    className="btn draft-btn"
                    onClick={() => onDraft(rider)}
                  >
                    Draft
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RiderList;
