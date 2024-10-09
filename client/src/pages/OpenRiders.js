import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRiders } from "../store/slices/riderSlice";
import { updateRoster } from "../store/slices/teamSlice";
import RiderList from "../components/RiderList";

const OpenRiders = () => {
  const dispatch = useDispatch();
  const { riders, loading } = useSelector((state) => state.riders);
  const { teams } = useSelector((state) => state.teams);
  const [filteredRiders, setFilteredRiders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchRiders());
  }, [dispatch]);

  useEffect(() => {
    const allTeamRiders = teams
      .flatMap((team) => [
        team.active_gc_rider,
        ...team.active_domestiques,
        ...team.bench_gc_riders,
        ...team.bench_domestiques,
      ])
      .map((rider) => rider.id);
    setFilteredRiders(
      riders.filter((rider) => !allTeamRiders.includes(rider.id))
    );
  }, [riders, teams]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDraft = (rider) => {
    // Assuming the user has only one team for simplicity
    const userTeam = teams[0];
    if (userTeam && userTeam.trades_left > 0) {
      const totalRiders = [
        userTeam.active_gc_rider,
        ...userTeam.active_domestiques,
        ...userTeam.bench_gc_riders,
        ...userTeam.bench_domestiques,
      ].length;

      if (totalRiders < 9) {
        let newRoster = {
          active_gc_rider: userTeam.active_gc_rider
            ? [userTeam.active_gc_rider.id]
            : [],
          active_domestiques: userTeam.active_domestiques.map((r) => r.id),
          bench_gc_riders: userTeam.bench_gc_riders.map((r) => r.id),
          bench_domestiques: userTeam.bench_domestiques.map((r) => r.id),
        };

        if (rider.is_gc) {
          if (newRoster.active_gc_rider.length === 0) {
            newRoster.active_gc_rider = [rider.id];
          } else if (newRoster.bench_gc_riders.length < 2) {
            newRoster.bench_gc_riders.push(rider.id);
          } else {
            alert("You can't add more GC riders to your team.");
            return;
          }
        } else {
          if (newRoster.active_domestiques.length < 4) {
            newRoster.active_domestiques.push(rider.id);
          } else if (newRoster.bench_domestiques.length < 2) {
            newRoster.bench_domestiques.push(rider.id);
          } else {
            alert("You can't add more domestique riders to your team.");
            return;
          }
        }

        dispatch(
          updateRoster({
            teamId: userTeam.id,
            rosterData: newRoster,
          })
        );
      } else {
        alert(
          "Your team is full. You need to remove a rider before adding a new one."
        );
      }
    } else {
      alert("You don't have any trades left or you don't have a team yet.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const displayRiders = searchTerm
    ? filteredRiders.filter(
        (rider) =>
          rider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          rider.team.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : filteredRiders;

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
