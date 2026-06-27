import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Heading from "../components/Heading";
import "./AddTenant.css";

const AddTenant = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    houseNo: "",
    rent: "",
    garbage: "",
    deposit: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.phone.length !== 12) {
      alert("Phone must be 12 digits");
      return;
    }

    if (!formData.name || !formData.houseNo) {
      alert("Name and House Number required");
      return;
    }

    navigate("/TenantConfirm", { state: formData });
  };

  return (
    <div className="addTenantPage">
      <Heading />

      <h1>Add New Tenant</h1>

      <form onSubmit={handleSubmit} className="formCard">

        <section>
          <h3>Tenant Info</h3>

          <input name="name" placeholder="Name" onChange={handleChange} />
          <input name="phone" placeholder="Phone" onChange={handleChange} />
          <input name="houseNo" placeholder="House" onChange={handleChange} />
        </section>

        <section>
          <h3>Decided Rent and Garbage</h3>

          <input name="rent" type="number" placeholder="Rent" onChange={handleChange} />
          <input name="garbage" type="number" placeholder="Garbage" onChange={handleChange} />
        </section>

        <section>
          <h3>Initial Deposit</h3>

          <input name="deposit" type="number" placeholder="Deposit" onChange={handleChange} />
        </section>

        <button type="submit">Continue</button>

      </form>
    </div>
  );
};

export default AddTenant;