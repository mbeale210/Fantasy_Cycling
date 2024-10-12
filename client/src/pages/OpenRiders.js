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
    const userTeam = teams[0];

    if (userTeam && userTeam.trades_left > 0) {
      let newRoster = {};

      if (rider.role === "gc") {
        newRoster = {
          ...userTeam,
          active_gc_rider: rider,
        };
      } else if (rider.role === "domestique") {
        newRoster = {
          ...userTeam,
          active_domestiques: [...(userTeam.active_domestiques || []), rider],
        };
      } else {
        alert("Rider role is not supported for drafting.");
        return;
      }

      dispatch(
        updateRoster({
          teamId: userTeam.id,
          rosterData: newRoster,
        })
      );
    } else {
      alert("You don't have any trades left or you don't have a team yet.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const displayRiders = searchTerm
    ? riders.filter(
        (rider) =>
          rider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          rider.team.toLowerCase().includes(searchTerm.toLowerCase())
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
