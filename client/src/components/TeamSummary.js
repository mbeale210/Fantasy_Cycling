import React from "react";
import { Link } from "react-router-dom";

const TeamSummary = ({ team }) => {
  return (
    <div className="team-summary">
      <h3>{team.name}</h3>
      <p>Total Points: {team.sprint_pts + team.mountain_pts}</p>
      <p>Sprint Points: {team.sprint_pts}</p>
      <p>Mountain Points: {team.mountain_pts}</p>
      <Link to={`/my-team/${team.id}`}>View Team</Link>
    </div>
  );
};

export default TeamSummary;
