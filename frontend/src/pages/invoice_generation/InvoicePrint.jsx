import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./InvoicePrint.css";

const InvoicePrint = () => {
  const { month } = useParams();

  const [invoices, setInvoices] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;

useEffect(() => {
  fetch(`${API_URL}/month-invoices/${month}`)
    .then(res => res.json())
    .then(data => {
      console.log("DATA:", data);
      setInvoices(data);
    })
    .catch(err => {
      console.error("FETCH ERROR:", err);
    });
}, [month,API_URL]);

  if (invoices.length === 0) {
    return (
      <div className="invoicePage">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="invoicePage">

      {invoices.map((item) => {

        const invoice = item.invoice;
        const charges = item.charges;
        const water = item.water;

        const accountBalance = Number(
          invoice.accountbalance || 0
        );

        const currentCharges =
          charges.reduce(
            (sum, c) =>
              sum + Number(c.chargeamount),
            0
          ) +
          (water
            ? Number(water.bill)
            : 0);

        const totalDue =
          currentCharges +
          accountBalance;

        return (

          <div
            key={invoice.invoiceid}
            className="invoiceCard"
            style={{
              pageBreakAfter: "always"
            }}
          >

            <h1>
              SERENE HOMES APARTMENTS
            </h1>

            <p>
              PO BOX 19967-03400,
              Nairobi
            </p>

            <p>
              Tel: 0745113765
            </p>

            <p>
              Email:
              serenehomes21@gmail.com
            </p>

            <hr />

            <div className="invoiceHeader">

              <div>
                <strong>Tenant</strong>
                <p>{invoice.name}</p>
              </div>

              <div>
                <strong>
                  House Number
                </strong>
                <p>
                  {invoice.houseno}
                </p>
              </div>

              <div>
                <strong>
                  Billing Month
                </strong>

                <p>
                  {new Date(
                    invoice.billingdate
                  ).toLocaleDateString(
                    "en-GB",
                    {
                      month: "long",
                      year: "numeric"
                    }
                  )}
                </p>

              </div>

              <div>

                <strong>
                  Date Issued
                </strong>

                <p>
                  {new Date(
                    invoice.billingdate
                  ).toLocaleDateString(
                    "en-GB"
                  )}
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
                  <th>
                    Amount (KES)
                  </th>
                </tr>

              </thead>

              <tbody>

                {water && (
                  <tr>

                    <td>Water</td>

                    <td>
                      {
                        water.previousreading
                      }
                    </td>

                    <td>
                      {
                        water.currentreading
                      }
                    </td>

                    <td>
                      {water.usage}
                    </td>

                    <td>
                      {water.rate}
                    </td>

                    <td>
                      {Number(
                        water.bill
                      ).toFixed(2)}
                    </td>

                  </tr>
                )}

                {charges.map(c => (

                  <tr
                    key={c.chargeid}
                  >

                    <td>
                      {c.chargetype}
                    </td>

                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>

                    <td>
                      {Number(
                        c.chargeamount
                      ).toFixed(2)}
                    </td>

                  </tr>

                ))}

                <tr className="summaryRow">

                  <td colSpan="5">
                    <strong>
                      Current Charges
                    </strong>
                  </td>

                  <td>
                    <strong>
                      {currentCharges.toFixed(
                        2
                      )}
                    </strong>
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
                        ? accountBalance.toFixed(
                            2
                          )
                        : `-${Math.abs(
                            accountBalance
                          ).toFixed(2)}`}

                    </strong>

                  </td>

                </tr>

                <tr className="totalRow">

                  <td colSpan="5">
                    <strong>
                      Total Due
                    </strong>
                  </td>

                  <td>

                    <strong>
                      {totalDue.toFixed(
                        2
                      )}
                    </strong>

                  </td>

                </tr>

              </tbody>

            </table>

            <br />

            <p>
              <strong>
                Signature:
              </strong>{" "}
              ______________________
            </p>

            <p>
              <strong>
                Paybill:
              </strong>{" "}
              ______________________
            </p>

            <p>
              <strong>
                Account:
              </strong>{" "}
              {invoice.houseno}
            </p>

            <br />

            <small>
              Notice: Kindly notify
              management in writing
              before vacating the
              premises.
            </small>

          </div>
        );
      })}

    </div>
  );
};

export default InvoicePrint;