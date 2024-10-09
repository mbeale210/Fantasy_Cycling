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

  const handleRosterUpdate = (updatedRoster) => {
    dispatch(updateRoster({ teamId: team.id, rosterData: updatedRoster }));
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
        onUpdate={handleRosterUpdate}
      />

      <Domestiques
        activeRiders={team.active_domestiques}
        benchRiders={team.bench_domestiques}
        onUpdate={handleRosterUpdate}
      />
    </div>
  );
};

export default MyTeam;
