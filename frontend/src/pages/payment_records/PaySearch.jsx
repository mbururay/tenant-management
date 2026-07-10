import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Heading from "../../components/Heading";
import "../invoice_generation/InvoiceSearch.css";

const PaySearch = () => {

    const navigate = useNavigate();

    const [name, setName] = useState("");

    const [payments, setPayments] = useState([]);

    const [searched, setSearched] = useState(false);

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!name.trim()) {

            alert("Please enter a name.");
            return;

        }

        try {

            const res = await fetch(
                `http://localhost:3001/searchPaymentByName/${encodeURIComponent(name)}`
            );

            const data = await res.json();

            setPayments(data);

            setSearched(true);

        }
        catch (err) {

            console.error(err);

            alert("Search failed.");

        }

    };

    return (

        <div className="payUpdatePage">

            <Heading />

            <h1 className="waterTitle">
                Create Payment Correction
            </h1>

            <form
                onSubmit={handleSubmit}
                className="waterForm"
            >

                <section className="waterSection">

                    <h3>Search Tenant</h3>

                    <input
                        className="waterInput"
                        placeholder="Name (e.g. Mercy Wasteman)"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                </section>

                <button
                    className="waterButton"
                    type="submit"
                >
                    Search
                </button>

            </form>

            {searched && payments.length === 0 && (

                <h3
                    style={{
                        textAlign: "center",
                        marginTop: "25px",
                        color: "white"
                    }}
                >
                    No payments found.
                </h3>

            )}

            {payments.length > 0 && (

                <div className="waterResults">

                    <h2 className="waterResultsTitle">
                        Select Payment
                    </h2>

                    {payments.map((payment) => (

                        <div
                            key={payment.payid}
                            className="waterCard"
                            onClick={() =>
                                navigate(`/PayCorrections/${payment.payid}`)
                            }
                        >

                            <div className="waterCardLeft">

                                <h3>{payment.name}</h3>

                                <p>
                                    Payment #{payment.payid}
                                </p>

                            </div>

                            <div className="waterCardMiddle">

                                <p>
                                    KES{" "}
                                    {Number(payment.payamount).toLocaleString(
                                        undefined,
                                        {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        }
                                    )}
                                </p>

                                <p>
                                    Code:{" "}
                                    {payment.confirmationcode || "N/A"}
                                </p>

                            </div>

                            <div className="waterCardRight">

                                <p>
                                    {payment.paymentmethod || "No Method"}
                                </p>

                                <p>
                                    {new Date(
                                        payment.paydate
                                    ).toLocaleDateString("en-GB")}
                                </p>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

};

export default PaySearch;