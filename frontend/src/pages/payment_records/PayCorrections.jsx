import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Heading from "../../components/Heading";
import "../invoice_generation/ICorrect.css";

const PayCorrections = () => {

    const { paymentId } = useParams();

    const navigate = useNavigate();

    const [payment, setPayment] = useState(null);

    const [formData, setFormData] = useState({
        fieldName: "",
        newValue: "",
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
            !formData.fieldName ||
            !formData.newValue ||
            !formData.reason.trim()
        ) {

            alert("Please complete all fields.");
            return;

        }

        const oldValues = {

            paymentMethod: payment.paymentMethod,

            confirmationCode:
                payment.confirmationCode || "",

            paymentAmount:
                payment.paymentAmount

        };

        const oldValue =
            oldValues[formData.fieldName];

        if (
            String(oldValue).trim() ===
            String(formData.newValue).trim()
        ) {

            alert(
                "New value must be different from the current value."
            );

            return;

        }

        navigate("/PayCorrectionsConfirm", {

            state: {

                payment,

                correction: {

                    paymentId:
                        payment.paymentId,

                    fieldName:
                        formData.fieldName,

                    oldValue,

                    newValue:
                        formData.newValue,

                    reason:
                        formData.reason

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

                    <h3>Create Correction</h3>

                    <label>Field To Correct</label>

                    <select
                        className="editInput"
                        name="fieldName"
                        value={formData.fieldName}
                        onChange={(e) =>
                            setFormData({
                                fieldName: e.target.value,
                                newValue: "",
                                reason:
                                    formData.reason
                            })
                        }
                    >

                        <option value="">
                            Select...
                        </option>

                        <option value="paymentMethod">
                            Payment Method
                        </option>

                        <option value="confirmationCode">
                            Confirmation Code
                        </option>

                        <option value="paymentAmount">
                            Payment Amount
                        </option>

                    </select>



                    <label>New Value</label>

                    {formData.fieldName ===
                    "paymentMethod" ? (

                        <select
                            className="editInput"
                            name="newValue"
                            value={formData.newValue}
                            onChange={handleChange}
                        >

                            <option value="">
                                Select Method
                            </option>

                            <option value="NBK Bank Transfer">
                                NBK Bank Transfer
                            </option>

                            <option value="SC Bank Transfer">
                                SC Bank Transfer
                            </option>

                        </select>

                    ) : formData.fieldName ===
                      "paymentAmount" ? (

                        <input
                            type="number"
                            step="0.01"
                            className="editInput"
                            name="newValue"
                            value={formData.newValue}
                            onChange={handleChange}
                            placeholder="Enter corrected amount"
                        />

                    ) : (

                        <input
                            className="editInput"
                            name="newValue"
                            value={formData.newValue}
                            onChange={handleChange}
                            placeholder="Enter corrected value"
                        />

                    )}



                    <label>Reason</label>

                    <textarea
                        className="editInput"
                        rows="5"
                        name="reason"
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

export default PayCorrections;