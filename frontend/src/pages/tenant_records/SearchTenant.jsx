import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Heading from "../../components/Heading";
import "./SearchTenant.css";

const SearchTenant = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [tenants, setTenants] = useState([]);
  const [searched, setSearched] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter a tenant name.");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3001/searchTenantByName/${encodeURIComponent(name)}`
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

      <h1 className="waterTitle">Edit Tenant Information</h1>

      <form
        onSubmit={handleSubmit}
        className="waterForm"
      >

        <section className="waterSection">

          <h3>Search Tenant Name</h3>

          <input
            className="waterInput"
            placeholder="Tenant Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            marginTop: "25px"
          }}
        >
          No tenants found.
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
                navigate(`/ModifyTenant/${tenant.id}`)
              }
            >

              <h3>{tenant.name}</h3>

              <p>House {tenant.houseno}</p>

              <p>{tenant.phone}</p>

            </div>

          ))}

        </div>

      )}

    </div>
  );
};

export default SearchTenant;