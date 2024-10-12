import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchUserTeams, updateRoster } from "../store/slices/teamSlice";

const MyTeam = () => {
  const { teamId } = useParams();
  const dispatch = useDispatch();
  const { teams, loading } = useSelector((state) => state.teams);
  const team = teams.find((t) => t.id.toString() === teamId);

  useEffect(() => {
    dispatch(fetchUserTeams());
  }, [dispatch]);

  const handleRosterUpdate = (updatedRoster) => {
    dispatch(updateRoster({ teamId: team.id, rosterData: updatedRoster }));
  };

  if (loading) return <div>Loading team...</div>;
  if (!team) return <div>Team not found</div>;

  return (
    <div className="my-team">
      <h1>{team.name}</h1>
      <p>Total Points: {team.sprint_pts + team.mountain_pts}</p>
      <p>Trades Left: {team.trades_left}</p>

      <h2>GC Riders</h2>
      <div>
        <h3>Active GC Rider</h3>
        {team.active_gc_rider ? (
          <p>{team.active_gc_rider.name}</p>
        ) : (
          <p>No active GC rider</p>
        )}
      </div>
      <div>
        <h3>Bench GC Riders</h3>
        {team.bench_gc_riders.map((rider) => (
          <p key={rider.id}>{rider.name}</p>
        ))}
      </div>

      <h2>Domestiques</h2>
      <div>
        <h3>Active Domestiques</h3>
        {team.active_domestiques.map((rider) => (
          <p key={rider.id}>{rider.name}</p>
        ))}
      </div>
      <div>
        <h3>Bench Domestiques</h3>
        {team.bench_domestiques.map((rider) => (
          <p key={rider.id}>{rider.name}</p>
        ))}
      </div>

      {/* Add UI elements for updating roster */}
    </div>
  );
};

export default MyTeam;
