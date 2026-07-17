import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Heading from "../../components/Heading";
import "../tenant_records/ModifyTenant.css";

const EnterBills = () => {

    const navigate = useNavigate();

    const [billingMonth, setBillingMonth] = useState("");

    const [bills, setBills] = useState([
        { category: "Water", description: "", amount: "" },
        { category: "Security", description: "", amount: "" },
        { category: "Cleaning", description: "", amount: "" },
        { category: "Garbage", description: "", amount: "" },
        { category: "Electricity", description: "", amount: "" },
        { category: "Plumbing", description: "", amount: "" },
        { category: "Repairs", description: "", amount: "" },
        { category: "Supplies", description: "", amount: "" }
    ]);

    const updateBill = (index, field, value) => {

        const updated = [...bills];

        updated[index][field] = value;

        setBills(updated);

    };

    const addBill = () => {

        setBills([
            ...bills,
            {
                category: "Other",
                description: "",
                amount: ""
            }
        ]);

    };

    const removeBill = (index) => {

        const updated = [...bills];

        updated.splice(index, 1);

        setBills(updated);

    };

    const totalAmount = bills.reduce(
        (sum, bill) =>
            sum + (Number(bill.amount) || 0),
        0
    );

    const handleSubmit = (e) => {

        e.preventDefault();

        if (!billingMonth) {

            alert("Please select a billing month.");

            return;

        }

        const validBills = bills.filter(
            bill =>
                bill.description.trim() !== "" &&
                Number(bill.amount) > 0
        );

        if (validBills.length === 0) {

            alert("Please enter at least one bill.");

            return;

        }

        navigate("/EnterBillConfirm", {

            state: {

                billingMonth,

                bills: validBills,

                totalAmount

            }

        });

    };

    return (

        <div className="editTenantPage">

            <Heading />

            <h1 className="editTenantTitle">
                Monthly Landlord Bills
            </h1>

            <form
                className="editTenantForm"
                onSubmit={handleSubmit}
            >

                <section className="editSection">

                    <h3>Billing Period</h3>

                    <label>Month</label>

                    <input
                        className="editInput"
                        type="month"
                        value={billingMonth}
                        onChange={(e) =>
                            setBillingMonth(e.target.value)
                        }
                    />

                </section>

                <section className="editSection">

                    <h3>Monthly Expenses</h3>

                    {bills.map((bill, index) => (

                        <div
                            key={index}
                            style={{
                                marginBottom: "20px",
                                paddingBottom: "20px",
                                borderBottom:
                                    "1px solid rgba(255,255,255,.15)"
                            }}
                        >

                            <label>Category</label>

                            <input
                                className="editInput houseDisplay"
                                value={bill.category}
                                readOnly
                            />

                            <label>Description</label>

                            <input
                                className="editInput"
                                value={bill.description}
                                onChange={(e) =>
                                    updateBill(
                                        index,
                                        "description",
                                        e.target.value
                                    )
                                }
                            />

                            <label>Amount (KES)</label>

                            <input
                                className="editInput"
                                type="number"
                                value={bill.amount}
                                onChange={(e) =>
                                    updateBill(
                                        index,
                                        "amount",
                                        e.target.value
                                    )
                                }
                            />

                            {bill.category === "Other" && (

                                <button
                                    type="button"
                                    className="cancelButton"
                                    style={{
                                        marginTop: "10px"
                                    }}
                                    onClick={() =>
                                        removeBill(index)
                                    }
                                >
                                    Remove
                                </button>

                            )}

                        </div>

                    ))}

                    <button
                        type="button"
                        className="continueButton"
                        onClick={addBill}
                    >
                        + Add Extra Bill
                    </button>

                </section>

                <section className="editSection">

                    <h3>Total Monthly Expenses</h3>

                    <input
                        className="editInput houseDisplay"
                        value={`KES ${totalAmount.toLocaleString()}`}
                        readOnly
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
                        Review Bills
                    </button>

                </div>

            </form>

        </div>

    );

};

export default EnterBills;