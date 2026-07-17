import { useEffect, useState } from "react";
import "./DashboardSummary.css";

const DashboardSummary = () => {

    const [stats, setStats] = useState({
        occupiedUnits: 0,
        vacantUnits: 0,
        paymentsReceived: 0,
        outstandingArrears: 0
    });

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {

        fetch(
            `${API_URL}/dashboard-summary`
        )
            .then(res => res.json())
            .then(data => {

                setStats(data);

            })
            .catch(err => {

                console.error(err);

            });

    }, [API_URL]);

    return (

        <div className="summaryContainer">

            <div className="summaryCard">

                <div className="summaryLabel">

                    Occupied Units

                </div>

                <div className="summaryValue">

                    {stats.occupiedUnits}

                </div>

            </div>

            <div className="summaryCard">

                <div className="summaryLabel">

                    Vacant Units

                </div>

                <div className="summaryValue">

                    {stats.vacantUnits}

                </div>

            </div>

            <div className="summaryCard">

                <div className="summaryLabel">

                    Payments Received

                </div>

                <div className="summaryValue">

                    KES{" "}

                    {Number(
                        stats.paymentsReceived
                    ).toLocaleString()}

                </div>

            </div>

            <div className="summaryCard">

                <div className="summaryLabel">

                    Outstanding Arrears

                </div>

                <div className="summaryValue arrears">

                    KES{" "}

                    {Number(
                        stats.outstandingArrears
                    ).toLocaleString()}

                </div>

            </div>

        </div>

    );

};

export default DashboardSummary;