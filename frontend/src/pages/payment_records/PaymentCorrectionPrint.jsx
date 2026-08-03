import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./PaymentCorrectionPrint.css";

const PaymentCorrectionPrint = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const [correction, setCorrection] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {

        fetch(`${API_URL}/payment-correction/${id}`)
            .then(res => res.json())
            .then(data => setCorrection(data))
            .catch(console.error);

    }, [id, API_URL]);

    const printPage = () => {

        window.print();

        navigate(-3);

    };

    if (!correction) {

        return (
            <div className="correctionPage">
                <h2>Loading...</h2>
            </div>
        );

    }

    return (

        <div className="correctionPage">

            <div className="correctionCard">

                <h1>SERENE HOMES APARTMENTS</h1>

                <p>PO BOX 19967-03400, Nairobi</p>

                <p>Tel: 0745113765</p>

                <p>Email: serenehomes21@gmail.com</p>

                <hr />

                <h2>PAYMENT CORRECTION NOTICE</h2>

                <div className="correctionHeader">

                    <div>

                        <strong>Correction No</strong>

                        <p>#{correction.correctionId}</p>

                    </div>

                    <div>

                        <strong>Payment No</strong>

                        <p>#{correction.paymentId}</p>

                    </div>

                    <div>

                        <strong>Tenant</strong>

                        <p>{correction.tenant}</p>

                    </div>

                    <div>

                        <strong>House</strong>

                        <p>{correction.houseNo}</p>

                    </div>

                </div>

                <table className="correctionTable">

                    <thead>

                        <tr>

                            <th>Description</th>

                            <th>Amount (KES)</th>

                        </tr>

                    </thead>

                    <tbody>

                        <tr>

                            <td>Original Payment</td>

                            <td>
                                {Number(
                                    correction.originalAmount
                                ).toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })}
                            </td>

                        </tr>

                        <tr>

                            <td>Adjustment</td>

                            <td
                                style={{
                                    color:
                                        Number(correction.adjustmentAmount) >= 0
                                            ? "#15803d"
                                            : "#dc2626",
                                    fontWeight: "bold"
                                }}
                            >
                                {Number(correction.adjustmentAmount) >= 0
                                    ? "+"
                                    : ""}
                                {Number(
                                    correction.adjustmentAmount
                                ).toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })}
                            </td>

                        </tr>

                        <tr>

                            <td>
                                <strong>Corrected Payment</strong>
                            </td>

                            <td>
                                <strong>
                                    {Number(
                                        correction.correctedAmount
                                    ).toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    })}
                                </strong>
                            </td>

                        </tr>

                    </tbody>

                </table>

                <div className="reasonBox">

                    <h3>Reason For Correction</h3>

                    <p>{correction.reason}</p>

                </div>

                <div className="approvalSection">

                    <p>

                        <strong>Created:</strong>{" "}

                        {new Date(
                            correction.createdAt
                        ).toLocaleDateString()}

                    </p>

                    <br />

                    <p>
                        Approved By:
                        ________________________
                    </p>

                    <p>
                        Signature:
                        ________________________
                    </p>

                </div>

            </div>

            <button
                className="printButton"
                onClick={printPage}
            >
                Print Correction
            </button>

        </div>

    );

};

export default PaymentCorrectionPrint;