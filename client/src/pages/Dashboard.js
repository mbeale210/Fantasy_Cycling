import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchUserTeams, fetchTeamPoints } from "../store/slices/teamSlice";
import { fetchStages } from "../store/slices/stageSlice";
import TeamSummary from "../components/TeamSummary";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const {
    teams,
    loading: teamsLoading,
    teamPoints,
  } = useSelector((state) => state.teams);
  const { stages, loading: stagesLoading } = useSelector(
    (state) => state.stages
  );

  const [totalSprintPoints, setTotalSprintPoints] = useState(0);
  const [totalMountainPoints, setTotalMountainPoints] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    dispatch(fetchUserTeams());
    dispatch(fetchStages());
  }, [dispatch]);

  useEffect(() => {
    if (teams.length > 0) {
      dispatch(fetchTeamPoints());
    }
  }, [teams, dispatch]);

  useEffect(() => {
    if (teamPoints) {
      setTotalSprintPoints(teamPoints.totalSprintPoints);
      setTotalMountainPoints(teamPoints.totalMountainPoints);
      setTotalPoints(
        teamPoints.totalSprintPoints + teamPoints.totalMountainPoints
      );
    }
  }, [teamPoints]);

  if (teamsLoading || stagesLoading) return <div>Loading...</div>;

  return (
    <div className="dashboard">
      <h1>Welcome, {user?.username}!</h1>

      <section className="my-teams">
        <h2>My Teams</h2>
        {teams.length > 0 ? (
          teams.map((team) => (
            <TeamSummary key={team.id} team={team} teamPoints={teamPoints} />
          ))
        ) : (
          <p>
            You haven't created any teams yet.{" "}
            <Link to="/create-team">Create a team</Link>
          </p>
        )}
      </section>

      <section className="team-points">
        <h2>Team Points</h2>
        <table>
          <tbody>
            <tr>
              <td>Sprint Points (GC Riders):</td>
              <td>{totalSprintPoints}</td>
            </tr>
            <tr>
              <td>Mountain Points (GC Riders):</td>
              <td>{totalMountainPoints}</td>
            </tr>
            <tr>
              <td>Total Points:</td>
              <td>{totalPoints}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="upcoming-stages">
        <h2>Upcoming Stages</h2>
        {stages.length > 0 ? (
          <ul>
            {stages.slice(0, 3).map((stage) => (
              <li key={stage.id}>
                Stage {stage.number}: {stage.type} -{" "}
                {new Date(stage.date).toLocaleDateString()}
                {stage.is_rest_day && <span> (Rest Day)</span>}
              </li>
            ))}
          </ul>
        ) : (
          <p>No upcoming stages.</p>
        )}
      </section>

      <section className="quick-links">
        <h2>Quick Links</h2>
        <ul>
          <li>
            <Link to="/">View All Riders</Link>
          </li>
          <li>
            <Link to="/results">Latest Results</Link>
          </li>
          <li>
            <Link to="/standings">Team Standings</Link>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default Dashboard;
