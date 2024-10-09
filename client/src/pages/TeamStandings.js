import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserTeams } from "../store/slices/teamSlice";
import TeamSummary from "../components/TeamSummary";

const TeamStandings = () => {
  const dispatch = useDispatch();
  const { teams, loading } = useSelector((state) => state.teams);

  useEffect(() => {
    dispatch(fetchUserTeams());
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Sort teams by total points
  const sortedTeams = [...teams].sort(
    (a, b) => b.sprint_pts + b.mountain_pts - (a.sprint_pts + a.mountain_pts)
  );

  return (
    <div className="team-standings">
      <h1>Team Standings</h1>
      {sortedTeams.map((team, index) => (
        <div key={team.id}>
          <h2>Rank: {index + 1}</h2>
          <TeamSummary team={team} />
        </div>
      ))}
    </div>
  );
};

export default TeamStandings;
