import { useEffect, useState } from "react";
import Heading from "../../components/Heading";
import "./TenantDashboard.css";

const TenantDashboard = () => {

    const [payments, setPayments] = useState([]);

    useEffect(() => {

        fetch("http://localhost:3001/house-pivot")
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setPayments(data);
            })
            .catch(err => console.error(err));

    }, []);

    // Get all unique houses
    const houses = [...new Set(payments.map(p => p.houseno))];

    // Get all unique months
    const months = [...new Set(payments.map(p => p.month))];

    const formatMonth = (month) => {

        if (!month) return "";

        return new Date(month).toLocaleDateString("en-GB", {
            month: "long",
            year: "numeric"
        });

    };



    return (

        <div id="tenantDashboardPage">

            <Heading />

            <div id="tenantDashboard">

                <h1>Tenant Dashboard</h1>

                <div id="tenantDashboardTable">

                    <table>

                        <thead>
                            <tr>
                                <th>Month</th>

                                {houses.map(house => (
                                    <th key={house}>{house}</th>
                                ))}

                                <th>Total</th>
                            </tr>
                        </thead>

                        <tbody>

    {months.map(month => {

        const monthTotal = payments
            .filter(p => p.month === month)
            .reduce((sum, p) => sum + Number(p.total), 0);

        return (

            <tr key={month}>

                <td>{formatMonth(month)}</td>

                {houses.map(house => {

                    const payment = payments.find(
                        p =>
                            p.month === month &&
                            p.houseno === house
                    );

                    return (

                        <td key={`${month}-${house}`}>

                            {payment
                                ? Number(payment.total).toLocaleString(undefined, {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2
                                  })
                                : "-"}

                        </td>

                    );

                })}

                        <td style={{ fontWeight: "bold" }}>
                            {monthTotal.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}
                        </td>

                    </tr>

                );

            })}

            <tr>

                <th>House Total</th>

                {houses.map(house => {

                    const houseTotal = payments
                        .filter(p => p.houseno === house)
                        .reduce((sum, p) => sum + Number(p.total), 0);

                    return (

                        <th key={house}>

                            {houseTotal.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}

                        </th>

                    );

                })}

                <th>

                    {payments
                        .reduce((sum, p) => sum + Number(p.total), 0)
                        .toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}

                </th>

            </tr>

        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

};

export default TenantDashboard;