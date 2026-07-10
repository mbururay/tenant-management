import { useEffect, useState } from "react";
import Heading from "../../components/Heading";
import "./PaymentView.css";

const PaymentView = () => {

    const [payments, setPayments] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {

        fetch("http://localhost:3001/payments")
            .then(res => res.json())
            .then(data => setPayments(data))
            .catch(console.error);

    }, []);

    const filteredPayments = payments.filter(payment => {

        const term = search.toLowerCase();

        return (
            payment.tenant?.toLowerCase().includes(term) ||
            payment.houseno?.toLowerCase().includes(term) ||
            payment.confirmationcode?.toLowerCase().includes(term)
        );

    });

    return (

        <div id="paymentViewPage">

            <Heading />

            <div id="paymentView">

                <h1>
                    Payment Records
                </h1>

                <div className="paymentSearchBar">

                    <input
                        type="text"
                        placeholder="Search by tenant, house number or confirmation code..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                </div>

                <div id="paymentViewTable">

                    <table>

                        <thead>

                            <tr>

                                <th>Payment ID</th>

                                <th>Tenant</th>

                                <th>House</th>

                                <th>Date</th>

                                <th>Amount (KES)</th>

                                <th>Method</th>

                                <th>Confirmation Code</th>

                            </tr>

                        </thead>

                        <tbody>

                            {filteredPayments.length > 0 ? (

                                filteredPayments.map(payment => (

                                    <tr key={payment.payid}>

                                        <td>
                                            {payment.payid}
                                        </td>

                                        <td>
                                            {payment.tenant}
                                        </td>

                                        <td>
                                            {payment.houseno}
                                        </td>

                                        <td>
                                            {new Date(
                                                payment.paydate
                                            ).toLocaleDateString()}
                                        </td>

                                        <td>

                                            {Number(
                                                payment.payamount
                                            ).toLocaleString(undefined, {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            })}

                                        </td>

                                        <td>
                                            {payment.paymentmethod}
                                        </td>

                                        <td>
                                            {payment.confirmationcode || "-"}
                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="noResults"
                                    >
                                        No matching payments found.
                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

};

export default PaymentView;