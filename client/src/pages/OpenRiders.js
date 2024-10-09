import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRiders } from "../store/slices/riderSlice";
import { updateTeam } from "../store/slices/teamSlice";

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
    const allTeamRiders = teams.flatMap((team) =>
      team.riders.map((rider) => rider.id)
    );
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
    if (userTeam && userTeam.riders.length < 9) {
      dispatch(
        updateTeam({
          teamId: userTeam.id,
          teamData: { ...userTeam, riders: [...userTeam.riders, rider] },
        })
      );
    } else {
      alert(
        "You can't add more riders to your team or you don't have a team yet."
      );
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
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Team</th>
            <th>Sprint Points</th>
            <th>Mountain Points</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {displayRiders.map((rider) => (
            <tr key={rider.id}>
              <td>{rider.name}</td>
              <td>{rider.team}</td>
              <td>{rider.sprint_pts}</td>
              <td>{rider.mountain_pts}</td>
              <td>
                <button onClick={() => handleDraft(rider)}>Draft</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OpenRiders;
