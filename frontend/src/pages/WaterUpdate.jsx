import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Heading from "../components/Heading";
import "./WaterUpdate.css";

const WaterUpdate = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    houseNo: "",
    meterReading: "",
    rate: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.houseNo || !formData.meterReading || !formData.rate) {
      alert("All fields are required");
      return;
    }

    if (Number(formData.rate) < 0) {
      alert("Rate cannot be negative");
      return;
    }

    navigate("/WaterConfirm", {
      state: {
        houseNo: formData.houseNo,
        currentReading: formData.meterReading,
        rate: formData.rate
      }
    });
  };

  return (
    <div className="waterPage">
      <Heading />

      <h1 className="waterTitle">Water Update</h1>

      <form onSubmit={handleSubmit} className="waterForm">

        <section className="waterSection">

          <h3>Water Meter Entry</h3>

          <input
            className="waterInput"
            name="houseNo"
            placeholder="House Number (e.g. D1)"
            onChange={handleChange}
          />

          <input
            className="waterInput"
            name="meterReading"
            placeholder="Current Meter Reading"
            onChange={handleChange}
          />

          <input
            className="waterInput"
            name="rate"
            placeholder="Rate per Unit"
            onChange={handleChange}
          />

        </section>

        <button
          className="waterButton"
          type="submit"
        >
          Continue
        </button>

      </form>
    </div>
  );
};

export default WaterUpdate;