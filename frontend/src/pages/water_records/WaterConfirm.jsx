import { useLocation, useNavigate } from "react-router-dom";
import Heading from "../../components/Heading";
import "./WaterConfirm.css";

const WaterConfirm = () => {

    const { state } = useLocation();
    const navigate = useNavigate();

    if (!state) {
        return (
            <div>
                <Heading />
                <h2>No water update found.</h2>

                <button onClick={() => navigate("/WaterUpdate")}>
                    Go Back
                </button>
            </div>
        );
    }

    const submitToBackend = async () => {

        const res = await fetch(
            "http://localhost:3001/water-update",
            {
                method: "POST",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify(state)
            }
        );

        const data = await res.json();

        if(data.error){

            alert(data.error);
            return;

        }

        alert("Water records updated successfully.");

        navigate("/WaterUpdate");

    };

    return(

        <div className="waterConfirmPage">

            <Heading />

            <div className="waterConfirmCard">

                <h1>Confirm Water Charges</h1>

                <p>
                    Rate:
                    <strong>
                        KES {state.rate}
                    </strong>
                    per unit
                </p>

                <table className="confirmTable">

                    <thead>

                        <tr>

                            <th>House</th>

                            <th>Tenant</th>

                            <th>Previous</th>

                            <th>Current</th>

                            <th>Usage</th>

                            <th>Bill</th>

                        </tr>

                    </thead>

                    <tbody>

                        {state.houses.map(house=>(

                            <tr key={house.houseId}>

                                <td>{house.houseNo}</td>

                                <td>{house.tenant}</td>

                                <td>{house.previousReading}</td>

                                <td>{house.currentReading}</td>

                                <td>{house.usage}</td>

                                <td>
                                    KES {house.bill.toFixed(2)}
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

                <div className="buttonRow">

                    <button
                        className="cancelButton"
                        onClick={()=>navigate(-1)}
                    >
                        Edit
                    </button>

                    <button
                        className="confirmButton"
                        onClick={submitToBackend}
                    >
                        Confirm
                    </button>

                </div>

            </div>

        </div>

    );

};

export default WaterConfirm;