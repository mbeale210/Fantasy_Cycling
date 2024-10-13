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
    dispatch(fetchOpenRiders());
  }, [dispatch]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDraft = (rider) => {
    const userTeam = teams[0];

    let newRoster = {
      ...userTeam,
      riders: [...(userTeam.riders || []), rider],
    };

    dispatch(
      updateRoster({
        teamId: userTeam.id,
        rosterData: newRoster,
      })
    )
      .unwrap()
      .then(() => {
        dispatch(fetchOpenRiders());
      })
      .catch((error) => console.error("Failed to update roster", error));
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
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

      <div className="search-container">
        <input
          type="text"
          placeholder="Search riders"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="riders-table">
        <RiderList
          riders={displayRiders}
          onDraft={handleDraft}
          showTeam={false}
        />
      </div>
    </div>
  );
};

export default OpenRiders;
