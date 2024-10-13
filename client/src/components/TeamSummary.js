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
      <h3 className="team-name">{team.name}</h3>
      <div className="points-summary">
        <p>
          Total Points: <span className="points">{totalPoints}</span>
        </p>
        <p>
          Sprint Points (GC Riders):{" "}
          <span className="points">{totalSprintPoints}</span>
        </p>
        <p>
          Mountain Points (GC Riders):{" "}
          <span className="points">{totalMountainPoints}</span>
        </p>
      </div>
      <Link to={`/my-team/${team.id}`} className="view-team-link">
        <button className="btn">View Team</button>
      </Link>
    </div>
  );
};

export default TeamSummary;
