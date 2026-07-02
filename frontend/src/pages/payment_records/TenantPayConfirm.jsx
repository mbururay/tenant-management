import { useLocation, useNavigate } from "react-router-dom";
import "./TenantPayConfirm.css";

const TenantPayConfirm = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <div>
        <h2>No payment information found.</h2>

        <button onClick={() => navigate("/PayUpdate")}>
          Go Back
        </button>
      </div>
    );
  }

  const submitToBackend = async () => {
    try {
      const res = await fetch("http://localhost:3001/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(state)
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
        return;
      }

      alert("Payment recorded successfully!");

      setTimeout(() => {
        navigate("/PayUpdate");
      }, 300);

    } catch (err) {
      console.error(err);
      alert("Failed to record payment.");
    }
  };

  return (
    <div className="confirmPage">

      <div className="confirmCard">

        <h2>Confirm Payment</h2>

        <div className="confirmRow">
          <span>Tenant ID</span>
          <span>{state.tenantId}</span>
        </div>

        <div className="confirmRow">
          <span>Payment Method</span>
          <span>{state.paymentMethod}</span>
        </div>

        <div className="confirmRow">
          <span>Amount</span>
          <span>KES {Number(state.payAmount).toFixed(2)}</span>
        </div>

        <div className="confirmRow">
          <span>Confirmation Code</span>
          <span>{state.confirmationCode}</span>
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
          >
            Confirm Payment
          </button>

        </div>

      </div>

    </div>
  );
};

export default TenantPayConfirm;