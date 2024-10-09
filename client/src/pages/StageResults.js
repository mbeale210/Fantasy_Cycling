import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStages, fetchStageResults } from "../store/slices/stageSlice";
import RiderResults from "../components/RiderResults";

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
            {stage.is_rest_day ? " (Rest Day)" : ""}
          </option>
        ))}
      </select>

      {selectedStage && currentStageResults.length > 0 ? (
        <RiderResults results={currentStageResults} />
      ) : (
        <p>Select a stage to view results</p>
      )}
    </div>
  );
};

export default StageResults;
