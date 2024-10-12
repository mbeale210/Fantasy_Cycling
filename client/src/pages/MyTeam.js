import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchUserTeams } from "../store/slices/teamSlice";

const MyTeam = () => {
  const { teamId } = useParams();
  const dispatch = useDispatch();
  const { teams, loading } = useSelector((state) => state.teams);
  const team = teams.find((t) => t.id.toString() === teamId);

  useEffect(() => {
    dispatch(fetchUserTeams());
  }, [dispatch]);

  if (loading) return <div>Loading team...</div>;
  if (!team) return <div>Team not found</div>;

  const activeGcRider = team.active_gc_rider || {};
  const activeDomestiques = team.active_domestiques || [];
  const benchDomestiques = team.bench_domestiques || [];
  const benchGcRiders = team.bench_gc_riders || [];

  return (
    <div className="my-team">
      <h1>{team.name}</h1>
      <p>Total Points: {team.sprint_pts + team.mountain_pts}</p>
      <p>Trades Left: {team.trades_left}</p>

      <h2>GC Riders</h2>
      <div>
        <h3>Active GC Rider</h3>
        {activeGcRider.name ? (
          <p>{activeGcRider.name}</p>
        ) : (
          <p>No active GC rider</p>
        )}
      </div>
      <div>
        <h3>Bench GC Riders</h3>
        {benchGcRiders.length > 0 ? (
          benchGcRiders.map((rider) => <p key={rider.id}>{rider.name}</p>)
        ) : (
          <p>No bench GC riders</p>
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
      <div>
        <h3>Bench Domestiques</h3>
        {benchDomestiques.length > 0 ? (
          benchDomestiques.map((rider) => <p key={rider.id}>{rider.name}</p>)
        ) : (
          <p>No bench domestiques</p>
        )}
      </div>
    </div>
  );
};

export default MyTeam;
