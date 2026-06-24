import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./WaterConfirm.css";

const WaterConfirm = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (!state) {
    return (
      <div className="confirmPage">
        <h2>No water data found</h2>
        <button onClick={() => navigate("/water-update")}>
          Go back
        </button>
      </div>
    );
  }

  const usage =
    Number(state.currentReading) - Number(state.previousReading || 0);

  const bill = usage * Number(state.rate);

  const submitToBackend = async () => {
    setLoading(true);

    try {
      await fetch("http://localhost:3001/add-water", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state)
      });

      alert("Water bill recorded!");

      navigate("/WaterUpdate");

    } catch (err) {
      alert("Error submitting water data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="confirmPage">
      <div className="confirmCard">

        <h2>Confirm Water Entry</h2>

        <div className="row">
          <span>House</span>
          <span>{state.houseNo}</span>
        </div>

        <div className="row">
          <span>Previous Reading</span>
          <span>{state.previousReading || "Auto-fetched"}</span>
        </div>

        <div className="row">
          <span>Current Reading</span>
          <span>{state.currentReading}</span>
        </div>

        <div className="row">
          <span>Usage</span>
          <span>{usage}</span>
        </div>

        <div className="row highlight">
          <span>Total Bill</span>
          <span>KES {bill}</span>
        </div>

        <div className="buttonRow">
          <button
            className="editBtn"
            onClick={() => navigate(-1)}
          >
            Edit
          </button>

          <button
            className="confirmBtn"
            onClick={submitToBackend}
            disabled={loading}
          >
            {loading ? "Saving..." : "Confirm"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default WaterConfirm;