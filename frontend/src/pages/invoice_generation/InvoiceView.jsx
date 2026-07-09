import Heading from "../../components/Heading";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./InvoiceView.css";

const InvoiceView = () => {
  const { id } = useParams();

  const [invoice, setInvoice] = useState(null);
  const [charges, setCharges] = useState([]);
  const [water, setWater] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/invoice/${id}`)
      .then(res => res.json())
      .then(data => {
        setInvoice(data.invoice);
        setCharges(data.charges);
        setWater(data.water);
      })
      .catch(console.error);
  }, [id]);

  const printInvoice = () => {
    window.print();
  };



  

  if (!invoice) {
    return (
      <div className="invoicePage">
        <Heading />
        <h2>Loading...</h2>
      </div>
    );
  }

  const accountBalance = Number(invoice.accountbalance || 0);

  const currentCharges = charges.reduce(
    (sum, c) => sum + Number(c.chargeamount),
    0
  ) + (water ? Number(water.bill) : 0);

  const totalDue = currentCharges + accountBalance;

  return (
    <div className="invoicePage invoiceViewPage">
      <Heading />

      <div className="invoiceCard">

        <h1>SERENE HOMES APARTMENTS</h1>

        <p>PO BOX 19967-03400, Nairobi</p>
        <p>Tel: 0745113765</p>
        <p>Email: serenehomes21@gmail.com</p>

        <hr />

        <div className="invoiceHeader">

          <div>
            <strong>Tenant</strong>
            <p>{invoice.name}</p>
          </div>

          <div>
            <strong>House Number</strong>
            <p>{invoice.houseno}</p>
          </div>

          <div>
            <strong>Billing Month</strong>
            <p>
              {new Date(invoice.billingdate).toLocaleDateString("en-GB", {
                month: "long",
                year: "numeric"
              })}
            </p>
          </div>

          <div>
            <strong>Date Issued</strong>
            <p>
              {new Date(invoice.billingdate).toLocaleDateString("en-GB")}
            </p>
          </div>

        </div>

        <table className="invoiceTable">

          <thead>

            <tr>
              <th>Description</th>
              <th>Previous</th>
              <th>Current</th>
              <th>Usage</th>
              <th>Rate</th>
              <th>Amount (KES)</th>
            </tr>

          </thead>

          <tbody>

            {/* WATER */}

            {water && (
              <tr>
                <td>Water</td>
                <td>{water.previousreading}</td>
                <td>{water.currentreading}</td>
                <td>{water.usage}</td>
                <td>{water.rate}</td>
                <td>{Number(water.bill).toFixed(2)}</td>
              </tr>
            )}

            {/* OTHER CHARGES */}

            {charges.map(c => (
              <tr key={c.chargeid}>

                <td>{c.chargetype}</td>

                <td></td>

                <td></td>

                <td></td>

                <td></td>

                <td>{Number(c.chargeamount).toFixed(2)}</td>

              </tr>
            ))}

            {/* SUMMARY */}

            <tr className="summaryRow">
              <td colSpan="5">
                <strong>Current Charges</strong>
              </td>

              <td>
                <strong>{currentCharges.toFixed(2)}</strong>
              </td>
            </tr>

            <tr className="summaryRow">
              <td colSpan="5">

                <strong>
                  {accountBalance >= 0
                    ? "Balance Brought Forward"
                    : "Account Credit"}
                </strong>

              </td>

              <td>

                <strong>

                  {accountBalance >= 0
                    ? accountBalance.toFixed(2)
                    : `-${Math.abs(accountBalance).toFixed(2)}`}

                </strong>

              </td>
            </tr>

            <tr className="totalRow">

              
              <td>
                <strong>{totalDue.toFixed(2)}</strong>
              </td>

            </tr>

          </tbody>

        </table>

        <br />

        <p><strong>Signature:</strong> __________________________</p>

        <p><strong>Paybill:</strong> _____________________________</p>

        <p><strong>Account:</strong> {invoice.houseno}</p>

        <br />

        <small>
          Notice: Kindly notify management in writing before vacating the
          premises. Failure to do so may result in charges being billed to the
          last known tenant.
        </small>


      </div>


      <button onClick={printInvoice}>
          Print Invoice
      </button>

      

    </div>
  );
};

export default InvoiceView;