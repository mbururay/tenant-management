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
    fetch(`${API_URL}/invoice-info`, {
      headers: authHeaders()
    })
      .then(res => res.json())
      .then(data => {
        setTenantCount(data.tenantCount);
      })
      .catch(err => console.error(err));
  }, [API_URL]);

  const formatBillingMonth = (month) => {
    if (!month) {
      return "Select billing month";
    }

    const [year, monthNumber] = month.split("-");

    const date = new Date(
      Number(year),
      Number(monthNumber) - 1,
      1
    );

    return date.toLocaleDateString("en-GB", {
      month: "long",
      year: "numeric"
    });
  };

  const genClick = async () => {

    if (!billingMonth) {
      alert("Please select a billing month.");
      return;
    }

    setLoading(true);

    try {

      const res = await fetch(`${API_URL}/gen-invoice`, {
        method: "POST",
        headers: {
          ...authHeaders(),
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          billingMonth
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || data.message || "Failed to generate invoices.");
        return;
      }

      alert(data.message);

      navigate("/InvoiceList");

    } catch (err) {

      console.error(err);
      alert("Failed to generate invoices.");

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="generatePage">

      <Heading />

      <div className="generateContent">

        <div className="generateCard">

          <h1>
            Generate Monthly Invoices
          </h1>

          <p className="subtitle">
            Select the billing month for these invoices.
          </p>

          <div className="billingMonthSection">

            <label>
              Billing Month
            </label>

            <input
              type="month"
              value={billingMonth}
              onChange={(e) =>
                setBillingMonth(e.target.value)
              }
            />

          </div>

          <div className="summary">

            <div className="summaryItem">

              <span>
                Billing Month
              </span>

              <strong>
                {formatBillingMonth(billingMonth)}
              </strong>

            </div>

            <div className="summaryItem">

              <span>
                Active Tenants
              </span>

              <strong>
                {tenantCount}
              </strong>

            </div>

          </div>

          <div className="warning">

            This action will create invoices for all active
            tenants who have not yet been billed for the
            selected month.

          </div>

          <div className="buttonRow">

            <button
              className="cancelBtn"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              className="generateBtn"
              onClick={genClick}
              disabled={loading || !billingMonth}
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