import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Heading from "../../components/Heading";
import "./ModifyTenant.css";

const ModifyTenant = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [originalData, setOriginalData] = useState(null);

  const [formData, setFormData] = useState({
    tenantId: id,
    name: "",
    phone: "",
    houseNo: "",
    rent: "",
    garbage: ""
  });

  // Load tenant details
  useEffect(() => {
    fetch(`http://localhost:3001/tenant/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const tenant = {
          tenantId: id,
          name: data.name,
          phone: data.phone,
          houseNo: data.houseno,
          rent: data.rent,
          garbage: data.garbage
        };

        setOriginalData(tenant);
        setFormData(tenant);
      })
      .catch((err) => {
        console.error(err);
        alert("Unable to load tenant.");
      });
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.phone ||
      !formData.rent ||
      !formData.garbage
    ) {
      alert("Please complete all fields.");
      return;
    }

    navigate("/ModifyTenantConfirm", {
      state: {
        original: originalData,
        updated: formData
      }
    });
  };

  if (!originalData) {
    return (
      <div className="editTenantPage">
        <Heading />
        <h2
          style={{
            color: "white",
            textAlign: "center",
            marginTop: "100px"
          }}
        >
          Loading tenant...
        </h2>
      </div>
    );
  }

  return (
    <div className="editTenantPage">
      <Heading />

      <h1 className="editTenantTitle">
        Edit Tenant Details
      </h1>

      <form
        className="editTenantForm"
        onSubmit={handleSubmit}
      >
        <section className="editSection">
          <h3>Tenant Information. Only change data you want modified</h3>

          <label>Name</label>

          <input
            className="editInput"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />

          <label>Phone Number</label>

          <input
            className="editInput"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </section>

        <section className="editSection">
          <h3>House Agreement</h3>

          <label>House Number</label>

          <input
            className="editInput houseDisplay"
            value={formData.houseNo}
            readOnly
          />

          <label>Monthly Rent (KES)</label>

          <input
            className="editInput"
            type="number"
            name="rent"
            value={formData.rent}
            onChange={handleChange}
          />

          <label>Monthly Garbage (KES)</label>

          <input
            className="editInput"
            type="number"
            name="garbage"
            value={formData.garbage}
            onChange={handleChange}
          />
        </section>

        <div className="buttonRow">
          <button
            type="button"
            className="cancelButton"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="continueButton"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default ModifyTenant;