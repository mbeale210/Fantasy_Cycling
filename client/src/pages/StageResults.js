import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStages, fetchStageResults } from "../store/slices/stageSlice";

const StageResults = () => {
  const dispatch = useDispatch();
  const { stages, currentStageResults, loading } = useSelector(
    (state) => state.stages
  );
  const [selectedStage, setSelectedStage] = useState("");

  useEffect(() => {
    dispatch(fetchStages());
  }, [dispatch]);

  useEffect(() => {
    if (selectedStage) {
      dispatch(fetchStageResults(selectedStage));
    }
  }, [dispatch, selectedStage]);

  const handleStageChange = (e) => {
    setSelectedStage(e.target.value);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="stage-results">
      <h1>Stage Results</h1>
      <select value={selectedStage} onChange={handleStageChange}>
        <option value="">Select a stage</option>
        {stages.map((stage) => (
          <option key={stage.id} value={stage.id}>
            Stage {stage.number}: {stage.type} -{" "}
            {new Date(stage.date).toLocaleDateString()}
          </option>
        ))}
      </select>

      {selectedStage && currentStageResults.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Position</th>
              <th>Rider</th>
              <th>Team</th>
              <th>Time</th>
              <th>Sprint Points</th>
              <th>Mountain Points</th>
            </tr>
          </thead>
          <tbody>
            {currentStageResults.map((result, index) => (
              <tr key={result.id}>
                <td>{index + 1}</td>
                <td>{result.rider_name}</td>
                <td>{result.team}</td>
                <td>
                  {new Date(result.time * 1000).toISOString().substr(11, 8)}
                </td>
                <td>{result.sprint_pts}</td>
                <td>{result.mountain_pts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Select a stage to view results</p>
      )}
    </div>
  );
};

export default StageResults;
