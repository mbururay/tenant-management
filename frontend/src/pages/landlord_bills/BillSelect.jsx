import { useNavigate } from "react-router-dom";
import Heading from "../../components/Heading";
import "../water_records/WaterRecords.css";


const BillSelect = () => {
  const navigate = useNavigate();

  return (
    <div className="modifyWaterPage">
      <Heading />

      <div className="modifyWaterCard">

        <h1 className="modifyWaterTitle">
          Landlord Bills
        </h1>

        <h2 className="modifyWaterSubtitle">
          Select your desired action
        </h2>

        <div className="modifyWaterButtonSet">

            <button
                className="updateWaterButton"
                onClick={() => navigate("/EnterBills")}
            >
            Enter Landlord Bills
            
            </button>

          <button
                className="modifyWaterButton"
                onClick={() => navigate("/DisplayBills")}
            >
            Display Landlord Bills
          </button>

         



        </div>

      </div>
    </div>
  );
};

export default BillSelect;