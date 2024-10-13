import React, { useEffect } from "react";
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

  useEffect(() => {
    dispatch(fetchUserTeams());
    dispatch(fetchStages());
  }, [dispatch]);

  useEffect(() => {
    if (teams.length > 0) {
      dispatch(fetchTeamPoints());
    }
  }, [teams, dispatch]);

  if (teamsLoading || stagesLoading)
    return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">
      <h1 className="team-name">Welcome, {user?.username}!</h1>

      <section className="team-points">
        <h2>My Teams</h2>
        <div className="teams-container">
          {teams.length > 0 ? (
            teams.map((team) => (
              <TeamSummary key={team.id} team={team} teamPoints={teamPoints} />
            ))
          ) : (
            <div className="create-team-prompt">
              <p>You haven't created any teams yet.</p>
              <Link to="/create-team">
                <button className="btn">Create a team</button>
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="upcoming-stages">
        <h2>Upcoming Stages</h2>
        <div className="stages-container">
          {stages.length > 0 ? (
            <ul className="stages-list">
              {stages.slice(0, 3).map((stage) => (
                <li key={stage.id} className="stage-item">
                  <div className="stage-info">
                    Stage {stage.number}: {stage.type} -{" "}
                    {new Date(stage.date).toLocaleDateString()}
                    {stage.is_rest_day && (
                      <span className="rest-day"> (Rest Day)</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-stages">No upcoming stages.</p>
          )}
        </div>
      </section>

      <section className="quick-links">
        <h2>Quick Links</h2>
        <div className="links-container">
          <ul className="links-list">
            <li>
              <Link to="/">
                <button className="btn">View All Riders</button>
              </Link>
            </li>
            <li>
              <Link to="/results">
                <button className="btn">Latest Results</button>
              </Link>
            </li>
            <li>
              <Link to="/standings">
                <button className="btn">Team Standings</button>
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
