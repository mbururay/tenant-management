import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Heading from "../../components/Heading";
import "./DisplayBillMonth.css";

const DisplayBillMonth = () => {

    const { month } = useParams();

    const navigate = useNavigate();

    const [bills, setBills] = useState([]);

    const API_URL = import.meta.env.VITE_API_URL;


    useEffect(() => {

        fetch(
            `${API_URL}/bill-month/${month}`
        )
        .then(res => res.json())
        .then(data => {

            console.log("Fetched bills:", data);

            setBills(data);

        })
        .catch(err => console.error(err));

    }, [month, API_URL]);



    const total = bills.reduce(
        (sum, bill) =>
            sum + Number(bill.amount),
        0
    );



    const formatMonth = (monthString) => {

        if (!monthString) return "";

        const [year, month] =
            monthString.split("-");

        return new Date(
            Number(year),
            Number(month) - 1
        ).toLocaleDateString(
            "en-GB",
            {
                month:"long",
                year:"numeric"
            }
        );

    };



    return (

        <div className="billMonthPage">

            <Heading />


            <div className="billMonthContainer">


                <h1>
                    Landlord Bills
                </h1>


                <h2>
                    {formatMonth(month)}
                </h2>



                <h3
                    style={{
                        textAlign:"center",
                        marginBottom:"20px",
                        color:"#dc2626"
                    }}
                >
                    Bills Found: {bills.length}
                </h3>



                <table className="billMonthTable">


                    <thead>

                        <tr>

                            <th>
                                Category
                            </th>


                            <th>
                                Description
                            </th>


                            <th>
                                Amount (KES)
                            </th>


                            <th>
                                Status
                            </th>


                        </tr>

                    </thead>



                    <tbody>


                    {
                        bills.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="4"
                                    style={{
                                        textAlign:"center",
                                        padding:"30px"
                                    }}
                                >
                                    No bills found for this month.
                                </td>

                            </tr>


                        ) : (


                            bills.map((bill) => (


                                <tr key={bill.billid}>


                                    <td>
                                        {bill.category}
                                    </td>



                                    <td>
                                        {bill.description}
                                    </td>



                                    <td>

                                        {Number(
                                            bill.amount
                                        ).toLocaleString(
                                            "en-GB",
                                            {
                                                minimumFractionDigits:2,
                                                maximumFractionDigits:2
                                            }
                                        )}

                                    </td>



                                    <td>

                                        <span
                                            className={
                                                bill.status === "PAID"
                                                ?
                                                "paidStatus"
                                                :
                                                "unpaidStatus"
                                            }
                                        >

                                            {bill.status}

                                        </span>

                                    </td>


                                </tr>


                            ))

                        )

                    }



                    {
                        bills.length > 0 && (

                            <tr className="totalRow">


                                <td colSpan="2">

                                    Total

                                </td>


                                <td colSpan="2">


                                    {total.toLocaleString(
                                        "en-GB",
                                        {
                                            minimumFractionDigits:2,
                                            maximumFractionDigits:2
                                        }
                                    )}


                                </td>


                            </tr>

                        )
                    }


                    </tbody>


                </table>



                <button
                    className="backButton"
                    onClick={() => navigate(-1)}
                >

                    Back

                </button>



            </div>


        </div>

    );

};


export default DisplayBillMonth;