import { useNavigate } from "react-router-dom";
import Heading from "../../components/Heading";
import "./BillSelect.css";

const BillSelect = () => {

    const navigate = useNavigate();

    return (

        <div className="billSelectPage">

            <Heading />

            <div className="billSelectContent">

                <div className="billSelectCard">

                    <h1 className="billSelectTitle">
                        Landlord Bills
                    </h1>

                    <h2 className="billSelectSubtitle">
                        Select your desired action
                    </h2>

                    <div className="billSelectButtonSet">

                        <button
                            className="billSelectButton"
                            onClick={() => navigate("/EnterBills")}
                        >
                            Enter Landlord Bills
                        </button>

                        <button
                            className="billSelectButton"
                            onClick={() => navigate("/DisplayBills")}
                        >
                            Display Landlord Bills
                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

};

export default BillSelect;