import { useLocation, useNavigate } from "react-router-dom";
import Heading from "../../components/Heading";
import "./ICorrectConfirm.css";
import { authHeaders } from "../../api";

const ICorrectConfirm = () => {

    const navigate = useNavigate();
    const { state } = useLocation();
    const API_URL = import.meta.env.VITE_API_URL;
    

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
                    No correction to review.
                </h2>

            </div>

        );

    }

    const { invoice, correction } = state;

    const handleConfirm = async () => {

        try {

            const res = await fetch(
                `${API_URL}/createInvoiceCorrection`,
                {
                    method: "POST",

                    headers: authHeaders(),

                    body: JSON.stringify({
                        invoiceId: invoice.invoiceId,
                        tenantId: invoice.tenantId,
                        amount: correction.amount,
                        reason: correction.reason,
                        correctionType:
                            correction.correctionType
                    })
                }
            );
            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.error ||
                    "Failed to create invoice correction."
                );
            }

            alert(
                "Invoice correction created successfully."
            );

            navigate(
                `/InvoiceCorrectionPrint/${data.correctionId}`
            );

        }
        catch (err) {

            console.error(err);
            alert(err.message);

        }

    };

    return (

        <div className="editTenantPage">

            <Heading />

            <h1 className="editTenantTitle">
                Confirm Invoice Correction
            </h1>

            <div className="editTenantForm">

                <section className="editSection">

                    <h3>Invoice</h3>

                    <div className="confirmRow">
                        <span>Invoice</span>
                        <span>#{invoice.invoiceId}</span>
                    </div>

                    <div className="confirmRow">
                        <span>Tenant</span>
                        <span>{invoice.tenant}</span>
                    </div>

                    <div className="confirmRow">
                        <span>House</span>
                        <span>{invoice.houseNo}</span>
                    </div>

                    <div className="confirmRow">
                        <span>Total</span>
                        <span>
                            KES{" "}
                            {Number(
                                invoice.totalAmount
                            ).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}
                        </span>
                    </div>

                </section>

                <section className="editSection">

                    <h3>Correction</h3>

                    <div className="confirmRow">
                        <span>Type</span>
                        <span>
                            {correction.correctionType}
                        </span>
                    </div>

                    <div className="confirmRow">
                        <span>Adjustment</span>

                        <span
                            style={{
                                color:
                                    correction.amount < 0
                                        ? "#dc2626"
                                        : "#15803d",
                                fontWeight: "bold"
                            }}
                        >
                            {correction.amount > 0 ? "+" : ""}

                            {Number(
                                correction.amount
                            ).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}
                        </span>

                    </div>

                    <div className="confirmReason">

                        <h4>Reason</h4>

                        <p>
                            {correction.reason}
                        </p>

                    </div>

                </section>

                <div className="buttonRow">

                    <button
                        type="button"
                        className="cancelButton"
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </button>

                    <button
                        type="button"
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

export default ICorrectConfirm;