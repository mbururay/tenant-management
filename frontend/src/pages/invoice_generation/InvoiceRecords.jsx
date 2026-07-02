import { useNavigate } from "react-router-dom";
import Heading from "../../components/Heading";
import "./InvoiceRecords.css";

const InvoiceRecords = () => {
  const navigate = useNavigate();

  return (
    <div className="recordInvoicePage">

      <Heading />

      <div className="recordInvoiceContent">

        <div className="recordInvoiceCard">

          <h1 className="modifyTenantTitle">
            Invoice Records
          </h1>

          <h2 className="modifyTenantSubtitle">
            Select your desired action
          </h2>

          <div className="modifyTenantButtonSet">

            <button
              className="modifyTenantButton"
              onClick={() => navigate("/IGenerate")}
            >
              Generate Monthly Invoices
            </button>

            <button
              className="modifyTenantButton"
              onClick={() => navigate("/InvoiceSearch")}
            >
              Create Invoice Correction
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default InvoiceRecords;