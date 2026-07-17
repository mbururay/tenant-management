import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Heading from "../../components/Heading"
import "./MoveOutTenant.css"

const MoveOutTenant = () => {
    const navigate = useNavigate();

  const [formData, setFormData] = useState({
    houseNo: "",
    moveOut: "",

  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
     console.log("SUBMIT CLICKED");
    console.log(formData);

    // validation
    if (!formData.houseNo || !formData.moveOut) {
      alert("All fields are required");
      return;
    }

    navigate("/MoveOutConfirm", {
    state: {
      houseNo: formData.houseNo,
      moveOut: formData.moveOut
    }
    });
};

  return (
    <div id="mainPage">
      <Heading />

      <h1>Move Out Tenant</h1>

      <form onSubmit={handleSubmit} className="formCard">

        <section>
          <h3>Tenant Info Entry</h3>

          <input
            name="houseNo"
            placeholder="House Number (e.g. D1)"
            onChange={handleChange}
          />

          <input
            type="date"
            name="moveOut"
            onChange={handleChange}
            required
            />

        </section>

        <button type="submit">
          Continue
        </button>

      </form>
    </div>
  );
}

export default MoveOutTenant;