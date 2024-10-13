import React from "react";

const RiderResults = ({ results }) => {
  const sortedResults = [...results].sort((a, b) => a.time - b.time);

  return (
    <div className="rider-results-container">
      <table className="rider-results-table">
        <thead>
          <tr>
            <th>Position</th>
            <th>Rider</th>
            <th>Team</th>
            <th>Time</th>
            <th>Sprint Points</th>
            <th>Mountain Points</th>
          </tr>
        </thead>
        <tbody>
          {sortedResults.map((result, index) => (
            <tr key={result.id} className={index === 0 ? "stage-winner" : ""}>
              <td>{index + 1}</td>
              <td>{result.rider_name}</td>
              <td>{result.team}</td>
              <td>
                {new Date(result.time * 1000).toISOString().substr(11, 8)}
              </td>
              <td>{result.sprint_pts}</td>
              <td>{result.mountain_pts}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RiderResults;
