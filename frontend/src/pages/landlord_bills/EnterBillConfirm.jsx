import { useLocation, useNavigate } from "react-router-dom";
import "./EnterBillConfirm.css";

const EnterBillConfirm = () => {

    const navigate = useNavigate();

    const { state } = useLocation();

    if (!state) {

        return (

            <div className="confirmPage">

                <h2>No bill data found.</h2>

                <button onClick={() => navigate("/EnterBills")}>
                    Go Back
                </button>

            </div>

        );

    }

    const {
        billingMonth,
        bills,
        totalAmount
    } = state;

    const submitBills = async () => {

        try {

            const res = await fetch(
                "http://localhost:3001/create-bills",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        billingMonth,
                        bills
                    })
                }
            );

            if (!res.ok) {

                throw new Error("Failed to save bills");

            }

            alert("Bills saved successfully.");

            navigate(-2);

        } catch (err) {

            console.error(err);

            alert("Unable to save bills.");

        }

    };

    return (

        <div className="confirmPage">

            <div className="confirmCard">

                <h2>
                    Confirm Monthly Bills
                </h2>

                <div className="confirmRow">

                    <span>Billing Month</span>

                    <span>{billingMonth}</span>

                </div>

                <hr />

                {bills.map((bill, index) => (

                    <div
                        key={index}
                        className="changeCard"
                    >

                        <h3>{bill.category}</h3>

                        <div className="changeValues">

                            <div className="oldValue">

                                <small>Description</small>

                                <p>{bill.description}</p>

                            </div>

                            <div className="newValue">

                                <small>Amount</small>

                                <p>
                                    KES{" "}
                                    {Number(
                                        bill.amount
                                    ).toLocaleString(undefined,{
                                        minimumFractionDigits:2,
                                        maximumFractionDigits:2
                                    })}
                                </p>

                            </div>

                        </div>

                    </div>

                ))}

                <hr />

                <div className="confirmRow">

                    <span>
                        Total Monthly Expenses
                    </span>

                    <span>
                        KES{" "}
                        {Number(
                            totalAmount
                        ).toLocaleString(undefined,{
                            minimumFractionDigits:2,
                            maximumFractionDigits:2
                        })}
                    </span>

                </div>

                <div className="buttonRow">

                    <button
                        className="editBtn"
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </button>

                    <button
                        className="confirmBtn"
                        onClick={submitBills}
                    >
                        Confirm Bills
                    </button>

                </div>

            </div>

        </div>

    );

};

export default EnterBillConfirm;