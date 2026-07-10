import { useNavigate } from "react-router-dom";
import Heading from "../../components/Heading";
import "./WaterRecords.css";


const WaterRecords = () => {

  const navigate = useNavigate();

  return (

    <div className="waterRecordsPage">

      <Heading />

      <div className="waterRecordsContent">

        <div className="waterRecordsCard">

          <h1 className="waterRecordsTitle">
            Water Records
          </h1>


          <p className="waterRecordsSubtitle">
            Select your desired action
          </p>


          <div className="waterRecordsButtonSet">


            <button
              className="waterRecordsButton"
              onClick={() => navigate("/WaterUpdate")}
            >
              Update Water Records
            </button>


            <button
              className="waterRecordsButton"
              onClick={() => navigate("/SearchWater")}
            >
              Modify Water Records
            </button>


          </div>


        </div>


      </div>


    </div>

  );

};


export default WaterRecords;