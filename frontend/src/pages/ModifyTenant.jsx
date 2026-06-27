import { useNavigate } from "react-router-dom";
import Heading from "../components/Heading";
import "./ModifyTenant.css";

const ModifyTenant = () => {
  const navigate = useNavigate();

  return (
    <div className="modifyTenantPage">
      <Heading />

      <div className="modifyTenantCard">

        <h1 className="modifyTenantTitle">
          Modify Tenant
        </h1>

        <h2 className="modifyTenantSubtitle">
          Select your desired action
        </h2>

        <div className="modifyTenantButtonSet">

          <button
            className="modifyTenantButton"
            onClick={() => navigate("/AddTenant")}
          >
            Add Tenant
          </button>

          <button
            className="modifyTenantButton"
            onClick={() => navigate("/AddTenant")}
          >
            Change Tenant Records
          </button>

          <button
            className="modifyTenantButton"
            onClick={() => navigate("/MoveOutTenant")}
          >
            Remove Tenant
          </button>

        </div>

      </div>
    </div>
  );
};

export default ModifyTenant;