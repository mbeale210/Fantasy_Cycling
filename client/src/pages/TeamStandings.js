import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserTeams } from "../store/slices/teamSlice";

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
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Team Name</th>
            <th>Total Points</th>
            <th>Sprint Points</th>
            <th>Mountain Points</th>
          </tr>
        </thead>
        <tbody>
          {sortedTeams.map((team, index) => (
            <tr key={team.id}>
              <td>{index + 1}</td>
              <td>{team.name}</td>
              <td>{team.sprint_pts + team.mountain_pts}</td>
              <td>{team.sprint_pts}</td>
              <td>{team.mountain_pts}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeamStandings;
