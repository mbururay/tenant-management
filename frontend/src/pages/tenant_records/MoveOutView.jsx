import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import "./MoveOutView.css";

const MoveOutView = () => {

    const navigate = useNavigate();

    const API_URL = import.meta.env.VITE_API_URL;

    const { moveoutid } = useParams();

    const [moveout, setMoveout] = useState(null);
    const [charges, setCharges] = useState([]);

    console.log("moveoutid:", moveoutid);

    useEffect(() => {

        fetch(`${API_URL}/moveout-view/${moveoutid}`)
            .then(res => res.json())
            .then(data => {

                setMoveout(data.summary);
                setCharges(data.deductions);

            })
            .catch(console.error);

    }, [moveoutid, API_URL]);

    if (!moveout) {

        return (

            <div className="confirmPage">

                
                <h2>Loading...</h2>

            </div>

        );

    }

    return (

        <div className="confirmPage">

            
            <div className="confirmCard">

                <h2>
                    Move Out Settlement
                </h2>

                <div className="confirmRow">

                    <span>Tenant</span>

                    <span>{moveout.name}</span>

                </div>

                <div className="confirmRow">

                    <span>House</span>

                    <span>{moveout.houseno}</span>

                </div>

                <div className="confirmRow">

                    <span>Phone</span>

                    <span>{moveout.phone}</span>

                </div>

                <div className="confirmRow">

                    <span>Move Out Date</span>

                    <span>
                        {new Date(moveout.moveoutdate).toLocaleDateString(
                            "en-GB"
                        )}
                    </span>

                </div>

                <hr />

                <div className="confirmRow">

                    <span>Deposit Held</span>

                    <span>

                        KES{" "}

                        {Number(moveout.depositheld).toLocaleString(
                            "en-GB",
                            {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            }
                        )}

                    </span>

                </div>

                <hr />

                <h3
                    style={{
                        marginBottom: "20px"
                    }}
                >
                    Deposit Deductions
                </h3>

                {charges.length === 0 ? (

                    <p
                        style={{
                            textAlign: "center",
                            color: "#94a3b8"
                        }}
                    >
                        No deductions recorded.
                    </p>

                ) : (

                    charges.map(charge => (

                        <div
                            key={charge.chargeid}
                            className="changeCard"
                        >

                            <div className="changeValues">

                                <div className="oldValue">

                                    <small>Description</small>

                                    <p>{charge.description}</p>

                                </div>

                                <div className="newValue">

                                    <small>Amount</small>

                                    <p>

                                        KES{" "}

                                        {Number(charge.amount).toLocaleString(
                                            "en-GB",
                                            {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            }
                                        )}

                                    </p>

                                </div>

                            </div>

                        </div>

                    ))

                )}

                <hr />

                <div className="confirmRow">

                    <span>Total Charges</span>

                    <span>

                        KES{" "}

                        {Number(moveout.totalcharges).toLocaleString(
                            "en-GB",
                            {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            }
                        )}

                    </span>

                </div>

                <div className="confirmRow">

                    <span>Refund Due</span>

                    <span
                        style={{
                            color: "#16a34a",
                            fontWeight: "700"
                        }}
                    >

                        KES{" "}

                        {Number(moveout.refunddue).toLocaleString(
                            "en-GB",
                            {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            }
                        )}

                    </span>

                </div>

                <div className="confirmRow">

                    <span>Balance Owing</span>

                    <span
                        style={{
                            color:
                                Number(moveout.balanceowing) > 0
                                    ? "#dc2626"
                                    : "#16a34a",
                            fontWeight: "700"
                        }}
                    >

                        KES{" "}

                        {Number(moveout.balanceowing).toLocaleString(
                            "en-GB",
                            {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            }
                        )}

                    </span>

                </div>

                <div className="buttonRow">

                    <button
                        className="editBtn"
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </button>

                </div>

            </div>

        </div>

    );

};

export default MoveOutView;