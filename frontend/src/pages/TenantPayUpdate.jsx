import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Heading from "../components/Heading";
import "./TenantPayUpdate.css";

const TenantPayUpdate = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
  tenantId: id,
  paymentMethod: "",
  payAmount: "",
  confirmationCode: ""
});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
        !formData.paymentMethod ||
        !formData.payAmount ||
        !formData.confirmationCode
    ) {
      alert("All fields are required.");
      return;
    }

    if (Number(formData.payAmount) <= 0) {
      alert("Payment amount must be greater than zero.");
      return;
    }

    navigate("/TenantPayConfirm", {
        state: {
            tenantId: formData.tenantId,
            paymentMethod: formData.paymentMethod,
            payAmount: formData.payAmount,
            confirmationCode: formData.confirmationCode
        }
    });
  };

  return (
    <div className="tenantPayUpdatePage">
      <Heading />

      <h1 className="tenantTitle">
        Tenant Payment Update
      </h1>

      <form
        onSubmit={handleSubmit}
        className="tenantPayForm"
      >

        <section className="tenantPaySection">

          <h3>Payment Details</h3>

          <label>Payment Method</label>

        <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className="tenantPayInput"
            >
            <option value="">Select Payment Method</option>
            <option value="NBK Bank Transfer">NBK Bank Transfer</option>
            <option value="SC Bank Transfer">SC Bank Transfer</option>
        </select>

        

          <label>Payment Amount (KES)</label>

          <input
            className="tenantPayInput"
            type="number"
            name="payAmount"
            placeholder="Amount Received"
            value={formData.payAmount}
            onChange={handleChange}
          />

          <label>Confirmation Code</label>

          <input
            className="tenantPayInput"
            type="text"
            name="confirmationCode"
            placeholder="Confirmation Code"
            value={formData.confirmationCode}
            onChange={handleChange}
            />

        </section>

        <button
          className="tenantPayButton"
          type="submit"
        >
          Continue
        </button>

      </form>
    </div>
  );
};

export default TenantPayUpdate;