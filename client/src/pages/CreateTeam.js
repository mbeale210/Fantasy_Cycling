import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createTeam } from "../store/slices/teamSlice";
import { useNavigate } from "react-router-dom";

const CreateTeam = () => {
  const [teamName, setTeamName] = useState("");
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCreateTeam = () => {
    if (!teamName.trim()) {
      setMessage("Team name cannot be empty");
      return;
    }

    dispatch(createTeam({ name: teamName }))
      .unwrap()
      .then(() => {
        setMessage("Team created successfully");
        navigate("/riders"); // Automatically route to the OpenRiders page
      })
      .catch(() => setMessage("Failed to create team"));
  };

  return (
    <div className="create-team">
      <h1>Create a New Team</h1>
      {message && <div className="message">{message}</div>}
      <input
        type="text"
        placeholder="Enter team name"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
      />
      <button onClick={handleCreateTeam}>Create Team</button>
    </div>
  );
};

export default CreateTeam;
