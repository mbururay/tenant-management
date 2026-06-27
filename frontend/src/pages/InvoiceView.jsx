import Heading from "../components/Heading";
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
      .catch(err => console.error(err));
  }, [id]);

  if (!invoice) {
    return (
      <div className="invoicePage">
        <Heading />
        <h2>Loading invoice...</h2>
      </div>
    );
  }

  const totalCharges = charges.reduce(
    (sum, c) => sum + Number(c.chargeamount),
    0
  );

  const waterBill = water ? Number(water.bill) : 0;

  const total = totalCharges + waterBill;

  return (
    <div className="invoicePage">
      <Heading />

      <div className="invoiceCard">

        <h1>Invoice #{id}</h1>

        <div className="invoiceInfo">

          <div>
            <strong>Tenant</strong>
            <p>{invoice.name}</p>
          </div>

          <div>
            <strong>House</strong>
            <p>{invoice.houseno}</p>
          </div>

          <div>
            <strong>Billing Date</strong>
            <p>
              {new Date(invoice.billingdate).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

        </div>

        <h2>Charges</h2>

        <table className="invoiceTable">
          <thead>
            <tr>
              <th>Charge Type</th>
              <th>Amount (KES)</th>
            </tr>
          </thead>

          <tbody>
            {charges.map((c) => (
              <tr key={c.chargeid}>
                <td>{c.chargetype}</td>
                <td>KES {Number(c.chargeamount).toFixed(2)}</td>
              </tr>
            ))}

            {water && (
              <tr>
                <td>Water</td>
                <td>KES {Number(water.bill).toFixed(2)}</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="invoiceTotal">
          <span>Total Due</span>
          <span>KES {total.toFixed(2)}</span>
        </div>

      </div>
    </div>
  );
};

export default InvoiceView;