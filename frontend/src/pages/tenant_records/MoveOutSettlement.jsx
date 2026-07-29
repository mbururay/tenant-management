import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Heading from "../../components/Heading";
import "../tenant_records/ModifyTenant.css";

const MoveOutSettlement = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const API_URL = import.meta.env.VITE_API_URL;

    const [tenant, setTenant] = useState(null);

    const [moveOutDate, setMoveOutDate] = useState("");

    const [charges, setCharges] = useState([
        {
            description: "",
            amount: ""
        }
    ]);

    useEffect(() => {

        fetch(`${API_URL}/moveout-tenant/${id}`)
            .then(res => res.json())
            .then(data => {

                setTenant(data);

            })
            .catch(err => {

                console.error(err);

                alert("Unable to load tenant.");

            });

    }, [id, API_URL]);

    const updateCharge = (index, field, value) => {

        const updated = [...charges];

        updated[index][field] = value;

        setCharges(updated);

    };

    const addCharge = () => {

        setCharges([
            ...charges,
            {
                description: "",
                amount: ""
            }
        ]);

    };

    const removeCharge = (index) => {

        const updated = [...charges];

        updated.splice(index, 1);

        setCharges(updated);

    };

    const totalCharges = useMemo(() => {

        return charges.reduce(

            (sum, charge) =>

                sum + (Number(charge.amount) || 0),

            0

        );

    }, [charges]);

    const depositHeld = Number(tenant?.deposit || 0);

    const refundDue = Math.max(

        depositHeld - totalCharges,

        0

    );

    const balanceOwing = Math.max(

        totalCharges - depositHeld,

        0

    );

    const handleSubmit = (e) => {

        e.preventDefault();

        if (!moveOutDate) {

            alert("Select a move out date.");

            return;

        }

        const validCharges = charges.filter(

            charge =>

                charge.description.trim() !== "" ||

                Number(charge.amount) > 0

        );

        navigate("/MoveOutConfirm", {

            state: {

                tenant,

                moveOutDate,

                charges: validCharges,

                depositHeld,

                totalCharges,

                refundDue,

                balanceOwing

            }

        });

    };

    if (!tenant) {

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
                    Loading Tenant...
                </h2>

            </div>

        );

    }

    return (

        <div className="editTenantPage">

            <Heading />

            <h1 className="editTenantTitle">

                Move Out Settlement

            </h1>

            <form
                className="editTenantForm"
                onSubmit={handleSubmit}
            >

                <section className="editSection">

                    <h3>

                        Tenant Information

                    </h3>

                    <label>

                        Tenant

                    </label>

                    <input
                        className="editInput houseDisplay"
                        value={tenant.name}
                        readOnly
                    />

                    <label>

                        House

                    </label>

                    <input
                        className="editInput houseDisplay"
                        value={tenant.houseno}
                        readOnly
                    />

                    <label>

                        Deposit Held

                    </label>

                    <input
                        className="editInput houseDisplay"
                        value={`KES ${depositHeld.toLocaleString("en-GB")}`}
                        readOnly
                    />

                </section>

                <section className="editSection">

                    <h3>

                        Deposit Deductions

                    </h3>

                    {

                        charges.map((charge, index) => (

                            <div
                                key={index}
                                style={{
                                    marginBottom: "20px",
                                    paddingBottom: "20px",
                                    borderBottom: "1px solid rgba(255,255,255,.15)"
                                }}
                            >

                                <label>

                                    Description

                                </label>

                                <input
                                    className="editInput"
                                    value={charge.description}
                                    onChange={(e) =>
                                        updateCharge(
                                            index,
                                            "description",
                                            e.target.value
                                        )
                                    }
                                />

                                <label>

                                    Amount

                                </label>

                                <input
                                    className="editInput"
                                    type="number"
                                    value={charge.amount}
                                    onChange={(e) =>
                                        updateCharge(
                                            index,
                                            "amount",
                                            e.target.value
                                        )
                                    }
                                />

                                {

                                    charges.length > 1 && (

                                        <button
                                            type="button"
                                            className="cancelButton"
                                            style={{
                                                marginTop: "10px"
                                            }}
                                            onClick={() =>
                                                removeCharge(index)
                                            }
                                        >

                                            Remove Charge

                                        </button>

                                    )

                                }

                            </div>

                        ))

                    }

                    <button
                        type="button"
                        className="continueButton"
                        onClick={addCharge}
                    >

                        + Add Charge

                    </button>

                </section>

                <section className="editSection">

                    <h3>

                        Move Out

                    </h3>

                    <label>

                        Move Out Date

                    </label>

                    <input
                        className="editInput"
                        type="date"
                        value={moveOutDate}
                        onChange={(e) =>
                            setMoveOutDate(e.target.value)
                        }
                    />

                </section>

                <section className="editSection">

                    <h3>

                        Settlement Summary

                    </h3>

                    <input
                        className="editInput houseDisplay"
                        value={`Deposit Held: KES ${depositHeld.toLocaleString("en-GB")}`}
                        readOnly
                    />

                    <input
                        className="editInput houseDisplay"
                        value={`Total Charges: KES ${totalCharges.toLocaleString("en-GB")}`}
                        readOnly
                    />

                    <input
                        className="editInput houseDisplay"
                        value={`Refund Due: KES ${refundDue.toLocaleString("en-GB")}`}
                        readOnly
                    />

                    {

                        balanceOwing > 0 && (

                            <input
                                className="editInput houseDisplay"
                                style={{
                                    color: "#ef4444",
                                    fontWeight: "700"
                                }}
                                value={`Tenant Owes: KES ${balanceOwing.toLocaleString("en-GB")}`}
                                readOnly
                            />

                        )

                    }

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

                        Review Settlement

                    </button>

                </div>

            </form>

        </div>

    );

};

export default MoveOutSettlement;