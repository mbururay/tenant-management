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
    <div id="mainPage">
      <Heading />
      <h1>Tenant Dashboard</h1>

      <table>
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

              {/* SAFE PHONE DISPLAY */}
              <td>
                {Array.isArray(t.phone)
                  ? t.phone.join(", ")
                  : t.phone}
              </td>

              <td>{t.houseno}</td>

              <td
                style={{
                  color: t.balance > 0 ? "red" : "green"
                }}
              >
                {t.balance}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TenantView;







