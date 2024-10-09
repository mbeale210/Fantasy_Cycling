import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchUserTeams, updateRoster } from "../store/slices/teamSlice";
import GCRiders from "../components/GCRiders";
import Domestiques from "../components/Domestiques";

const MyTeam = () => {
  const { teamId } = useParams();
  const dispatch = useDispatch();
  const { teams } = useSelector((state) => state.teams);
  const [team, setTeam] = useState(null);

  useEffect(() => {
    dispatch(fetchUserTeams());
  }, [dispatch]);

  useEffect(() => {
    const currentTeam = teams.find((t) => t.id.toString() === teamId);
    if (currentTeam) {
      setTeam(currentTeam);
    }
  }, [teams, teamId]);

  const handleActivateGC = (rider) => {
    const updatedTeam = {
      ...team,
      active_gc_rider: rider,
      bench_gc_riders: team.bench_gc_riders.filter((r) => r.id !== rider.id),
    };
    dispatch(updateRoster({ teamId: team.id, rosterData: updatedTeam }));
  };

  const handleBenchGC = (rider) => {
    const updatedTeam = {
      ...team,
      active_gc_rider: null,
      bench_gc_riders: [...team.bench_gc_riders, rider],
    };
    dispatch(updateRoster({ teamId: team.id, rosterData: updatedTeam }));
  };

  const handleActivateDomestique = (rider) => {
    const updatedTeam = {
      ...team,
      active_domestiques: [...team.active_domestiques, rider],
      bench_domestiques: team.bench_domestiques.filter(
        (r) => r.id !== rider.id
      ),
    };
    dispatch(updateRoster({ teamId: team.id, rosterData: updatedTeam }));
  };

  const handleBenchDomestique = (rider) => {
    const updatedTeam = {
      ...team,
      active_domestiques: team.active_domestiques.filter(
        (r) => r.id !== rider.id
      ),
      bench_domestiques: [...team.bench_domestiques, rider],
    };
    dispatch(updateRoster({ teamId: team.id, rosterData: updatedTeam }));
  };

  if (!team) {
    return <div>Loading team...</div>;
  }

  return (
    <div className="my-team">
      <h1>{team.name}</h1>
      <p>Total Points: {team.sprint_pts + team.mountain_pts}</p>
      <p>Trades Left: {team.trades_left}</p>

      <GCRiders
        activeRider={team.active_gc_rider}
        benchRiders={team.bench_gc_riders}
        onActivate={handleActivateGC}
        onBench={handleBenchGC}
      />

      <Domestiques
        activeRiders={team.active_domestiques}
        benchRiders={team.bench_domestiques}
        onActivate={handleActivateDomestique}
        onBench={handleBenchDomestique}
      />
    </div>
  );
};

export default MyTeam;
