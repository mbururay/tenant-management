import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Heading from "../../components/Heading";
import "./ICorrect.css";

const ICorrection = () => {

    const { invoiceId } = useParams();
    const navigate = useNavigate();

    const [invoice, setInvoice] = useState(null);

    const [formData, setFormData] = useState({
        correctionType: "",
        amount: "",
        reason: ""
    });

    

    useEffect(() => {

        fetch(`http://localhost:3001/invoice/${invoiceId}`)
            .then(res => res.json())
            .then(data => {

                setInvoice({

                    invoiceId: data.invoice.invoiceid,
                    tenantId: data.invoice.tenantid, // if returned

                    tenant: data.invoice.name,
                    houseNo: data.invoice.houseno,

                    billingDate: data.invoice.billingdate,
                    totalAmount: data.invoice.totalamount,

                    charges: data.charges,
                    water: data.water

                });

            })

    }, [invoiceId]);

    const handleChange = (e) => {

        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));

    };

    const handleSubmit = (e) => {

        e.preventDefault();

        if (
            !formData.correctionType ||
            !formData.amount ||
            !formData.reason.trim()
        ) {
            alert("Please complete all fields.");
            return;
        }

        navigate("/ICorrectConfirm", {

            state: {

                invoice,

                correction: {

                    invoiceId: invoice.invoiceId,
                    tenantId: invoice.tenantId,
                    amount: Number(formData.amount),
                    reason: formData.reason,
                    correctionType: formData.correctionType

                }

            }

        });

    };

    if (!invoice) {

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
                    Loading Invoice...
                </h2>

            </div>

        );

    }

    return (

        <div className="editTenantPage">

            <Heading />

            <h1 className="editTenantTitle">
                Create Invoice Correction
            </h1>

            {/* ORIGINAL INVOICE */}

            <form className="editTenantForm">

    <section className="editSection">

        <h3>Original Invoice</h3>

        <label>Invoice Number</label>

        <input
            className="editInput houseDisplay"
            value={invoice.invoiceId}
            readOnly
        />

        <label>Tenant</label>

        <input
            className="editInput houseDisplay"
            value={invoice.tenant}
            readOnly
        />

        <label>House</label>

        <input
            className="editInput houseDisplay"
            value={invoice.houseNo}
            readOnly
        />

        <label>Billing Date</label>

        <input
            className="editInput houseDisplay"
            value={new Date(invoice.billingDate).toLocaleDateString()}
            readOnly
        />

        <h3 style={{ marginTop: "30px" }}>
            Invoice Breakdown
        </h3>

        <div className="invoiceBreakdown">

            {invoice.charges.map((charge) => (

                <div
                    className="invoiceLine"
                    key={charge.chargeid}
                >

                    <span>{charge.chargetype}</span>

                    <span>
                        KES{" "}
                        {Number(charge.chargeamount).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                    </span>

                </div>

            ))}

            <div className="invoiceLine">

                <span>Water</span>

                <span>

                    KES{" "}

                    {invoice.water
                        ? Number(invoice.water.bill).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                          })
                        : "0.00"}

                </span>

            </div>

            <hr />

            <div
                className="invoiceLine"
                style={{
                    fontWeight: "bold",
                    fontSize: "18px"
                }}
            >

                <span>Total</span>

                <span>

                    KES{" "}

                    {Number(invoice.totalAmount).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}

                </span>

            </div>

        </div>

    </section>

</form>

            {/* CORRECTION FORM */}

            <form
                className="editTenantForm"
                onSubmit={handleSubmit}
            >

                <section className="editSection">

                    <h3>Create Correction</h3>

                    <label>Correction Type</label>

                    <select
                        className="editInput"
                        name="correctionType"
                        value={formData.correctionType}
                        onChange={handleChange}
                    >

                        <option value="">Select...</option>

                        <option value="Rent">
                            Rent
                        </option>

                        <option value="Garbage">
                            Garbage
                        </option>

                        <option value="Water">
                            Water
                        </option>

                        <option value="Other">
                            Other
                        </option>

                    </select>

                    <label>Correction Amount (KES)</label>

                    <input
                        className="editInput"
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        placeholder="Use negative for credit"
                    />

                    <label>Reason</label>

                    <textarea
                        className="editInput"
                        name="reason"
                        rows="5"
                        value={formData.reason}
                        onChange={handleChange}
                        placeholder="Explain why this correction is required..."
                    />

                </section>

                <div className="buttonRow">

                    <button
                        type="button"
                        className="cancelButton"
                        onClick={() => navigate(-1)}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="continueButton"
                    >
                        Review Correction
                    </button>

                </div>

            </form>

        </div>

    );

};

export default ICorrection;