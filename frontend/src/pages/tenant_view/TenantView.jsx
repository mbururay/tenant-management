import Heading from "../../components/Heading";
import "./tenantView.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const TenantView = () => {

  const [tenants, setTenants] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();


  useEffect(() => {

    fetch(`${API_URL}/tenant-dashboard`)
      .then(res => res.json())
      .then(data => setTenants(data))
      .catch(err => console.error(err));

  }, [API_URL]);



  return (

    <div className="tenantViewPage">

      <Heading />


      <div className="tenantViewContainer">


        <h1 className="tenantViewTitle">
          Tenant View
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


            {
              tenants.map((t) => (

                <tr

                  key={t.tenantid}

                  onClick={() =>
                    navigate(`/tenant-statement/${t.tenantid}`)
                  }

                  style={{
                    cursor:"pointer"
                  }}

                >


                  <td>
                    {t.name}
                  </td>



                  <td>

                    {
                      Array.isArray(t.phone)
                      ?
                      t.phone.join(", ")
                      :
                      t.phone
                    }

                  </td>



                  <td>
                    {t.houseno}
                  </td>



                  <td

                    style={{
                      color:
                        Number(t.openingbalance) > 0
                        ? "#dc2626"
                        : "#16a34a",

                      fontWeight:"600"
                    }}

                  >

                    {
                      Number(t.openingbalance)
                      .toLocaleString(
                        "en-GB",
                        {
                          minimumFractionDigits:2,
                          maximumFractionDigits:2
                        }
                      )
                    }

                  </td>



                  <td

                    style={{
                      color:
                        Number(t.balance) > 0
                        ? "#dc2626"
                        : "#16a34a",

                      fontWeight:"600"
                    }}

                  >

                    {
                      Number(t.balance)
                      .toLocaleString(
                        "en-GB",
                        {
                          minimumFractionDigits:2,
                          maximumFractionDigits:2
                        }
                      )
                    }

                  </td>



                </tr>

              ))
            }


            </tbody>


          </table>


        </div>


      </div>


    </div>

  );

};


export default TenantView;