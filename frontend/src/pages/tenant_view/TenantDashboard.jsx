import { useEffect, useState } from "react";
import Heading from "../../components/Heading";
import "./TenantDashboard.css";

const TenantDashboard = () => {

    const [payments, setPayments] = useState([]);
    const [statement, setStatement] = useState([]);
    const [selectedTenant, setSelectedTenant] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL;


    useEffect(() => {

        fetch(`${API_URL}/house-pivot`)
            .then(res => res.json())
            .then(data => {

                console.log(data);

                setPayments(data);

            })
            .catch(err => console.error(err));

    }, [API_URL]);



    const houses = [
        ...new Set(
            payments.map(p => p.houseno)
        )
    ];


    const months = [
        ...new Set(
            payments.map(p => p.month)
        )
    ];



    const formatMonth = (month) => {

        if (!month) return "";

        return new Date(month).toLocaleDateString(
            "en-GB",
            {
                month: "long",
                year: "numeric"
            }
        );

    };



    const openStatement = async (tenantId) => {

        try {

            const res = await fetch(
                `${API_URL}/tenant-statement/${tenantId}`
            );


            const data = await res.json();


            setStatement(data);

            setSelectedTenant(tenantId);


        } catch(err) {

            console.error(err);

        }

    };



    return (

        <div id="tenantDashboardPage">

            <Heading />


            <div id="tenantDashboard">


                <h1>
                    Tenant Dashboard
                </h1>



                <div id="tenantDashboardTable">


                    <table>


                        <thead>

                            <tr>

                                <th>
                                    Month
                                </th>


                                {
                                    houses.map(house => (

                                        <th key={house}>
                                            {house}
                                        </th>

                                    ))
                                }


                                <th>
                                    Total
                                </th>


                            </tr>

                        </thead>



                        <tbody>


                        {
                            months.map(month => {


                                const monthTotal = payments
                                    .filter(
                                        p => p.month === month
                                    )
                                    .reduce(
                                        (sum,p) =>
                                            sum + Number(p.total),
                                        0
                                    );



                                return (

                                    <tr key={month}>


                                        <td>

                                            {formatMonth(month)}

                                        </td>



                                        {
                                            houses.map(house => {


                                                const payment =
                                                    payments.find(
                                                        p =>
                                                            p.month === month &&
                                                            p.houseno === house
                                                    );



                                                return (

                                                    <td

                                                        key={`${month}-${house}`}


                                                        onClick={() =>
                                                            payment &&
                                                            openStatement(
                                                                payment.tenantid
                                                            )
                                                        }


                                                        style={{
                                                            cursor:
                                                                payment
                                                                    ? "pointer"
                                                                    : "default"
                                                        }}

                                                    >


                                                        {
                                                            payment

                                                            ?

                                                            Number(
                                                                payment.total
                                                            )
                                                            .toLocaleString(
                                                                undefined,
                                                                {
                                                                    minimumFractionDigits:2,
                                                                    maximumFractionDigits:2
                                                                }
                                                            )

                                                            :

                                                            "-"

                                                        }


                                                    </td>

                                                );


                                            })
                                        }



                                        <td
                                            style={{
                                                fontWeight:"bold"
                                            }}
                                        >

                                            {
                                                monthTotal.toLocaleString(
                                                    undefined,
                                                    {
                                                        minimumFractionDigits:2,
                                                        maximumFractionDigits:2
                                                    }
                                                )
                                            }

                                        </td>


                                    </tr>

                                );


                            })
                        }



                        <tr>


                            <th>
                                House Total
                            </th>



                            {
                                houses.map(house => {


                                    const houseTotal =
                                        payments
                                        .filter(
                                            p => p.houseno === house
                                        )
                                        .reduce(
                                            (sum,p) =>
                                                sum + Number(p.total),
                                            0
                                        );



                                    return (

                                        <th key={house}>

                                            {
                                                houseTotal.toLocaleString(
                                                    undefined,
                                                    {
                                                        minimumFractionDigits:2,
                                                        maximumFractionDigits:2
                                                    }
                                                )
                                            }

                                        </th>

                                    );


                                })
                            }



                            <th>

                                {
                                    payments
                                    .reduce(
                                        (sum,p) =>
                                            sum + Number(p.total),
                                        0
                                    )
                                    .toLocaleString(
                                        undefined,
                                        {
                                            minimumFractionDigits:2,
                                            maximumFractionDigits:2
                                        }
                                    )
                                }

                            </th>


                        </tr>



                        </tbody>


                    </table>


                </div>





                {
                    selectedTenant && (

                        <div className="statementModal">


                            <div className="statementCard">


                                <h2>
                                    Tenant Statement
                                </h2>



                                <table>


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
                                                Amount
                                            </th>

                                            <th>
                                                Balance
                                            </th>


                                        </tr>

                                    </thead>



                                    <tbody>


                                    {
                                        statement.map((s,index)=>(


                                            <tr key={index}>


                                                <td>

                                                    {
                                                        new Date(
                                                            s.date
                                                        )
                                                        .toLocaleDateString()
                                                    }

                                                </td>



                                                <td>
                                                    {s.type}
                                                </td>



                                                <td>
                                                    {s.description}
                                                </td>



                                                <td>

                                                    {
                                                        Number(
                                                            s.amount
                                                        )
                                                        .toLocaleString()
                                                    }

                                                </td>



                                                <td>

                                                    {
                                                        Number(
                                                            s.balance
                                                        )
                                                        .toLocaleString()
                                                    }

                                                </td>



                                            </tr>


                                        ))
                                    }


                                    </tbody>


                                </table>



                                <button
                                    onClick={() =>
                                        setSelectedTenant(null)
                                    }
                                >

                                    Close

                                </button>


                            </div>


                        </div>

                    )
                }



            </div>


        </div>

    );

};


export default TenantDashboard;