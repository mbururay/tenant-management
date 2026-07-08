import { useNavigate } from "react-router-dom";
import Heading from "../../components/Heading";
import "../water_records/WaterRecords.css";


const TenantTables = () => {
  const navigate = useNavigate();

  return (
    <div className="modifyWaterPage">
      <Heading />

      <div className="modifyWaterCard">

        <h1 className="modifyWaterTitle">
          Tenant Tables
        </h1>

        <h2 className="modifyWaterSubtitle">
          Select your desired action
        </h2>

        <div className="modifyWaterButtonSet">

            <button
                className="updateWaterButton"
                onClick={() => navigate("/TenantView")}
            >
            Tenant View
            </button>

          <button
                className="modifyWaterButton"
                onClick={() => navigate("/TenantDashboard")}
            >
            House Pivot Table
          </button>


        </div>

      </div>
    </div>
  );
};

export default TenantTables;