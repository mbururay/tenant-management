import Heading from "../../components/Heading";
import "./tenantView.css";

import { useEffect, useState } from "react";

const TenantView = () => {

  const [tenants, setTenants] = useState([]);

  useEffect(() => {

    fetch("http://localhost:3001/tenant-dashboard")
      .then(res => res.json())
      .then(data => setTenants(data));

  }, []);

  return (

    <div className="tenantViewPage">

      <Heading />

      <div className="tenantViewContainer">

        <h1 className="tenantViewTitle">
          Tenant Dashboard
        </h1>

        <div className="tenantViewTableContainer">

          <table className="tenantViewTable">

            <thead>

              <tr>

                <th>Name</th>
                <th>Phone(s)</th>
                <th>House</th>
                <th>Balance</th>

              </tr>

            </thead>

            <tbody>

              {tenants.map((t) => (

                <tr key={t.tenantid}>

                  <td>{t.name}</td>

                  <td>
                    {Array.isArray(t.phone)
                      ? t.phone.join(", ")
                      : t.phone}
                  </td>

                  <td>{t.houseno}</td>

                  <td
                    style={{
                      color: Number(t.balance) > 0 ? "#dc2626" : "#16a34a",
                      fontWeight: "600"
                    }}
                  >
                    {Number(t.balance).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
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

export default TenantView;





