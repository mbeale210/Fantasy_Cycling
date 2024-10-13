import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOpenRiders } from "../store/slices/riderSlice";
import { updateRoster } from "../store/slices/teamSlice";
import RiderList from "../components/RiderList";

const OpenRiders = () => {
  const dispatch = useDispatch();
  const { riders, loading } = useSelector((state) => state.riders);
  const { teams } = useSelector((state) => state.teams);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchOpenRiders()); // Fetch only open riders
  }, [dispatch]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDraft = (rider) => {
    const userTeam = teams[0]; // For simplicity, assuming only one team.

    // Remove trade point restrictions and directly update the roster
    let newRoster = {
      ...userTeam,
      riders: [...(userTeam.riders || []), rider], // Add the new rider to the roster
    };

    dispatch(
      updateRoster({
        teamId: userTeam.id,
        rosterData: newRoster,
      })
    )
      .unwrap()
      .then(() => {
        dispatch(fetchOpenRiders()); // Fetch the updated list of open riders after drafting
      })
      .catch((error) => console.error("Failed to update roster", error));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const displayRiders = searchTerm
    ? riders.filter(
        (rider) =>
          rider.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          rider.team?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : riders;

  return (
    <div className="open-riders">
      <h1>Available Riders</h1>
      <input
        type="text"
        placeholder="Search riders or teams"
        value={searchTerm}
        onChange={handleSearch}
      />
      <RiderList riders={displayRiders} onDraft={handleDraft} />
    </div>
  );
};

export default OpenRiders;
