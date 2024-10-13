import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const TeamSummary = ({ team, teamPoints }) => {
  const [totalSprintPoints, setTotalSprintPoints] = useState(0);
  const [totalMountainPoints, setTotalMountainPoints] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    if (teamPoints) {
      setTotalSprintPoints(teamPoints.totalSprintPoints);
      setTotalMountainPoints(teamPoints.totalMountainPoints);
      setTotalPoints(
        teamPoints.totalSprintPoints + teamPoints.totalMountainPoints
      );
    }
  }, [teamPoints]);

  return (
    <div className="team-summary">
      <h3>{team.name}</h3>
      <p>Total Points: {totalPoints}</p>
      <p>Sprint Points (GC Riders): {totalSprintPoints}</p>
      <p>Mountain Points (GC Riders): {totalMountainPoints}</p>
      <Link to={`/my-team/${team.id}`}>View Team</Link>
    </div>
  );
};

export default TeamSummary;
