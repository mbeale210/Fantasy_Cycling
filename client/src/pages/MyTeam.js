import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserTeams, updateTeam } from "../store/slices/teamSlice";
import { fetchRiders } from "../store/slices/riderSlice";

const MyTeam = () => {
  const dispatch = useDispatch();
  const { teams } = useSelector((state) => state.teams);
  const { riders } = useSelector((state) => state.riders);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedRider, setSelectedRider] = useState("");

  useEffect(() => {
    dispatch(fetchUserTeams());
    dispatch(fetchRiders());
  }, [dispatch]);

  useEffect(() => {
    if (teams.length > 0 && !selectedTeam) {
      setSelectedTeam(teams[0]);
    }
  }, [teams, selectedTeam]);

  const handleAddRider = () => {
    if (selectedRider && selectedTeam.riders.length < 9) {
      dispatch(
        updateTeam({
          teamId: selectedTeam.id,
          teamData: {
            ...selectedTeam,
            riders: [...selectedTeam.riders, selectedRider],
          },
        })
      );
      setSelectedRider("");
    }
  };

  const handleRemoveRider = (riderId) => {
    dispatch(
      updateTeam({
        teamId: selectedTeam.id,
        teamData: {
          ...selectedTeam,
          riders: selectedTeam.riders.filter((r) => r.id !== riderId),
        },
      })
    );
  };

  if (!selectedTeam) {
    return <div>Loading team...</div>;
  }

  return (
    <div className="my-team">
      <h1>{selectedTeam.name}</h1>
      <p>Total Points: {selectedTeam.sprint_pts + selectedTeam.mountain_pts}</p>

      <h2>Team Riders</h2>
      <ul>
        {selectedTeam.riders.map((rider) => (
          <li key={rider.id}>
            {rider.name} - {rider.team}
            <button onClick={() => handleRemoveRider(rider.id)}>Remove</button>
          </li>
        ))}
      </ul>

      {selectedTeam.riders.length < 9 && (
        <div>
          <h3>Add Rider</h3>
          <select
            value={selectedRider}
            onChange={(e) => setSelectedRider(e.target.value)}
          >
            <option value="">Select a rider</option>
            {riders
              .filter(
                (rider) => !selectedTeam.riders.some((r) => r.id === rider.id)
              )
              .map((rider) => (
                <option key={rider.id} value={rider.id}>
                  {rider.name} - {rider.team}
                </option>
              ))}
          </select>
          <button onClick={handleAddRider}>Add to Team</button>
        </div>
      )}
    </div>
  );
};

export default MyTeam;
