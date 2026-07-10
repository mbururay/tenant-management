import { useNavigate } from "react-router-dom";
import Heading from "../../components/Heading";
import "../invoice_generation/InvoiceRecords.css";

const PaymentRecords = () => {
  const navigate = useNavigate();

  return (
    <div className="recordInvoicePage">

      <Heading />

      <div className="recordInvoiceContent">

        <div className="recordInvoiceCard">

          <h1 className="modifyTenantTitle">
            Payment Records
          </h1>

          <h2 className="modifyTenantSubtitle">
            Select your desired action
          </h2>

          <div className="modifyTenantButtonSet">

            <button
              className="modifyTenantButton"
              onClick={() => navigate("/PayUpdate")}
            >
              Update Payments
            </button>

            <button
              className="modifyTenantButton"
              onClick={() => navigate("/PaySearch")}

            >
            Make Payment Corrections

            </button>

            <button
              className="modifyTenantButton"
              onClick={() => navigate("/PaymentView")}

            >
            View Payment Records
            
              
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default PaymentRecords;