import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Heading from "../../components/Heading";
import "./SearchWater.css";

const SearchWater = () => {
  const navigate = useNavigate();

  const [houseNo, setHouseNo] = useState("");
  const [houses, setHouses] = useState([]);
  const [searched, setSearched] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!houseNo.trim()) {
      alert("Please enter a house number.");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3001/searchWaterByHouse/${encodeURIComponent(houseNo)}`
      );

      const data = await res.json();

      setHouses(data);
      setSearched(true);
    } catch (err) {
      console.error(err);
      alert("Search failed.");
    }
  };

  // SAFE DATE FORMATTER
  const formatMonth = (date) => {
    if (!date) return "No Month";

    const d = new Date(date);

    if (isNaN(d.getTime())) return "No Month";

    return d.toLocaleDateString("en-GB", {
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="payUpdatePage">
      <Heading />

      <h1 className="waterTitle">Edit Water Reading</h1>

      {/* SEARCH FORM */}
      <form onSubmit={handleSubmit} className="waterForm">
        <section className="waterSection">
          <h3>Search House</h3>

          <input
            className="waterInput"
            placeholder="House Number (e.g. 67A)"
            value={houseNo}
            onChange={(e) => setHouseNo(e.target.value)}
          />
        </section>

        <button className="waterButton" type="submit">
          Search
        </button>
      </form>

      {/* NO RESULTS */}
      {searched && houses.length === 0 && (
        <h3
          style={{
            textAlign: "center",
            marginTop: "25px",
            color: "white",
          }}
        >
          No water records found.
        </h3>
      )}

      {/* RESULTS */}
      {houses.length > 0 && (
        <div className="waterResults">
          <h2 className="waterResultsTitle">Select Water Record</h2>

          {houses.map((house) => (
            <div
              key={house.id || house.houseId}
              className="waterCard"
              onClick={() => navigate(`/WaterModify/${house.id || house.houseId}`)}
            >
              {/* LEFT */}
              <div className="waterCardLeft">
                <h3>{house.houseNo}</h3>
                <p>{house.tenant}</p>
              </div>

              {/* MIDDLE */}
              <div className="waterCardMiddle">
                <p>Previous: {house.previousReading}</p>

                <p>
                  Current:{" "}
                  <span style={{ fontWeight: "bold" }}>
                    {house.currentReading ?? "Not set"}
                  </span>
                </p>
              </div>

              {/* RIGHT */}
              <div className="waterCardRight">
                <p className="waterMonth">
                  {formatMonth(house.readingmonth || house.readingMonth)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchWater;