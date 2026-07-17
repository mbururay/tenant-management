import { useLocation, useNavigate } from "react-router-dom";
import "../tenant_records/ModifyTenantConfirm.css";
import { authHeaders } from "../../api";

const ModifyBillConfirm = () => {

    const navigate = useNavigate();

    const { state } = useLocation();

    if (!state) {

        return (

            <div className="confirmPage">

                <h2>No bill data found.</h2>

                <button
                    onClick={() =>
                        navigate("/DisplayBills")
                    }
                >
                    Go Back
                </button>

            </div>

        );

    }

    const {
        month,
        original,
        updated
    } = state;

    const API_URL = import.meta.env.VITE_API_URL;

    const submitChanges = async () => {

        try {

            const res = await fetch(
                `${API_URL}/modify-bills`,
                {
                    method: "PUT",
                    headers: authHeaders(),
                    body: JSON.stringify({
                        bills: updated
                    })
                }
            );

            if (!res.ok) {

                throw new Error(
                    "Update failed"
                );

            }

            alert(
                "Bills updated successfully."
            );

            navigate(-2);

        } catch (err) {

            console.error(err);

            alert(
                "Failed to update bills."
            );

        }

    };

    const changes = [];

    updated.forEach((newBill) => {

        const oldBill =
            original.find(
                b =>
                    b.billid ===
                    newBill.billid
            );

        if (!oldBill) return;

        if (
            oldBill.description !==
            newBill.description
        ) {

            changes.push({

                key:
                    `${newBill.billid}-description`,

                label:
                    `${newBill.category} Description`,

                old:
                    oldBill.description,

                new:
                    newBill.description

            });

        }

        if (
            Number(
                oldBill.amount
            ) !==
            Number(
                newBill.amount
            )
        ) {

            changes.push({

                key:
                    `${newBill.billid}-amount`,

                label:
                    `${newBill.category} Amount`,

                old:
                    `KES ${Number(
                        oldBill.amount
                    ).toLocaleString()}`,

                new:
                    `KES ${Number(
                        newBill.amount
                    ).toLocaleString()}`

            });

        }

    });

    const originalTotal =
        original.reduce(
            (sum, bill) =>
                sum +
                Number(
                    bill.amount
                ),
            0
        );

    const updatedTotal =
        updated.reduce(
            (sum, bill) =>
                sum +
                Number(
                    bill.amount
                ),
            0
        );

    return (

        <div className="confirmPage">

            <div className="confirmCard">

                <h2>
                    Confirm Bill Changes
                </h2>

                <div className="confirmRow">

                    <span>
                        Billing Month
                    </span>

                    <span>
                        {month}
                    </span>

                </div>

                <div className="confirmRow">

                    <span>
                        Original Total
                    </span>

                    <span>

                        KES{" "}

                        {originalTotal.toLocaleString(
                            undefined,
                            {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            }
                        )}

                    </span>

                </div>

                <div className="confirmRow">

                    <span>
                        Updated Total
                    </span>

                    <span>

                        KES{" "}

                        {updatedTotal.toLocaleString(
                            undefined,
                            {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            }
                        )}

                    </span>

                </div>

                <hr />

                {changes.length === 0 ? (

                    <h3
                        style={{
                            textAlign:
                                "center"
                        }}
                    >
                        No changes detected.
                    </h3>

                ) : (

                    changes.map(
                        change => (

                            <div
                                key={
                                    change.key
                                }
                                className="changeCard"
                            >

                                <h3>
                                    {
                                        change.label
                                    }
                                </h3>

                                <div className="changeValues">

                                    <div className="oldValue">

                                        <small>
                                            Current
                                        </small>

                                        <p>
                                            {
                                                change.old
                                            }
                                        </p>

                                    </div>

                                    <div className="arrow">

                                        →

                                    </div>

                                    <div className="newValue">

                                        <small>
                                            New
                                        </small>

                                        <p>
                                            {
                                                change.new
                                            }
                                        </p>

                                    </div>

                                </div>

                            </div>

                        )
                    )

                )}

                <div className="buttonRow">

                    <button
                        className="editBtn"
                        onClick={() =>
                            navigate(-1)
                        }
                    >
                        Back
                    </button>

                    <button
                        className="confirmBtn"
                        onClick={
                            submitChanges
                        }
                        disabled={
                            changes.length === 0
                        }
                    >
                        Confirm Changes
                    </button>

                </div>

            </div>

        </div>

    );

};

export default ModifyBillConfirm;