import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Heading from "../components/Heading";
import "./PayUpdate.css";

const PayUpdate = () => {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [tenants, setTenants] = useState([]);
  const [searched, setSearched] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phone) {
      alert("Please enter a phone number.");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3001/searchTenant/${phone}`
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
            placeholder="Phone Number (2547XXXXXXXX)"
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
        <h3 style={{ textAlign: "center" }}>
          No tenant found.
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

              <p>
                House {tenant.houseno}
              </p>

            </div>

          ))}

        </div>

      )}

    </div>
  );
};

export default PayUpdate;