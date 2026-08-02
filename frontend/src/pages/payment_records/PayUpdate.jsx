import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Heading from "../../components/Heading";
import "./PayUpdate.css";

const PayUpdate = () => {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [tenants, setTenants] = useState([]);
  const [searched, setSearched] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const phoneFormat = (phoneNumber) => {

    let formatted = phoneNumber.replace(/\D/g, "");

    if (formatted.startsWith("0")) {
      formatted = "254" + formatted.slice(1);
    }
    else if (formatted.startsWith("7")) {
      formatted = "254" + formatted;
    }
    else if (formatted.startsWith("254")) {
      // already correct
    }
    else {
      return null;
    }

    if (formatted.length !== 12) {
      return null;
    }

    return formatted;
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!phone.trim()) {
      alert("Please enter a phone number.");
      return;
    }

    const formattedPhone = phoneFormat(phone);

    if (!formattedPhone) {
      alert("Please enter a valid Kenyan phone number.");
      return;
    }

    try {

      const res = await fetch(
        `${API_URL}/searchTenant/${formattedPhone}`
      );

      const data = await res.json();

      setTenants(data);
      setSearched(true);

    } catch (err) {

      console.error(err);
      alert("Search failed.");

    }
  };

  return (
    <div className="payUpdatePage">
      <Heading />

      <h1 className="waterTitle">Payment Update</h1>

      <form onSubmit={handleSubmit} className="waterForm">

        <section className="waterSection">

          <h3>Search Tenant</h3>

          <input
            className="waterInput"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

        </section>

        <button
          className="waterButton"
          type="submit"
        >
          Search
        </button>

      </form>

      {searched && tenants.length === 0 && (
        <h3
          style={{
            textAlign: "center",
            color: "blue",
            cursor: "pointer",
            textDecoration: "underline",
          }}
          onClick={() => navigate("/PhoneAdd")}
        >
          No tenant found. Click here to add tenant number.
        </h3>
      )}

      {tenants.length > 0 && (
        <div className="tenantResults">

          <h2>Select Tenant</h2>

          {tenants.map((tenant) => (
            <div
              key={tenant.id}
              className="tenantCard"
              onClick={() =>
                navigate(`/TenantPayUpdate/${tenant.id}`)
              }
            >
              <h3>{tenant.name}</h3>

              <p>House {tenant.houseno}</p>
            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default PayUpdate;