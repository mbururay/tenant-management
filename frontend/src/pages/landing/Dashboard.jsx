import "./Dashboard.css";
import Heading from "../../components/Heading";
import DashboardSummary from "./DashboardSummary.jsx";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {

    const navigate = useNavigate();

    return (

        <div className="dashboardPage">

            <Heading />

            <div className="dashboardHero">

                <h1>
                    Serene Homes
                </h1>

                <p>
                    Property Management System
                </p>

            </div>

            <DashboardSummary />

            <div className="dashboardGrid">

                <div
                    className="dashboardCard"
                    onClick={() => navigate("/TenantRecords")}
                >
                    <h2>🏠</h2>

                    <h3>
                        Tenants
                    </h3>

                    <p>
                        Manage tenant records
                    </p>

                </div>

                <div
                    className="dashboardCard"
                    onClick={() => navigate("/WaterRecords")}
                >
                    <h2>💧</h2>

                    <h3>
                        Water
                    </h3>

                    <p>
                        Meter readings & usage
                    </p>

                </div>

                <div
                    className="dashboardCard"
                    onClick={() => navigate("/InvoiceList")}
                >
                    <h2>📄</h2>

                    <h3>
                        Invoices
                    </h3>

                    <p>
                        Generate and review invoices
                    </p>

                </div>

                <div
                    className="dashboardCard"
                    onClick={() => navigate("/PaymentRecords")}
                >
                    <h2>💰</h2>

                    <h3>
                        Payments
                    </h3>

                    <p>
                        Payment history & receipts
                    </p>

                </div>

                <div
                    className="dashboardCard"
                    onClick={() => navigate("/DisplayBills")}
                >
                    <h2>📊</h2>

                    <h3>
                        Landlord Bills
                    </h3>

                    <p>
                        Monthly expenses
                    </p>

                </div>

                <div
                    className="dashboardCard"
                    onClick={() => navigate("/TenantDashboard")}
                >
                    <h2>📈</h2>

                    <h3>
                        Reports
                    </h3>

                    <p>
                        Occupancy & analytics
                    </p>

                </div>

            </div>

        </div>

    );

};

export default Dashboard;