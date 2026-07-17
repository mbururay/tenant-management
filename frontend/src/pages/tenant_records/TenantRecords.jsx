import { useNavigate } from "react-router-dom";
import Heading from "../../components/Heading";
import "./TenantRecords.css";


const TenantRecords = () => {

    const navigate = useNavigate();

    return (

        <div className="tenantRecordsPage">

            <Heading />


            <div className="tenantRecordsContent">


                <div className="tenantRecordsCard">


                    <h1 className="tenantRecordsTitle">
                        Tenant Records
                    </h1>


                    <p className="tenantRecordsSubtitle">
                        Select your desired action
                    </p>


                    <div className="tenantRecordsButtonSet">


                        <button
                            className="tenantRecordsButton"
                            onClick={() => navigate("/AddTenant")}
                        >
                            Add Tenant
                        </button>


                        <button
                            className="tenantRecordsButton"
                            onClick={() => navigate("/SearchTenant")}
                        >
                            Modify Tenant Records
                        </button>


                        <button
                            className="tenantRecordsButton"
                            onClick={() => navigate("/MoveOutTenant")}
                        >
                            Remove Tenant
                        </button>


                    </div>


                </div>


            </div>


        </div>

    );

};


export default TenantRecords;