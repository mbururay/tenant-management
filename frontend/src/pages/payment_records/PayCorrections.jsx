import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Heading from "../../components/Heading";
import "../invoice_generation/ICorrect.css";

const PayCorrections = () => {

    const { paymentId } = useParams();

    const navigate = useNavigate();

    const [payment, setPayment] = useState(null);

    const [formData, setFormData] = useState({
        adjustmentAmount: "",
        reason: ""
    });

    const API_URL = import.meta.env.VITE_API_URL;

        useEffect(() => {

        fetch(`${API_URL}/payment/${paymentId}`)
            .then(res => res.json())
            .then(data => {

                setPayment({

                    paymentId: data.payment.paymentid,

                    tenant: data.payment.tenant,

                    paymentAmount: data.payment.paymentamount,

                    paymentMethod: data.payment.paymentmethod,

                    confirmationCode: data.payment.confirmationcode,

                    paymentDate: data.payment.paymentdate

                });

            })
            .catch(console.error);

    }, [paymentId,API_URL]);


    const handleChange = (e) => {

        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));

    };



    const handleSubmit = (e) => {

    e.preventDefault();

    if (
        formData.adjustmentAmount === "" ||
        !formData.reason.trim()
    ) {
        alert("Please complete all fields.");
        return;
    }

    navigate("/PayCorrectionsConfirm", {

        state: {

            payment,

            correction: {

                paymentId: payment.paymentId,

                adjustmentAmount: Number(formData.adjustmentAmount),

                reason: formData.reason

            }

        }

    });

};


    if (!payment) {

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
                    Loading Payment...
                </h2>

            </div>

        );

    }



    return (

        <div className="editTenantPage">

            <Heading />

            <h1 className="editTenantTitle">
                Create Payment Correction
            </h1>



            {/* ORIGINAL PAYMENT */}

            <form className="editTenantForm">

                <section className="editSection">

                    <h3>Original Payment</h3>

                    <label>Payment ID</label>

                    <input
                        className="editInput houseDisplay"
                        value={payment.paymentId}
                        readOnly
                    />



                    <label>Tenant</label>

                    <input
                        className="editInput houseDisplay"
                        value={payment.tenant}
                        readOnly
                    />



                    <label>Payment Amount</label>

                    <input
                        className="editInput houseDisplay"
                        value={`KES ${Number(
                            payment.paymentAmount
                        ).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}`}
                        readOnly
                    />



                    <label>Payment Method</label>

                    <input
                        className="editInput houseDisplay"
                        value={
                            payment.paymentMethod ||
                            "Not Provided"
                        }
                        readOnly
                    />



                    <label>Confirmation Code</label>

                    <input
                        className="editInput houseDisplay"
                        value={
                            payment.confirmationCode ||
                            "Not Provided"
                        }
                        readOnly
                    />



                    <label>Payment Date</label>

                    <input
                        className="editInput houseDisplay"
                        value={
                            new Date(
                                payment.paymentDate
                            ).toLocaleDateString()
                        }
                        readOnly
                    />

                </section>

            </form>



            {/* CORRECTION FORM */}

                        <form
                className="editTenantForm"
                onSubmit={handleSubmit}
            >
                <section className="editSection">

                    <h3>Create Payment Adjustment</h3>

                    <label>Adjustment Amount</label>

                    <input
                        type="number"
                        step="0.01"
                        className="editInput"
                        name="adjustmentAmount"
                        value={formData.adjustmentAmount}
                        onChange={handleChange}
                        placeholder="Use + to increase, - to decrease"
                    />

                    <label>Preview</label>

                    <input
                        className="editInput houseDisplay"
                        readOnly
                        value={`KES ${(
                            Number(payment.paymentAmount) +
                            (Number(formData.adjustmentAmount) || 0)
                        ).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}`}
                    />

                    <label>Reason</label>

                    <textarea
                        className="editInput"
                        rows="5"
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        placeholder="Explain why this payment adjustment is required..."
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

export default PayCorrections;