import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Heading from "../../components/Heading";
import "./WaterModify.css";

const WaterModify = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [originalData, setOriginalData] = useState(null);

  const [formData, setFormData] = useState({
    id: "",
    houseId: "",
    houseNo: "",
    previousReading: "",
    currentReading: ""
  });

  // LOAD DATA
  useEffect(() => {
    fetch(`http://localhost:3001/waterRecord/${id}`)
      .then(res => res.json())
      .then(data => {

        const record = {
          id: data.id,
          houseId: data.houseId || data.houseid,
          houseNo: data.houseNo || data.houseno,
          previousReading: data.previousReading || data.previousreading || 0,
          currentReading: data.currentReading || data.currentreading || ""
        };

        setOriginalData(record);
        setFormData(record);
      })
      .catch(err => {
        console.error(err);
        alert("Unable to load water record.");
      });
  }, [id]);

  // FIXED INPUT HANDLER
  const handleChange = (e) => {
    const value = e.target.value;

    setFormData(prev => ({
      ...prev,
      currentReading: value
    }));
  };

  // SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.currentReading === "" || formData.currentReading === null) {
      alert("Please enter a current reading.");
      return;
    }

    navigate("/WaterModifyConfirm", {
      state: {
        original: originalData,
        updated: formData
      }
    });
  };

  // LOADING STATE
  if (!originalData) {
    return (
      <div className="editTenantPage">
        <Heading />
        <h2 style={{ color: "white", textAlign: "center", marginTop: "100px" }}>
          Loading Water Record...
        </h2>
      </div>
    );
  }

  return (
    <div className="editTenantPage">
      <Heading />

      <h1 className="editTenantTitle">
        Edit Water Reading
      </h1>

      <form className="editTenantForm" onSubmit={handleSubmit}>
        <section className="editSection">
          <h3>Water Reading Details</h3>

          <label>House Number</label>
          <input
            className="editInput houseDisplay"
            value={formData.houseNo}
            readOnly
          />

          <label>Previous Reading</label>
          <input
            className="editInput houseDisplay"
            value={formData.previousReading}
            readOnly
          />

          <label>Current Reading</label>
          <input
            className="editInput"
            type="number"
            value={formData.currentReading}
            onChange={handleChange}
          />
        </section>

        <div className="buttonRow">
          <button
            type="button"
            className="cancelButton"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>

          <button type="submit" className="continueButton">
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default WaterModify;