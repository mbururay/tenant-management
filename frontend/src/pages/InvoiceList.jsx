import Heading from "../components/Heading";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./InvoiceList.css";

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3001/invoices")
      .then(res => res.json())
      .then(data => setInvoices(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="invoiceListPage">
      <Heading />

      <h1 className="invoiceListTitle">
        All Invoices
      </h1>

      <table className="invoiceListTable">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tenant</th>
            <th>House</th>
            <th>Date</th>
            <th>Total</th>
            <th>Status</th>
            <th>View</th>
          </tr>
        </thead>

        <tbody>
          {invoices.map((inv) => (
            <tr key={inv.invoiceid}>
              <td>{inv.invoiceid}</td>
              <td>{inv.name}</td>
              <td>{inv.houseno}</td>
              <td>{new Date(inv.billingdate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })}</td>

              <td>
                KES {Number(inv.total || 0).toFixed(2)}
              </td>

              <td>
                <span
                  className={`invoiceStatus ${
                    inv.paid ? "paid" : "unpaid"
                  }`}
                >
                  {inv.paid ? "PAID" : "UNPAID"}
                </span>
              </td>

              <td>
                <button
                  className="invoiceOpenButton"
                  onClick={() =>
                    navigate(`/invoiceView/${inv.invoiceid}`)
                  }
                >
                  Open
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceList;