import { useLocation, useNavigate } from "react-router-dom";
import "./TenantConfirm.css"

const TenantConfirm = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <div>
        <h2>No data found</h2>
        <button onClick={() => navigate("/add-tenant")}>
          Go back
        </button>
      </div>
    );
  }

  const submitToBackend = async () => {
    await fetch("http://localhost:3001/add-tenant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state)
    });

    alert("Tenant created!");

    setTimeout(() => {
        navigate("/AddTenant");
    }, 300);
  };

  return (
    <div className="confirmPage">
  <div className="confirmCard">
    <h2>Confirm Tenant Details</h2>

    <div className="confirmRow">
      <span>Name</span>
      <span>{state.name}</span>
    </div>

    <div className="confirmRow">
      <span>Phone</span>
      <span>{state.phone}</span>
    </div>

    <div className="confirmRow">
      <span>House</span>
      <span>{state.houseNo}</span>
    </div>

    <div className="confirmRow">
      <span>Rent</span>
      <span>KES {state.rent}</span>
    </div>

    <div className="confirmRow">
      <span>Garbage</span>
      <span>KES {state.garbage}</span>
    </div>

    <div className="confirmRow">
      <span>Deposit</span>
      <span>KES {state.deposit}</span>
    </div>

    <div className="buttonRow">
        <button className="editBtn" onClick={() => navigate("/AddTenant")}>
            Edit
        </button>

        <button className="confirmBtn" onClick={submitToBackend}>
            Confirm
  </button>
</div>
  </div>
</div>
  );
};

export default TenantConfirm;