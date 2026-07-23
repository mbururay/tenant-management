import Heading from "../../components/Heading";
import "./tenantView.css";

import { useEffect, useState } from "react";

const TenantView = () => {

  const [tenants, setTenants] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {

    fetch(`${API_URL}/tenant-dashboard`)
      .then(res => res.json())
      .then(data => setTenants(data));

  }, [API_URL]);

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
                <th>Opening Balance</th>
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
                      color: Number(t.openingbalance) > 0 ? "#dc2626" : "#16a34a",
                      fontWeight: "600"
                    }}
                  >
                    {Number(t.openingbalance).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </td>

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





