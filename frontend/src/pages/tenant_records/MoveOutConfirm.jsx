import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./MoveOutConfirm.css";
import { authHeaders } from "../../api";

const MoveOutConfirm = () => {

    const { state } = useLocation();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL;

    if (!state) {

        return (

            <div className="confirmPage">

                <h2>No settlement data found.</h2>

                <button onClick={() => navigate("/MoveOutTenant")}>

                    Go Back

                </button>

            </div>

        );

    }

    const submitToBackend = async () => {

        setLoading(true);

        try {

            const res = await fetch(

                `${API_URL}/complete-moveout`,

                {

                    method: "POST",

                    headers: authHeaders(),

                    body: JSON.stringify(state)

                }

            );

            if (!res.ok) {

                throw new Error("Move out failed");

            }

            alert("Move Out completed.");

            navigate("/MoveOutTenant", {

                replace: true

            });

        }

        catch (err) {

            console.error(err);

            alert("Unable to complete move out.");

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div className="confirmPage">

            <div className="confirmCard">

                <h2>

                    Confirm Move Out

                </h2>

                <div className="confirmRow">

                    <span>

                        Tenant

                    </span>

                    <span>

                        {state.tenant.name}

                    </span>

                </div>

                <div className="confirmRow">

                    <span>

                        House

                    </span>

                    <span>

                        {state.tenant.houseno}

                    </span>

                </div>

                <div className="confirmRow">

                    <span>

                        Move Out Date

                    </span>

                    <span>

                        {state.moveOutDate}

                    </span>

                </div>

                <hr />

                <h3>

                    Deposit Deductions

                </h3>

                {

                    state.charges.length === 0 ?

                    (

                        <p>

                            No deductions.

                        </p>

                    )

                    :

                    state.charges.map((charge,index)=>(

                        <div
                            key={index}
                            className="changeCard"
                        >

                            <div className="confirmRow">

                                <span>

                                    {charge.description}

                                </span>

                                <span>

                                    KES {

                                        Number(charge.amount)

                                        .toLocaleString(

                                            "en-GB",

                                            {

                                                minimumFractionDigits:2,

                                                maximumFractionDigits:2

                                            }

                                        )

                                    }

                                </span>

                            </div>

                        </div>

                    ))

                }

                <hr />

                <div className="confirmRow">

                    <span>

                        Deposit Held

                    </span>

                    <span>

                        KES {

                            Number(state.depositHeld)

                            .toLocaleString(

                                "en-GB",

                                {

                                    minimumFractionDigits:2,

                                    maximumFractionDigits:2

                                }

                            )

                        }

                    </span>

                </div>

                <div className="confirmRow">

                    <span>

                        Total Charges

                    </span>

                    <span>

                        KES {

                            Number(state.totalCharges)

                            .toLocaleString(

                                "en-GB",

                                {

                                    minimumFractionDigits:2,

                                    maximumFractionDigits:2

                                }

                            )

                        }

                    </span>

                </div>

                <div className="confirmRow">

                    <span>

                        Refund Due

                    </span>

                    <span
                        style={{
                            color:"#22c55e",
                            fontWeight:"700"
                        }}
                    >

                        KES {

                            Number(state.refundDue)

                            .toLocaleString(

                                "en-GB",

                                {

                                    minimumFractionDigits:2,

                                    maximumFractionDigits:2

                                }

                            )

                        }

                    </span>

                </div>

                {

                    state.balanceOwing > 0 &&

                    (

                        <div className="confirmRow">

                            <span>

                                Balance Owing

                            </span>

                            <span
                                style={{
                                    color:"#ef4444",
                                    fontWeight:"700"
                                }}
                            >

                                KES {

                                    Number(state.balanceOwing)

                                    .toLocaleString(

                                        "en-GB",

                                        {

                                            minimumFractionDigits:2,

                                            maximumFractionDigits:2

                                        }

                                    )

                                }

                            </span>

                        </div>

                    )

                }

                <div className="buttonRow">

                    <button
                        className="editBtn"
                        onClick={()=>navigate(-1)}
                    >

                        Back

                    </button>

                    <button
                        className="confirmBtn"
                        disabled={loading}
                        onClick={submitToBackend}
                    >

                        {

                            loading

                            ?

                            "Saving..."

                            :

                            "Complete Move Out"

                        }

                    </button>

                </div>

            </div>

        </div>

    );

};

export default MoveOutConfirm;