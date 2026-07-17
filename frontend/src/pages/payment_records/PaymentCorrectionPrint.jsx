import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./PaymentCorrectionPrint.css";

const PaymentCorrectionPrint = () => {

    const { id } = useParams();

    const [correction, setCorrection] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {

        fetch(
            `${API_URL}/payment-correction/${id}`
        )
            .then(res => res.json())
            .then(data => setCorrection(data))
            .catch(console.error);

    }, [id,API_URL]);

    const printPage = () => {
        window.print();
    };

    if (!correction) {

        return (

            <div className="correctionPage">
                <h2>Loading...</h2>
            </div>

        );

    }

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
                    PAYMENT CORRECTION NOTICE
                </h2>

                <div className="correctionHeader">

                    <div>
                        <strong>Correction No</strong>
                        <p>
                            #{correction.correctionid}
                        </p>
                    </div>

                    <div>
                        <strong>Payment No</strong>
                        <p>
                            #{correction.paymentid}
                        </p>
                    </div>

                    <div>
                        <strong>Tenant</strong>
                        <p>
                            {correction.name}
                        </p>
                    </div>

                    <div>
                        <strong>House</strong>
                        <p>
                            {correction.houseno}
                        </p>
                    </div>

                </div>

                <table className="correctionTable">

                    <thead>

                        <tr>

                            <th>
                                Field
                            </th>

                            <th>
                                Old Value
                            </th>

                            <th>
                                New Value
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        <tr>

                            <td>
                                {correction.fieldname}
                            </td>

                            <td>
                                {correction.oldvalue}
                            </td>

                            <td>
                                {correction.newvalue}
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
                            Created:
                        </strong>

                        {" "}

                        {new Date(
                            correction.createdat
                        ).toLocaleDateString()}

                    </p>

                    <br />

                    <p>
                        Approved By:
                        ________________________
                    </p>

                    <p>
                        Signature:
                        ________________________
                    </p>

                </div>

            </div>

            <button
                className="printButton"
                onClick={printPage}
            >
                Print Correction
            </button>

        </div>

    );

};

export default PaymentCorrectionPrint;