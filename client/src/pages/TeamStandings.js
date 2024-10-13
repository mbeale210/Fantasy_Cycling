import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserTeams } from "../store/slices/teamSlice";
import {
  fetchStages,
  fetchSummativeStageResults,
} from "../store/slices/stageSlice";
import TeamSummary from "../components/TeamSummary";

// Helper function to format time
const formatTime = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

const TeamStandings = () => {
  const dispatch = useDispatch();
  const { teams, loading: teamsLoading } = useSelector((state) => state.teams);
  const {
    stages,
    currentSummativeStageResults,
    loading: stagesLoading,
  } = useSelector((state) => state.stages);
  const [selectedStage, setSelectedStage] = useState("");

  useEffect(() => {
    dispatch(fetchUserTeams());
    dispatch(fetchStages());
  }, [dispatch]);

  useEffect(() => {
    if (selectedStage) {
      dispatch(fetchSummativeStageResults(selectedStage));
    }
  }, [dispatch, selectedStage]);

  const handleStageChange = (e) => {
    setSelectedStage(e.target.value);
  };

  if (teamsLoading || stagesLoading) {
    return <div>Loading...</div>;
  }

  // Sort results by cumulative time (shortest to longest)
  const sortedGCResults = [...currentSummativeStageResults].sort(
    (a, b) => a.total_time - b.total_time
  );

  return (
    <div className="team-standings">
      <h1>Team Standings</h1>

      <div>
        <select value={selectedStage} onChange={handleStageChange}>
          <option value="">Select a stage</option>
          {stages.map((stage) => (
            <option key={stage.id} value={stage.number}>
              Stage {stage.number}: {stage.type} -{" "}
              {new Date(stage.date).toLocaleDateString()}
              {stage.is_rest_day ? " (Rest Day)" : ""}
            </option>
          ))}
        </select>
      </div>

      {selectedStage && sortedGCResults.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Position</th>
              <th>Team</th>
              <th>Total Time</th>
              <th>Total Sprint Points</th>
              <th>Total Mountain Points</th>
            </tr>
          </thead>
          <tbody>
            {sortedGCResults.map((result, index) => (
              <tr key={result.rider_id}>
                <td>{index + 1}</td>
                <td>{result.team}</td>
                <td>{formatTime(result.total_time)}</td>
                <td>{result.total_sprint_pts}</td>
                <td>{result.total_mountain_pts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Select a stage to view GC riders on teams</p>
      )}

      {/* Current team standings */}
      <h2>Current Team Standings</h2>
      {teams.map((team, index) => (
        <div key={team.id}>
          <h2>Rank: {index + 1}</h2>
          <TeamSummary team={team} />
        </div>
      ))}
    </div>
  );
};

export default TeamStandings;
