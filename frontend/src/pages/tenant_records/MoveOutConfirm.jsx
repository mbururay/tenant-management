import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./MoveOutConfirm.css";

const MoveOutConfirm = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (!state) {
    return (
      <div className="confirmPage">
        <h2>No Tenant data found</h2>
        <button onClick={() => navigate("/MoveOutTenant")}>
          Go back
        </button>
      </div>
    );
  }

  

  const submitToBackend = async () => {
    setLoading(true);

  const API_URL = import.meta.env.VITE_API_URL;

    try {
      await fetch(`${API_URL}/remove-tenant`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state)
      });

      alert("Tenant Move Out recorded!");

      navigate("/MoveOutTenant", { replace: true });

    } catch (err) {
      alert("Error submitting tenant data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="confirmPage">
      <div className="confirmCard">

        <h2>Confirm Tenant Entry</h2>

        <div className="row">
          <span>House</span>
          <span>{state.houseNo}</span>
        </div>

        <div className="row">
          <span>Move Out Date</span>
          <span>{state.moveOut || "Auto-fetched"}</span>
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

export default MoveOutConfirm;