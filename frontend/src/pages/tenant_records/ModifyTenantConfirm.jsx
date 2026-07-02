import { useLocation, useNavigate } from "react-router-dom";
import "./ModifyTenantConfirm.css";

const ModifyTenantConfirm = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  if (!state) {
    return (
      <div className="confirmPage">
        <h2>No data found.</h2>

        <button onClick={() => navigate("/ModifyTenant")}>
          Go Back
        </button>
      </div>
    );
  }

  const { original, updated } = state;

  const submitChanges = async () => {
    try {
      const res = await fetch("http://localhost:3001/edit-tenant", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updated)
      });

      if (!res.ok) {
        throw new Error("Update failed");
      }

      alert("Tenant updated successfully.");

      navigate(-2);

    } catch (err) {
      console.error(err);
      alert("Failed to update tenant.");
    }
  };

  const rows = [
    {
      label: "Name",
      old: original.name,
      new: updated.name
    },
    {
      label: "Phone",
      old: original.phone,
      new: updated.phone
    },
    {
      label: "Rent",
      old: `KES ${original.rent}`,
      new: `KES ${updated.rent}`
    },
    {
      label: "Garbage",
      old: `KES ${original.garbage}`,
      new: `KES ${updated.garbage}`
    }
  ];

  const changes = rows.filter(
    (row) => row.old !== row.new
  );

  return (
    <div className="confirmPage">

      <div className="confirmCard">

        <h2>Confirm Tenant Changes</h2>

        <div className="confirmRow">
          <span>House</span>
          <span>{updated.houseNo}</span>
        </div>

        <hr />

        {changes.length === 0 ? (

          <h3 style={{ textAlign: "center" }}>
            No changes detected.
          </h3>

        ) : (

          changes.map((change) => (

            <div
              key={change.label}
              className="changeCard"
            >

              <h3>{change.label}</h3>

              <div className="changeValues">

                <div className="oldValue">
                  <small>Current</small>
                  <p>{change.old}</p>
                </div>

                <div className="arrow">
                  →
                </div>

                <div className="newValue">
                  <small>New</small>
                  <p>{change.new}</p>
                </div>

              </div>

            </div>

          ))

        )}

        <div className="buttonRow">

          <button
            className="editBtn"
            onClick={() => navigate(-1)}
          >
            Back
          </button>

          <button
            className="confirmBtn"
            onClick={submitChanges}
            disabled={changes.length === 0}
          >
            Confirm Changes
          </button>

        </div>

      </div>

    </div>
  );
};

export default ModifyTenantConfirm;