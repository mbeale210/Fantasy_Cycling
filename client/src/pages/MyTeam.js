import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchUserTeams,
  updateTeamName,
  removeRiderFromTeam,
  swapRiderRole,
} from "../store/slices/teamSlice";

const MyTeam = () => {
  const { teamId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { teams, loading } = useSelector((state) => state.teams);
  const team = teams.find((t) => t.id.toString() === teamId);

  const [newTeamName, setNewTeamName] = useState(team ? team.name : "");
  const [message, setMessage] = useState(""); // To show success/failure messages

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
    dispatch(removeRiderFromTeam({ teamId: team.id, riderId }))
      .unwrap()
      .then(() => setMessage("Rider removed successfully"))
      .catch(() => setMessage("Failed to remove rider"));
  };

  const handleSwapRider = (riderId) => {
    dispatch(swapRiderRole({ teamId: team.id, riderId }))
      .unwrap()
      .then(() => setMessage("Rider role swapped successfully"))
      .catch(() => setMessage("Failed to swap rider role"));
  };

  if (loading) return <div>Loading team...</div>;
  if (!team) return <div>Team not found</div>;

  const gcRiders = team.riders.filter((rider) => rider.is_gc);
  const domestiques = team.riders.filter((rider) => !rider.is_gc);

  return (
    <div className="my-team">
      {message && <div className="message">{message}</div>}
      <h1>
        <input
          type="text"
          value={newTeamName}
          onChange={handleTeamNameChange}
        />
        <button onClick={handleUpdateTeamName}>Update Team Name</button>
      </h1>
      <p>Total Points: {team.sprint_pts + team.mountain_pts}</p>

      {/* GC Riders Section */}
      <h2>GC Riders</h2>
      <div>
        <h3>Active GC Rider</h3>
        {gcRiders.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Action</th>
                <th>Rider Name</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {gcRiders.map((rider) => (
                <tr key={rider.id}>
                  <td>
                    <button onClick={() => handleSwapRider(rider.id)}>
                      Swap
                    </button>
                  </td>
                  <td>{rider.name}</td>
                  <td>GC Rider</td>
                  <td>
                    <button onClick={() => handleRemoveRider(rider.id)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No active GC rider</p>
        )}
      </div>

      {/* Domestiques Section */}
      <h2>Domestiques</h2>
      <div>
        <h3>Active Domestiques</h3>
        {domestiques.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Action</th>
                <th>Rider Name</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {domestiques.map((rider) => (
                <tr key={rider.id}>
                  <td>
                    <button onClick={() => handleSwapRider(rider.id)}>
                      Swap
                    </button>
                  </td>
                  <td>{rider.name}</td>
                  {/* Conditionally render "Domestique" or "GC Rider" based on is_gc */}
                  <td>{rider.is_gc ? "GC Rider" : "Domestique"}</td>
                  <td>
                    <button onClick={() => handleRemoveRider(rider.id)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No active domestiques</p>
        )}
      </div>
    </div>
  );
};

export default MyTeam;
