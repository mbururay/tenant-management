import Heading from "../../components/Heading";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./InvoiceList.css";

const InvoiceList = () => {

    const [months, setMonths] = useState([]);

    const navigate = useNavigate();

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {

        fetch(
            `${API_URL}/invoice-months`
        )
            .then(res => res.json())
            .then(data => {
                setMonths(data);
            })
            .catch(err => console.error(err));

    }, [API_URL]);

    const formatMonth = (monthString) => {

        const [year, month] =
            monthString.split("-");

        return new Date(
            Number(year),
            Number(month) - 1
        ).toLocaleDateString(
            "en-GB",
            {
                month: "long",
                year: "numeric"
            }
        );

    };

    return (

        <div className="invoiceListPage">

            <Heading />

            <h1 className="invoiceListTitle">

                Invoice Dashboard

            </h1>

            <div className="invoiceMonthGrid">

                {months.map(month => (

                    <div
                        key={month.month}
                        className="invoiceMonthCard"
                    >

                        <h2>

                            {formatMonth(
                                month.month
                            )}

                        </h2>

                        <div className="monthStats">

                            <p>

                                <strong>
                                    Invoices:
                                </strong>{" "}

                                {
                                    month.invoicecount
                                }

                            </p>

                            <p>

                                <strong>
                                    Total Billed:
                                </strong>{" "}

                                KES{" "}

                                {Number(
                                    month.totalbilled
                                ).toLocaleString(
                                    undefined,
                                    {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    }
                                )}

                            </p>

                        </div>

                        <div className="monthButtons">

                            <button
                                className="invoiceOpenButton"
                                onClick={() =>
                                    navigate(
                                        `/invoiceMonth/${month.month}`
                                    )
                                }
                            >

                                View Invoices

                            </button>

                            <button
                                className="downloadPdfBtn"
                                onClick={async () => {

                                    try {

                                        const token =
                                            localStorage.getItem(
                                                "token"
                                            );

                                        const res =
                                            await fetch(
                                                `${API_URL}/invoice-pdf/${month.month}`,
                                                {
                                                    headers: {
                                                        Authorization:
                                                            `Bearer ${token}`
                                                    }
                                                }
                                            );

                                        const blob =
                                            await res.blob();

                                        const url =
                                            window.URL.createObjectURL(
                                                blob
                                            );

                                        window.open(
                                            url,
                                            "_blank"
                                        );

                                    }
                                    catch (err) {

                                        console.error(err);

                                        alert(
                                            "Unable to generate PDF"
                                        );

                                    }

                                }}
                            
                            >

                                Download PDF

                            </button>

                        </div>

                    </div>

                ))}

            </div>

        </div>

    );

};

export default InvoiceList;