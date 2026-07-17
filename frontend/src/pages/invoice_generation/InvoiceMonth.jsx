import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Heading from "../../components/Heading";
import "./InvoiceMonth.css";


const InvoiceMonth = () => {

    const { month } = useParams();

    const navigate = useNavigate();

    const API_URL = import.meta.env.VITE_API_URL;


    const [invoices, setInvoices] = useState([]);


    useEffect(() => {


        fetch(
            `${API_URL}/invoice-month/${month}`
        )

        .then(res => res.json())

        .then(data => {

            console.log("Invoices:", data);


            if(Array.isArray(data)){

                setInvoices(data);

            }
            else{

                setInvoices([]);

            }

        })

        .catch(err => {

            console.error(err);

            setInvoices([]);

        });


    }, [month,API_URL]);



    const total = invoices.reduce(
        (sum, invoice) =>
            sum + Number(invoice.totalamount || 0),
        0
    );



    const formatMonth = (value) => {


        return new Date(value + "-01")
        .toLocaleDateString(
            "en-GB",
            {
                month:"long",
                year:"numeric"
            }
        );

    };



    return (

        <div className="invoiceMonthPage">


            <Heading />


            <div className="invoiceMonthContainer">


                <h1>
                    {formatMonth(month)} Invoices
                </h1>



                <table className="invoiceMonthTable">


                    <thead>

                        <tr>

                            <th>
                                Invoice ID
                            </th>

                            <th>
                                Tenant
                            </th>

                            <th>
                                House
                            </th>

                            <th>
                                Amount
                            </th>

                            <th>
                                View
                            </th>

                        </tr>


                    </thead>



                    <tbody>


                    {
                        invoices.length === 0 ?

                        (

                            <tr>

                                <td colSpan="5">

                                    No invoices found.

                                </td>

                            </tr>

                        )

                        :

                        (

                        invoices.map(invoice => (

                            <tr
                                key={
                                    invoice.invoiceid
                                }
                            >

                                <td>

                                    {
                                        invoice.invoiceid
                                    }

                                </td>



                                <td>

                                    {
                                        invoice.name
                                    }

                                </td>



                                <td>

                                    {
                                        invoice.houseid
                                    }

                                </td>



                                <td>

                                    KES{" "}

                                    {
                                    Number(
                                        invoice.totalamount
                                    )
                                    .toLocaleString(
                                        undefined,
                                        {
                                        minimumFractionDigits:2,
                                        maximumFractionDigits:2
                                        }
                                    )
                                    }

                                </td>



                                <td>


                                    <button

                                    className="invoiceOpenButton"

                                    onClick={() =>
                                        navigate(
                                        `/invoiceView/${invoice.invoiceid}`
                                        )
                                    }

                                    >

                                        Open

                                    </button>


                                </td>


                            </tr>


                        ))

                        )

                    }



                    <tr className="invoiceTotalRow">


                        <td colSpan="3">

                            Total

                        </td>



                        <td>

                            KES{" "}

                            {
                            total.toLocaleString(
                                undefined,
                                {
                                minimumFractionDigits:2,
                                maximumFractionDigits:2
                                }
                            )
                            }

                        </td>


                        <td></td>


                    </tr>


                    </tbody>


                </table>



            </div>


        </div>


    );

};


export default InvoiceMonth;