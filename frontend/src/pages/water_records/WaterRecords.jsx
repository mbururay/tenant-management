import { useNavigate } from "react-router-dom";
import Heading from "../../components/Heading";
import "./WaterRecords.css";


const WaterRecords = () => {
  const navigate = useNavigate();

  return (
    <div className="modifyWaterPage">
      <Heading />

      <div className="modifyWaterCard">

        <h1 className="modifyWaterTitle">
          Water Records
        </h1>

        <h2 className="modifyWaterSubtitle">
          Select your desired action
        </h2>

        <div className="modifyWaterButtonSet">

            <button
                className="updateWaterButton"
                onClick={() => navigate("/WaterUpdate")}
            >
            Update Water Records
            </button>

          <button
                className="modifyWaterButton"
                onClick={() => navigate("/SearchWater")}
            >
            Modify Water Records
          </button>


        </div>

      </div>
    </div>
  );
};

export default WaterRecords;