import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Heading from "../../components/Heading";

const DisplayBills = () => {

    const navigate = useNavigate();

    const [bills, setBills] = useState([]);

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {

        fetch(`${API_URL}/bill-pivot`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setBills(data);
            })
            .catch(err => console.error(err));

    }, [API_URL]);

    const categories = [
        "Water",
        "Security",
        "Cleaning",
        "Garbage",
        "Electricity",
        "Plumbing",
        "Repairs",
        "Supplies"
    ];

    const months = [
        ...new Set(
            bills.map(b => b.month)
        )
    ];

    console.log("Months:", months);

    const formatMonth = (monthString) => {

        const [year, month] =
            monthString.split("-");

        return new Date(
            Number(year),
            Number(month) - 1
        ).toLocaleDateString(
            "en-GB",
            {
                month: "long",
                year: "numeric"
            }
        );

    };

    return (

        <div id="tenantDashboardPage">

            <Heading />

            <div id="tenantDashboard">

                <h1>Landlord Bills</h1>

                <div id="tenantDashboardTable">

                    <table>

                        <thead>

                            <tr>

                                <th>Month</th>

                                {categories.map(category => (

                                    <th key={category}>
                                        {category}
                                    </th>

                                ))}

                                <th>Total</th>

                                <th>Details</th>

                            </tr>

                        </thead>

                        <tbody>

                            {months.map(month => {

                                const rowTotal = bills
                                    .filter(
                                        b => b.month === month
                                    )
                                    .reduce(
                                        (sum, b) =>
                                            sum +
                                            Number(b.amount),
                                        0
                                    );

                                return (

                                    <tr key={month}>

                                        <td>
                                            {formatMonth(month)}
                                        </td>

                                        {categories.map(category => {

                                            const bill =
                                                bills.find(
                                                    b =>
                                                        b.month === month &&
                                                        b.category === category
                                                );

                                            return (

                                                <td
                                                    key={`${month}-${category}`}
                                                >

                                                    {bill
                                                        ? Number(
                                                              bill.amount
                                                          ).toLocaleString(
                                                              undefined,
                                                              {
                                                                  minimumFractionDigits: 2,
                                                                  maximumFractionDigits: 2
                                                              }
                                                          )
                                                        : "-"}

                                                </td>

                                            );

                                        })}

                                        <td
                                            style={{
                                                fontWeight: "bold"
                                            }}
                                        >

                                            {rowTotal.toLocaleString(
                                                undefined,
                                                {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                }
                                            )}

                                        </td>

                                        <td>

                                            <button
                                                className="viewMonthBtn"
                                                onClick={() =>
                                                    navigate(
                                                        `/DisplayBillsMonth/${month}`
                                                    )
                                                }
                                            >
                                                View
                                            </button>

                                            <button
                                                className="editMonthBtn"
                                                onClick={() =>
                                                    navigate(
                                                        `/ModifyBill/${month}`
                                                    )
                                                }
                                            >
                                                Edit
                                            </button>

                                        </td>

                                    </tr>

                                );

                            })}

                            <tr>

                                <th>
                                    Category Total
                                </th>

                                {categories.map(category => {

                                    const categoryTotal =
                                        bills
                                            .filter(
                                                b =>
                                                    b.category === category
                                            )
                                            .reduce(
                                                (sum, b) =>
                                                    sum +
                                                    Number(
                                                        b.amount
                                                    ),
                                                0
                                            );

                                    return (

                                        <th key={category}>

                                            {categoryTotal.toLocaleString(
                                                undefined,
                                                {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                }
                                            )}

                                        </th>

                                    );

                                })}

                                <th>

                                    {bills
                                        .reduce(
                                            (sum, b) =>
                                                sum +
                                                Number(
                                                    b.amount
                                                ),
                                            0
                                        )
                                        .toLocaleString(
                                            undefined,
                                            {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            }
                                        )}

                                </th>

                                <th></th>

                            </tr>

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

};

export default DisplayBills;