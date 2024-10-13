import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchUserTeams,
  updateTeamName,
  removeRiderFromTeam,
  swapRiderRole, // Import the new swap action
} from "../store/slices/teamSlice";

const MyTeam = () => {
  const { teamId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { teams, loading } = useSelector((state) => state.teams);
  const team = teams.find((t) => t.id.toString() === teamId);

  const [newTeamName, setNewTeamName] = useState(team ? team.name : "");

  useEffect(() => {
    dispatch(fetchUserTeams());
  }, [dispatch]);

  useEffect(() => {
    if (teams.length > 0 && !teamId) {
      navigate(`/my-team/${teams[0].id}`);
    }
  }, [teams, navigate, teamId]);

  const handleTeamNameChange = (e) => {
    setNewTeamName(e.target.value);
  };

  const handleUpdateTeamName = () => {
    dispatch(updateTeamName({ teamId: team.id, newName: newTeamName }));
  };

  const handleRemoveRider = (riderId) => {
    dispatch(removeRiderFromTeam({ teamId: team.id, riderId }));
  };

  const handleSwapRider = (riderId) => {
    dispatch(swapRiderRole({ teamId: team.id, riderId }));
  };

  if (loading) return <div>Loading team...</div>;
  if (!team) return <div>Team not found</div>;

  const activeGcRider = team.riders.find((rider) => rider.is_gc) || {};
  const activeDomestiques = team.riders.filter((rider) => !rider.is_gc);

  return (
    <div className="my-team">
      <h1>
        <input
          type="text"
          value={newTeamName}
          onChange={handleTeamNameChange}
        />
        <button onClick={handleUpdateTeamName}>Update Team Name</button>
      </h1>
      <p>Total Points: {team.sprint_pts + team.mountain_pts}</p>

      <h2>GC Riders</h2>
      <div>
        <h3>Active GC Rider</h3>
        {activeGcRider.name ? (
          <p>
            <button onClick={() => handleSwapRider(activeGcRider.id)}>
              Swap
            </button>
            {activeGcRider.name}
            <button onClick={() => handleRemoveRider(activeGcRider.id)}>
              Remove
            </button>
          </p>
        ) : (
          <p>No active GC rider</p>
        )}
      </div>

      <h2>Domestiques</h2>
      <div>
        <h3>Active Domestiques</h3>
        {activeDomestiques.length > 0 ? (
          activeDomestiques.map((rider) => (
            <p key={rider.id}>
              <button onClick={() => handleSwapRider(rider.id)}>Swap</button>
              {rider.name}
              <button onClick={() => handleRemoveRider(rider.id)}>
                Remove
              </button>
            </p>
          ))
        ) : (
          <p>No active domestiques</p>
        )}
      </div>
    </div>
  );
};

export default MyTeam;
