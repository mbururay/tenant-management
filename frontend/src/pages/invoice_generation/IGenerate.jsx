import Heading from "../../components/Heading";
import { useNavigate } from "react-router-dom";
import "./IGenerate.css";
import { useEffect, useState } from "react";
import { authHeaders } from "../../api";


const IGenerate = () => {
  const [billingMonth, setBillingMonth] = useState("");
  const [tenantCount, setTenantCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;


  useEffect(() => {
    fetch(`${API_URL}/invoice-info`)
      .then(res => res.json())
      .then(data => {
        setBillingMonth(data.billingMonth);
        setTenantCount(data.tenantCount);
      })
      .catch(err => console.error(err));
  }, [API_URL]);

  const genClick = async () => {
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/gen-invoice`, {
        method: "POST",
        headers: authHeaders()
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
<div className="generatePage">
    <Heading />

    <div className = "generateContent">
          <div className="generateCard">

      <h1>Generate Monthly Invoices</h1>

      <p className="subtitle">
        You're about to generate invoices for the next billing cycle.
      </p>

      <div className="summary">

        <div className="summaryItem">
          <span>Billing Month</span>
          <strong>
            {new Date(billingMonth).toLocaleDateString("en-GB", {
              month: "long",
              year: "numeric"
            })}
          </strong>
        </div>

        <div className="summaryItem">
          <span>Active Tenants</span>
          <strong>{tenantCount}</strong>
        </div>

      </div>

      <div className="warning">
        This action will create invoices for all active tenants who have
        not yet been billed for this month.
      </div>

      <div className="buttonRow">

        <button
          className="cancelBtn"
          onClick={() => navigate(-1)}
        >
          Cancel
        </button>

        <button
          className="generateBtn"
          onClick={genClick}
          disabled={loading}
        >
          {loading
            ? "Generating..."
            : "Generate Invoices"}
        </button>

      </div>

    </div>

    </div>



  </div>
);
};

export default IGenerate;