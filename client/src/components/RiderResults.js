import React from "react";

const RiderResults = ({ results }) => {
  return (
    <table>
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
        {results.map((result, index) => (
          <tr key={result.id}>
            <td>{index + 1}</td>
            <td>{result.rider_name}</td>
            <td>{result.team}</td>
            <td>{new Date(result.time * 1000).toISOString().substr(11, 8)}</td>
            <td>{result.sprint_pts}</td>
            <td>{result.mountain_pts}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RiderResults;
