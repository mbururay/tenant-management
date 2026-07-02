import Heading from "../../components/Heading";
import { useNavigate } from "react-router-dom";
import "./IGenerate.css";
import { useEffect, useState } from "react";

const IGenerate = () => {
  const [billingMonth, setBillingMonth] = useState("");
  const [tenantCount, setTenantCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3001/invoice-info")
      .then(res => res.json())
      .then(data => {
        setBillingMonth(data.billingMonth);
        setTenantCount(data.tenantCount);
      })
      .catch(err => console.error(err));
  }, []);

  const genClick = async () => {
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/gen-invoice", {
        method: "POST",
      });

      const data = await res.json();

      alert(data.message);
    } catch (err) {
      console.error(err);
      alert("Failed to generate invoices.");
    } finally {
      setLoading(false);
    }

    navigate("/InvoiceList")

    
  };

  return (
    <div id="mainPage">
      <Heading />

      <h1>Billing Month
        {new Date(billingMonth).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </h1>

      <h2>There are {tenantCount} active tenants</h2>

      <button onClick={genClick} disabled={loading}>
        {loading
          ? "Generating..."
          : `Generate all ${tenantCount} Invoices`}
      </button>
    </div>
  );
};

export default IGenerate;