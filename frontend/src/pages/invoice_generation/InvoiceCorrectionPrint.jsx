import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./InvoiceCorrectionPrint.css";

const InvoiceCorrectionPrint = () => {

    const { id } = useParams();

    const [correction, setCorrection] = useState(null);


    useEffect(() => {

        fetch(`http://localhost:3001/invoice-correction/${id}`)
            .then(res => res.json())
            .then(data => {
                setCorrection(data);
            })
            .catch(err => {
                console.error(err);
            });

    }, [id]);


    if (!correction) {

        return (
            <div className="correctionPage">
                <h2>Loading...</h2>
            </div>
        );

    }


    const originalAmount =
        Number(correction.totalamount || 0);


    const adjustment =
        Number(correction.adjustmentamount || 0);


    const correctedAmount =
        originalAmount + adjustment;

    const printCorrection = () => {
        window.print();
    };



    return (

        <div className="correctionPage">


            <div className="correctionCard">


                <h1>
                    SERENE HOMES APARTMENTS
                </h1>


                <p>
                    PO BOX 19967-03400, Nairobi
                </p>

                <p>
                    Tel: 0745113765
                </p>

                <p>
                    Email: serenehomes21@gmail.com
                </p>


                <hr />


                <h2>
                    INVOICE CORRECTION NOTICE
                </h2>



                <div className="correctionHeader">


                    <div>
                        <strong>
                            Correction No
                        </strong>

                        <p>
                            #{correction.correctionid}
                        </p>
                    </div>



                    <div>
                        <strong>
                            Original Invoice
                        </strong>

                        <p>
                            #{correction.invoiceid}
                        </p>
                    </div>



                    <div>
                        <strong>
                            Tenant
                        </strong>

                        <p>
                            {correction.name}
                        </p>
                    </div>



                    <div>
                        <strong>
                            House
                        </strong>

                        <p>
                            {correction.houseno}
                        </p>
                    </div>


                </div>



                <table className="correctionTable">


                    <thead>

                        <tr>

                            <th>
                                Description
                            </th>

                            <th>
                                Amount (KES)
                            </th>

                        </tr>

                    </thead>


                    <tbody>


                        <tr>

                            <td>
                                Original Invoice Amount
                            </td>

                            <td>
                                {originalAmount.toFixed(2)}
                            </td>

                        </tr>



                        <tr>

                            <td>
                                {correction.correctiontype}
                            </td>


                            <td
                                className={
                                    adjustment < 0
                                    ? "credit"
                                    : "debit"
                                }
                            >

                                {
                                    adjustment > 0
                                    ? "+"
                                    : ""
                                }

                                {adjustment.toFixed(2)}

                            </td>

                        </tr>



                        <tr className="totalRow">

                            <td>
                                Corrected Invoice Amount
                            </td>


                            <td>
                                {correctedAmount.toFixed(2)}
                            </td>


                        </tr>


                    </tbody>


                </table>



                <div className="reasonBox">

                    <h3>
                        Reason For Correction
                    </h3>


                    <p>
                        {correction.reason}
                    </p>


                </div>



                <div className="approvalSection">


                    <p>
                        <strong>
                            Status:
                        </strong>

                        {" "}

                        {correction.status}
                    </p>


                    <br />


                    <p>
                        Approved By:
                        ___________________________
                    </p>


                    <p>
                        Date:
                        ___________________________
                    </p>


                </div>



            </div>

            <button
            className="printButton"
            onClick={printCorrection}
            >
                Print Invoice Correction
            </button>


        </div>

    );

};


export default InvoiceCorrectionPrint;