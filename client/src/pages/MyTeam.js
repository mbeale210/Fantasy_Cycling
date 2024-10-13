import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchUserTeams,
  updateTeamName,
  removeRiderFromTeam,
  swapRiderRole,
  deleteTeam,
  fetchTeamPoints,
} from "../store/slices/teamSlice";

const MyTeam = () => {
  const { teamId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { teams, loading, teamPoints } = useSelector((state) => state.teams);
  const team = teams.find((t) => t.id.toString() === teamId);

  const [newTeamName, setNewTeamName] = useState(team ? team.name : "");
  const [isEditing, setIsEditing] = useState(false); // Track whether team name is being edited
  const [message, setMessage] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [totalSprintPoints, setTotalSprintPoints] = useState(0);
  const [totalMountainPoints, setTotalMountainPoints] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    dispatch(fetchUserTeams());
  }, [dispatch]);

  useEffect(() => {
    if (teams.length > 0 && !teamId) {
      navigate(`/my-team/${teams[0].id}`);
    }
  }, [teams, navigate, teamId]);

  useEffect(() => {
    if (team) {
      dispatch(fetchTeamPoints());
    }
  }, [team, dispatch]);

  useEffect(() => {
    if (teamPoints) {
      setTotalSprintPoints(teamPoints.totalSprintPoints);
      setTotalMountainPoints(teamPoints.totalMountainPoints);
      setTotalPoints(
        teamPoints.totalSprintPoints + teamPoints.totalMountainPoints
      );
    }
  }, [teamPoints]);

  const handleTeamNameChange = (e) => {
    setNewTeamName(e.target.value);
  };

  const handleUpdateTeamName = () => {
    dispatch(updateTeamName({ teamId: team.id, newName: newTeamName }));
    setIsEditing(false); // Close editing form after submission
  };

  const handleRemoveRider = (riderId) => {
    dispatch(removeRiderFromTeam({ teamId: team.id, riderId }))
      .unwrap()
      .then(() => {
        setMessage("Rider removed successfully");
        dispatch(fetchUserTeams()); // Fetch teams again to update the UI dynamically
      })
      .catch(() => setMessage("Failed to remove rider"));
  };

  const handleSwapRider = (riderId) => {
    dispatch(swapRiderRole({ teamId: team.id, riderId }))
      .unwrap()
      .then(() => {
        setMessage("Rider role swapped successfully");
        dispatch(fetchUserTeams()); // Fetch teams again to update the UI dynamically
      })
      .catch(() => setMessage("Failed to swap rider role"));
  };

  const handleDeleteTeam = () => {
    dispatch(deleteTeam(teamId))
      .unwrap()
      .then(() => {
        setMessage("Team deleted successfully");
        navigate("/dashboard");
      })
      .catch(() => setMessage("Failed to delete team"));
  };

  if (loading) return <div>Loading team...</div>;
  if (!team) return <div>Team not found</div>;

  const gcRiders = team.riders.filter((rider) => rider.is_gc);
  const domestiques = team.riders.filter((rider) => !rider.is_gc);

  return (
    <div className="my-team">
      {message && <div className="message">{message}</div>}

      {/* Team Name Section */}
      <h1 className="team-name">
        {!isEditing ? (
          <>
            {newTeamName}
            <button
              className="change-team-name-btn"
              onClick={() => setIsEditing(true)}
            >
              Change Team Name
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              value={newTeamName}
              onChange={handleTeamNameChange}
              style={{ fontSize: "1.5em", fontWeight: "bold" }}
            />
            <div>
              <button onClick={handleUpdateTeamName}>Update Team Name</button>
              <button onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </>
        )}
      </h1>

      {/* Team Points Section */}
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

      {/* GC Riders */}
      <h2 style={{ fontSize: "1.45em" }}>GC Riders</h2>
      <div>
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

      {/* Domestiques */}
      <h2 style={{ fontSize: "1.45em" }}>Domestiques</h2>
      <div>
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
                  <td>Domestique</td>
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

      {/* Delete Team Section */}
      {showDeleteConfirmation ? (
        <div className="delete-confirmation">
          <p>Are you sure you want to delete this team?</p>
          <button onClick={handleDeleteTeam}>Yes</button>
          <button onClick={() => setShowDeleteConfirmation(false)}>
            Cancel
          </button>
        </div>
      ) : (
        <button onClick={() => setShowDeleteConfirmation(true)}>
          Delete Team
        </button>
      )}
    </div>
  );
};

export default MyTeam;
