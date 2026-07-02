import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Heading from "../../components/Heading";
import "./InvoiceSearch.css";

const InvoiceSearch = () => {

  const navigate = useNavigate();

  const [name, setHouseNo] = useState("");
  const [invoices, setInvoices] = useState([]);
  const [searched, setSearched] = useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter a house number.");
      return;
    }

    try {

      const res = await fetch(
        `http://localhost:3001/searchInvoiceByName/${encodeURIComponent(name)}`
      );

      const data = await res.json();

      setInvoices(data);
      setSearched(true);

    } catch (err) {

      console.error(err);
      alert("Search failed.");

    }

  };

const formatMonth = (date) => {
    if (!date) return "No Month";

    return new Date(date).toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric"
    });
};

  return (

    <div className="payUpdatePage">

      <Heading />

      <h1 className="waterTitle">
        Create Invoice Correction
      </h1>

      <form
        onSubmit={handleSubmit}
        className="waterForm"
      >

        <section className="waterSection">

          <h3>Search Name</h3>

          <input
            className="waterInput"
            placeholder="Name(e.g. Mercy Wasteman)"
            value={name}
            onChange={(e) => setHouseNo(e.target.value)}
          />

        </section>

        <button
          className="waterButton"
          type="submit"
        >
          Search
        </button>

      </form>

      {searched && invoices.length === 0 && (

        <h3
          style={{
            textAlign: "center",
            marginTop: "25px",
            color: "white"
          }}
        >
          No invoices found.
        </h3>

      )}

      {invoices.length > 0 && (

        <div className="waterResults">

          <h2 className="waterResultsTitle">
            Select Invoice
          </h2>

          {invoices.map((invoice) => (

            <div
              key={invoice.invoiceId}
              className="waterCard"
              onClick={() =>
                navigate(`/ICorrect/${invoice.invoiceId}`)
              }
            >

              <div className="waterCardLeft">

                <h3>{invoice.houseNo}</h3>

                <p>{invoice.tenant}</p>

              </div>

              <div className="waterCardMiddle">

                <p>
                  Invoice #: {invoice.invoiceId}
                </p>

                <p>
                Total: KES{" "}
                {invoice.totalAmount != null
                    ? Number(invoice.totalAmount).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })
                    : "0.00"}
                </p>
            </div>

              <div className="waterCardRight">

                <p className="waterMonth">
                    {formatMonth(invoice.billingDate)}
                </p>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  );

};

export default InvoiceSearch;