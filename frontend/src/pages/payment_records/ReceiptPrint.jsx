import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./ReceiptPrint.css";

const ReceiptPrint = () => {

    const { paymentId } = useParams();

    const [receipt, setReceipt] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {

        fetch(`http://localhost:3001/receipt/${paymentId}`)
            .then(res => res.json())
            .then(data => {
                setReceipt(data);
            })
            .catch(console.error);

    }, [paymentId]);

    const handlePrint = () => {
        window.print();
        navigate("/PaymentRecords");
    };

    if (!receipt) {

        return (

            <div className="receiptPage">

                <h2>Loading...</h2>

            </div>

        );

    }

    return (

        <div className="receiptPage">

            <div className="receiptCard">

                <h1>SERENE HOMES APARTMENTS</h1>

                <p>PO BOX 19967-03400, Nairobi</p>
                <p>Tel: 0745113765</p>
                <p>Email: serenehomes21@gmail.com</p>

                <hr />

                <h2>OFFICIAL PAYMENT RECEIPT</h2>

                <div className="receiptHeader">

                    <div>

                        <strong>Receipt No</strong>

                        <p>#{receipt.payid}</p>

                    </div>

                    <div>

                        <strong>Date</strong>

                        <p>
                            {new Date(
                                receipt.paydate
                            ).toLocaleDateString("en-GB")}
                        </p>

                    </div>

                </div>

                <table className="receiptTable">

                    <tbody>

                        <tr>

                            <td>Tenant</td>

                            <td>{receipt.name}</td>

                        </tr>

                        <tr>

                            <td>House Number</td>

                            <td>{receipt.houseno}</td>

                        </tr>

                        <tr>

                            <td>Payment Method</td>

                            <td>{receipt.paymentmethod}</td>

                        </tr>

                        <tr>

                            <td>Confirmation Code</td>

                            <td>
                                {receipt.confirmationcode || "-"}
                            </td>

                        </tr>

                        <tr className="amountRow">

                            <td>
                                Amount Paid
                            </td>

                            <td>
                                KES{" "}
                                {Number(
                                    receipt.payamount
                                ).toLocaleString(undefined,{
                                    minimumFractionDigits:2,
                                    maximumFractionDigits:2
                                })}
                            </td>

                        </tr>

                    </tbody>

                </table>

                <br />

                <p>
                    Received with thanks from the above tenant.
                </p>

                <br />

                <p>
                    <strong>Authorized Signature:</strong>
                    ________________________
                </p>

            </div>

            <button
                className="printButton"
                onClick={handlePrint}
            >
                Print Receipt
            </button>

        </div>

    );

};

export default ReceiptPrint;