import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Heading from "../components/Heading";
import "./tenantView.css";

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

    // validation
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
    <div id="mainPage">
      <Heading />

      <h1>Water Update</h1>

      <form onSubmit={handleSubmit} className="formCard">

        <section>
          <h3>Water Meter Entry</h3>

          <input
            name="houseNo"
            placeholder="House Number (e.g. D1)"
            onChange={handleChange}
          />

          <input
            name="meterReading"
            placeholder="Current Meter Reading (e.g. 1100)"
            onChange={handleChange}
          />

          <input
            name="rate"
            placeholder="Rate per unit (e.g. 10)"
            onChange={handleChange}
          />
        </section>

        <button type="submit">
          Continue
        </button>

      </form>
    </div>
  );
};

export default WaterUpdate;