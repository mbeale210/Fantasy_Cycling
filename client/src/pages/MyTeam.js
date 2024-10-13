import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchUserTeams } from "../store/slices/teamSlice";

const MyTeam = () => {
  const { teamId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { teams, loading } = useSelector((state) => state.teams);
  const team = teams.find((t) => t.id.toString() === teamId);

  useEffect(() => {
    dispatch(fetchUserTeams());
  }, [dispatch]);

  useEffect(() => {
    if (teams.length > 0 && !teamId) {
      navigate(`/my-team/${teams[0].id}`);
    }
  }, [teams, navigate, teamId]);

  if (loading) return <div>Loading team...</div>;
  if (!team) return <div>Team not found</div>;

  const activeGcRider = team.riders.find((rider) => rider.is_gc) || {};
  const activeDomestiques = team.riders.filter((rider) => !rider.is_gc);

  return (
    <div className="my-team">
      <h1>{team.name}</h1>
      <p>Total Points: {team.sprint_pts + team.mountain_pts}</p>

      <h2>GC Riders</h2>
      <div>
        <h3>Active GC Rider</h3>
        {activeGcRider.name ? (
          <p>{activeGcRider.name}</p>
        ) : (
          <p>No active GC rider</p>
        )}
      </div>

      <h2>Domestiques</h2>
      <div>
        <h3>Active Domestiques</h3>
        {activeDomestiques.length > 0 ? (
          activeDomestiques.map((rider) => <p key={rider.id}>{rider.name}</p>)
        ) : (
          <p>No active domestiques</p>
        )}
      </div>
    </div>
  );
};

export default MyTeam;
