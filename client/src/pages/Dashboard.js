import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchUserTeams } from "../store/slices/teamSlice";
import { fetchStages } from "../store/slices/stageSlice";
import TeamSummary from "../components/TeamSummary";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { teams, loading: teamsLoading } = useSelector((state) => state.teams);
  const { stages, loading: stagesLoading } = useSelector(
    (state) => state.stages
  );

  useEffect(() => {
    dispatch(fetchUserTeams());
    dispatch(fetchStages());
  }, [dispatch]);

  if (teamsLoading || stagesLoading) return <div>Loading...</div>;

  return (
    <div className="dashboard">
      <h1>Welcome, {user?.username}!</h1>

      <section className="my-teams">
        <h2>My Teams</h2>
        {teams.length > 0 ? (
          teams.map((team) => <TeamSummary key={team.id} team={team} />)
        ) : (
          <p>
            You haven't created any teams yet.{" "}
            <Link to="/create-team">Create a team</Link>
          </p>
        )}
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
            {/* Update the link to point to the Home page */}
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
