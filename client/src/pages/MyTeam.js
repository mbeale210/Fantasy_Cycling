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
  const [isEditing, setIsEditing] = useState(false);
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
    setIsEditing(false);
  };

  const handleRemoveRider = (riderId) => {
    dispatch(removeRiderFromTeam({ teamId: team.id, riderId }))
      .unwrap()
      .then(() => {
        setMessage("Rider removed successfully");
        dispatch(fetchUserTeams());
      })
      .catch(() => setMessage("Failed to remove rider"));
  };

  const handleSwapRider = (riderId) => {
    dispatch(swapRiderRole({ teamId: team.id, riderId }))
      .unwrap()
      .then(() => {
        setMessage("Rider role swapped successfully");
        dispatch(fetchUserTeams());
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

  if (loading) return <div className="loading">Loading team...</div>;
  if (!team) return <div className="error">Team not found</div>;

  const gcRiders = team.riders.filter((rider) => rider.is_gc);
  const domestiques = team.riders.filter((rider) => !rider.is_gc);

  return (
    <div className="my-team">
      {message && <div className="message">{message}</div>}

      <div className="team-name-section">
        {!isEditing ? (
          <>
            <h1 className="team-name">{newTeamName}</h1>
            <button className="btn" onClick={() => setIsEditing(true)}>
              Change Team Name
            </button>
          </>
        ) : (
          <div className="edit-team-name">
            <input
              type="text"
              value={newTeamName}
              onChange={handleTeamNameChange}
              className="team-name-input"
            />
            <div className="button-group">
              <button className="btn" onClick={handleUpdateTeamName}>
                Update Team Name
              </button>
              <button className="btn" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

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

      <section className="gc-section">
        <h2>GC Riders</h2>
        <div className="riders-table">
          {gcRiders.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Rider Name</th>
                  <th>Role</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>
                {gcRiders.map((rider) => (
                  <tr key={rider.id}>
                    <td>
                      <button
                        className="btn"
                        onClick={() => handleSwapRider(rider.id)}
                      >
                        Swap
                      </button>
                    </td>
                    <td>{rider.name}</td>
                    <td>GC Rider</td>
                    <td>
                      <button
                        className="btn"
                        onClick={() => handleRemoveRider(rider.id)}
                      >
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
      </section>

      <section className="domestiques-section">
        <h2>Domestiques</h2>
        <div className="riders-table">
          {domestiques.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Rider Name</th>
                  <th>Role</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>
                {domestiques.map((rider) => (
                  <tr key={rider.id}>
                    <td>
                      <button
                        className="btn"
                        onClick={() => handleSwapRider(rider.id)}
                      >
                        Swap
                      </button>
                    </td>
                    <td>{rider.name}</td>
                    <td>Domestique</td>
                    <td>
                      <button
                        className="btn"
                        onClick={() => handleRemoveRider(rider.id)}
                      >
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
      </section>

      {showDeleteConfirmation ? (
        <div className="delete-confirmation">
          <p>Are you sure you want to delete this team?</p>
          <button className="btn delete-team-btn" onClick={handleDeleteTeam}>
            Yes
          </button>
          <button
            className="btn"
            onClick={() => setShowDeleteConfirmation(false)}
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          className="btn delete-team-btn"
          onClick={() => setShowDeleteConfirmation(true)}
        >
          Delete Team
        </button>
      )}
    </div>
  );
};

export default MyTeam;
