import { useNavigate } from "react-router-dom";
import Heading from "../../components/Heading";
import "./TenantTables.css";


const TenantTables = () => {

    const navigate = useNavigate();

    return (

        <div className="tenantTablesPage">

            <Heading />


            <div className="tenantTablesContent">


                <div className="tenantTablesCard">


                    <h1 className="tenantTablesTitle">
                        Tenant Tables
                    </h1>


                    <p className="tenantTablesSubtitle">
                        Select your desired action
                    </p>


                    <div className="tenantTablesButtonSet">


                        <button
                            className="tenantTablesButton"
                            onClick={() => navigate("/TenantView")}
                        >
                            Tenant View
                        </button>


                        <button
                            className="tenantTablesButton"
                            onClick={() => navigate("/TenantDashboard")}
                        >
                            House Pivot Table
                        </button>


                    </div>


                </div>


            </div>


        </div>

    );

};


export default TenantTables;