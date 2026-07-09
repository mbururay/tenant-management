import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Heading from "../../components/Heading";
import "../tenant_records/ModifyTenant.css";

const ModifyBill = () => {

    const { month } = useParams();

    const navigate = useNavigate();

    const [originalBills, setOriginalBills] =
        useState(null);

    const [formData, setFormData] =
        useState([]);

    useEffect(() => {

        fetch(
            `http://localhost:3001/bill-month/${month}`
        )
            .then(res => res.json())
            .then(data => {

                setOriginalBills(data);

                setFormData(
                    data.map(bill => ({
                        ...bill
                    }))
                );

            })
            .catch(err => {

                console.error(err);

                alert(
                    "Unable to load bills."
                );

            });

    }, [month]);

    const handleChange = (
        index,
        field,
        value
    ) => {

        const updatedBills =
            [...formData];

        updatedBills[index] = {

            ...updatedBills[index],

            [field]: value

        };

        setFormData(updatedBills);

    };

    const handleSubmit = (e) => {

        e.preventDefault();

        navigate(
            "/ModifyBillConfirm",
            {
                state: {

                    month,

                    original:
                        originalBills,

                    updated:
                        formData

                }
            }
        );

    };

    if (!originalBills) {

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
                    Loading bills...
                </h2>

            </div>

        );

    }

    return (

        <div className="editTenantPage">

            <Heading />

            <h1 className="editTenantTitle">
                Modify Monthly Bills
            </h1>

            <form
                className="editTenantForm"
                onSubmit={handleSubmit}
            >

                <section className="editSection">

                    <h3>

                        Bills for {month}

                    </h3>

                    {formData.map(
                        (bill, index) => (

                            <div
                                key={
                                    bill.billid
                                }
                                style={{
                                    marginBottom:
                                        "30px"
                                }}
                            >

                                <label>
                                    Category
                                </label>

                                <input
                                    className="editInput houseDisplay"
                                    value={
                                        bill.category
                                    }
                                    readOnly
                                />

                                <label>
                                    Description
                                </label>

                                <input
                                    className="editInput"
                                    value={
                                        bill.description
                                    }
                                    onChange={
                                        (
                                            e
                                        ) =>
                                            handleChange(
                                                index,
                                                "description",
                                                e
                                                    .target
                                                    .value
                                            )
                                    }
                                />

                                <label>
                                    Amount
                                    (KES)
                                </label>

                                <input
                                    className="editInput"
                                    type="number"
                                    value={
                                        bill.amount
                                    }
                                    onChange={
                                        (
                                            e
                                        ) =>
                                            handleChange(
                                                index,
                                                "amount",
                                                e
                                                    .target
                                                    .value
                                            )
                                    }
                                />

                            </div>

                        )
                    )}

                </section>

                <div className="buttonRow">

                    <button
                        type="button"
                        className="cancelButton"
                        onClick={() =>
                            navigate(-1)
                        }
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="continueButton"
                    >
                        Review Changes
                    </button>

                </div>

            </form>

        </div>

    );

};

export default ModifyBill;