import { useLocation, useNavigate } from "react-router-dom";
import Heading from "../../components/Heading";
import "./WaterModifyConfirm.css";
import { authHeaders } from "../../api";

const WaterModifyConfirm = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const API_URL = import.meta.env.VITE_API_URL;

  if (!state || !state.original || !state.updated) {
    return (
      <div className="confirmPage">
        <Heading />
        <h2 style={{ color: "white", textAlign: "center", marginTop: "100px" }}>
          No data found. Please go back and try again.
        </h2>
      </div>
    );
  }

  const { original, updated } = state;

  const prev = Number(original.previousReading);
  const curr = Number(updated.currentReading);
  const rate = 150;

  const usage = curr - prev;
  const bill = usage * rate;

  const handleConfirm = async () => {
    try {
      const res = await fetch(`${API_URL}/edit-water`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({
          id: original.id,
          houseId: original.houseId,
          currentReading: curr,
          rate: rate
        })
      });

      const data = await res.json();

      if (data.success) {
        alert("Water record updated successfully!");
        navigate("/WaterRecords");
      } else {
        alert(data.error || "Update failed");
      }

    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="confirmPage">
      <Heading />

      <h1 className="confirmTitle">Confirm Water Update</h1>

      <div className="confirmCard">

        <h2>{original.houseNo}</h2>
        <p>{original.tenant}</p>

        <div className="confirmGrid">

          <div>
            <p>Previous Reading</p>
            <h3>{prev}</h3>
          </div>

          <div>
            <p>Current Reading</p>
            <h3>{curr}</h3>
          </div>

          <div>
            <p>Usage</p>
            <h3>{usage}</h3>
          </div>

          <div>
            <p>Rate</p>
            <h3>{rate}</h3>
          </div>

          <div>
            <p>Bill</p>
            <h2>KES {bill.toFixed(2)}</h2>
          </div>

        </div>

        <button className="confirmButton" onClick={handleConfirm}>
          Confirm Update
        </button>

      </div>
    </div>
  );
};

export default WaterModifyConfirm;