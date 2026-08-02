import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Heading from "../../components/Heading";
import { authHeaders } from "../../api";
import "./TenantStatement.css";


const TenantStatement = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const API_URL = import.meta.env.VITE_API_URL;


    const [data, setData] = useState(null);



    useEffect(() => {

        const fetchStatement = async () => {

            try {

                const res = await fetch(
                    `${API_URL}/tenant-statement/${id}`,
                    {
                        headers: authHeaders()
                    }
                );


                const result = await res.json();


                if (!res.ok) {

                    alert(result.error);

                    return;

                }


                setData(result);


            } catch(err) {

                console.error(err);

            }

        };


        fetchStatement();


    }, [API_URL, id]);




    if (!data) {

        return (

            <div>

                <Heading />

                <h2>
                    Loading statement...
                </h2>

            </div>

        );

    }



    const formatMoney = (amount) => {

        return Number(amount || 0)
            .toLocaleString(
                "en-GB",
                {
                    minimumFractionDigits:2,
                    maximumFractionDigits:2
                }
            );

    };



    return (

        <div className="tenantStatementPage">


            <Heading />



            <div className="tenantStatementContainer">



                <button
                    className="backButton"
                    onClick={() => navigate(-1)}
                >

                    ← Back

                </button>




                <div className="tenantStatementHeader">


                    <h1>
                        Tenant Statement
                    </h1>


                    <h2>
                        {data.tenant.name}
                    </h2>


                    <p>
                        House: {data.tenant.house}
                    </p>


                    <p>
                        Phone: {data.tenant.phone}
                    </p>


                </div>






                <div
                    className="balanceCard"
                    style={{
                        background:
                            Number(data.summary.balance) > 0
                            ? "#fee2e2"
                            : "#dcfce7"
                    }}
                >

                    <h3>
                        {
                            Number(data.summary.balance) > 0
                            ? "Outstanding Balance"
                            : "Tenant Credit"
                        }
                    </h3>


                    <h1
                        style={{
                            color:
                                Number(data.summary.balance) > 0
                                ? "#dc2626"
                                : "#16a34a"
                        }}
                    >

                        KES {
                            formatMoney(
                                Math.abs(data.summary.balance)
                            )
                        }

                    </h1>


                    <p>

                        {
                            Number(data.summary.balance) > 0

                            ?

                            "Amount owed by tenant"

                            :

                            "Amount available as credit"

                        }

                    </p>


                </div>







                <div className="summaryCards">


                    <div className="summaryCard">

                        <h3>
                            Opening Balance
                        </h3>

                        <p>
                            KES {formatMoney(
                                data.summary.openingBalance
                            )}
                        </p>

                    </div>





                    <div className="summaryCard">

                        <h3>
                            Total Charges
                        </h3>

                        <p>
                            KES {formatMoney(
                                data.summary.charges
                            )}
                        </p>

                    </div>





                    <div className="summaryCard">

                        <h3>
                            Total Payments
                        </h3>

                        <p>
                            KES {formatMoney(
                                data.summary.payments
                            )}
                        </p>

                    </div>



                </div>








                <div className="transactionSection">


                    <h2>
                        Transaction History
                    </h2>




                    <table className="statementTable">


                        <thead>

                            <tr>

                                <th>
                                    Date
                                </th>


                                <th>
                                    Type
                                </th>


                                <th>
                                    Description
                                </th>


                                <th>
                                    Debit
                                </th>


                                <th>
                                    Credit
                                </th>


                                <th>
                                    Balance
                                </th>


                            </tr>


                        </thead>





                        <tbody>


                        {
                            data.transactions.map(
                                (t,index)=>(


                                <tr key={index}>


                                    <td>

                                        {
                                            new Date(
                                                t.date
                                            )
                                            .toLocaleDateString(
                                                "en-GB"
                                            )
                                        }

                                    </td>



                                    <td>

                                        {t.type}

                                    </td>



                                    <td>

                                        {t.description}

                                    </td>



                                    <td>

                                        {
                                            t.debit > 0

                                            ?

                                            `KES ${formatMoney(
                                                t.debit
                                            )}`

                                            :

                                            "-"

                                        }

                                    </td>




                                    <td>

                                        {
                                            t.credit > 0

                                            ?

                                            `KES ${formatMoney(
                                                t.credit
                                            )}`

                                            :

                                            "-"

                                        }

                                    </td>





                                    <td>

                                        {
                                            `KES ${formatMoney(
                                                t.balance
                                            )}`
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


export default TenantStatement;