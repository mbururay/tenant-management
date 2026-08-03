import { useLocation, useNavigate } from "react-router-dom";
import Heading from "../../components/Heading";
import "../invoice_generation/ICorrectConfirm.css";
import { authHeaders } from "../../api";

const PayCorrectionsConfirm = () => {

    const navigate = useNavigate();
    const { state } = useLocation();

    if (!state) {
        return (
            <div className="editTenantPage">
                <Heading />

                <h2
                    style={{
                        color: "white",
                        textAlign: "center",
                        marginTop: "100px"
                    }}
                >
                    No payment correction to review.
                </h2>
            </div>
        );
    }

    const { payment, correction } = state;

    const API_URL = import.meta.env.VITE_API_URL;

    const correctedAmount =
        Number(payment.paymentAmount) +
        Number(correction.adjustmentAmount);

    const handleConfirm = async () => {

        try {

            const res = await fetch(
                `${API_URL}/createPaymentCorrection`,
                {
                    method: "POST",

                    headers: authHeaders(),

                    body: JSON.stringify({
                        paymentId: payment.paymentId,
                        adjustmentAmount: correction.adjustmentAmount,
                        reason: correction.reason
                    })
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error);
            }

            alert("Payment correction created successfully.");

            navigate(
                `/PaymentCorrectionPrint/${data.correctionId}`
            );

        } catch (err) {

            console.error(err);

            alert(err.message);

        }

    };

    return (

        <div className="editTenantPage">

            <Heading />

            <h1 className="editTenantTitle">
                Confirm Payment Correction
            </h1>

            <div className="editTenantForm">

                <section className="editSection">

                    <h3>Payment Details</h3>

                    <div className="confirmRow">
                        <span>Payment ID</span>
                        <span>#{payment.paymentId}</span>
                    </div>

                    <div className="confirmRow">
                        <span>Tenant</span>
                        <span>{payment.tenant}</span>
                    </div>

                    <div className="confirmRow">
                        <span>Original Amount</span>

                        <span>
                            KES{" "}
                            {Number(payment.paymentAmount).toLocaleString(
                                undefined,
                                {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                }
                            )}
                        </span>
                    </div>

                    <div className="confirmRow">
                        <span>Payment Method</span>
                        <span>{payment.paymentMethod}</span>
                    </div>

                    <div className="confirmRow">
                        <span>Confirmation Code</span>
                        <span>{payment.confirmationCode}</span>
                    </div>

                </section>

                <section className="editSection">

                    <h3>Correction Details</h3>

                    <div className="confirmRow">
                        <span>Adjustment</span>

                        <span
                            style={{
                                color:
                                    Number(correction.adjustmentAmount) >= 0
                                        ? "#15803d"
                                        : "#dc2626",
                                fontWeight: "bold"
                            }}
                        >
                            {Number(correction.adjustmentAmount) >= 0 ? "+" : ""}
                            KES{" "}
                            {Number(correction.adjustmentAmount).toLocaleString(
                                undefined,
                                {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                }
                            )}
                        </span>
                    </div>

                    <div className="confirmRow">
                        <span>Corrected Amount</span>

                        <span
                            style={{
                                fontWeight: "bold"
                            }}
                        >
                            KES{" "}
                            {correctedAmount.toLocaleString(
                                undefined,
                                {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                }
                            )}
                        </span>
                    </div>

                    <div className="confirmReason">

                        <h4>Reason</h4>

                        <p>{correction.reason}</p>

                    </div>

                </section>

                <div className="buttonRow">

                    <button
                        className="cancelButton"
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </button>

                    <button
                        className="continueButton"
                        onClick={handleConfirm}
                    >
                        Confirm Correction
                    </button>

                </div>

            </div>

        </div>

    );

};

export default PayCorrectionsConfirm;