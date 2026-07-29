import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Heading from "../../components/Heading";
import "./MoveOutList.css";

const MoveOutList = () => {

    const navigate = useNavigate();

    const [records, setRecords] = useState([]);

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {

        fetch(`${API_URL}/moveout-list`)
            .then(res => res.json())
            .then(setRecords)
            .catch(console.error);

    }, [API_URL]);

    console.log(records);

    return (

        <div id="tenantDashboardPage">

            <Heading />

            <div id="tenantDashboard">

                <h1>Move Out History</h1>

                <div id="tenantDashboardTable">

                    <table>

                        <thead>

                            <tr>
                                <th>Tenant</th>
                                <th>House</th>
                                <th>Move Out</th>
                                <th>Deposit</th>
                                <th>Charges</th>
                                <th>Refund</th>
                                <th>Balance Owing</th>
                                <th></th>
                            </tr>

                        </thead>

                        <tbody>

                            {records.map(record => (

                                <tr key={record.moveoutid}>

                                    <td>{record.name}</td>
                                    <td>{record.houseno}</td>
                                    <td>{record.moveoutdate}</td>

                                    <td>
                                        KES {Number(record.depositheld).toLocaleString(
                                            "en-GB",
                                            {
                                                minimumFractionDigits:2,
                                                maximumFractionDigits:2
                                            }
                                        )}
                                    </td>

                                    <td>
                                        KES {Number(record.totalcharges).toLocaleString(
                                            "en-GB",
                                            {
                                                minimumFractionDigits:2,
                                                maximumFractionDigits:2
                                            }
                                        )}
                                    </td>

                                    <td
                                        style={{
                                            color:"#16a34a",
                                            fontWeight:"700"
                                        }}
                                    >
                                        KES {Number(record.refunddue).toLocaleString(
                                            "en-GB",
                                            {
                                                minimumFractionDigits:2,
                                                maximumFractionDigits:2
                                            }
                                        )}
                                    </td>

                                    <td
                                        style={{
                                            color:
                                                Number(record.balanceowing) > 0
                                                    ? "#dc2626"
                                                    : "#16a34a",
                                            fontWeight:"700"
                                        }}
                                    >
                                        KES {Number(record.balanceowing).toLocaleString(
                                            "en-GB",
                                            {
                                                minimumFractionDigits:2,
                                                maximumFractionDigits:2
                                            }
                                        )}
                                    </td>

                                    <td>

                                        <button
                                            className="viewMonthBtn"
                                            onClick={() =>
                                                navigate(`/MoveOutView/${record.moveoutid}`)
                                            }
                                        >
                                            View
                                        </button>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

};

export default MoveOutList;