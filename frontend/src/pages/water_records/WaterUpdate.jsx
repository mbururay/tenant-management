import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Heading from "../../components/Heading";
import "./WaterUpdate.css";

const WaterUpdate = () => {
  const navigate = useNavigate();

  const [rate, setRate] = useState(150);
  const [houses, setHouses] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/water-update-list")
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((house) => ({
          ...house,
          currentReading: "",
          usage: 0,
          bill: 0,
        }));

        setHouses(formatted);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleRateChange = (e) => {
    const newRate = Number(e.target.value);

    setRate(newRate);

    setHouses((prev) =>
      prev.map((house) => {
        const usage =
          house.currentReading === ""
            ? 0
            : Number(house.currentReading) -
              Number(house.previousReading);

        return {
          ...house,
          usage,
          bill: usage * newRate,
        };
      })
    );
  };

  const handleReadingChange = (index, value) => {
    const updated = [...houses];

    updated[index].currentReading = value;

    if (value !== "") {
      updated[index].usage =
        Number(value) -
        Number(updated[index].previousReading);

      updated[index].bill =
        updated[index].usage * rate;
    } else {
      updated[index].usage = 0;
      updated[index].bill = 0;
    }

    setHouses(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const incomplete = houses.some(
      (h) => h.currentReading === ""
    );

    if (incomplete) {
      alert("Please enter all water readings.");
      return;
    }

    navigate("/WaterConfirm", {
      state: {
        rate,
        houses: houses.map((h) => ({
          houseId: h.houseId,
          houseNo: h.houseNo,
          tenantId: h.tenantId,
          tenant: h.tenant,
          previousReading: h.previousReading,
          currentReading: Number(h.currentReading),
          usage: h.usage,
          bill: h.bill,
        })),
      },
    });
  };

  return (
    <div className="waterPage">
      <Heading />

      <h1 className="waterTitle">
        Monthly Water Update
      </h1>

      <form
        className="waterForm"
        onSubmit={handleSubmit}
      >
        <div className="rateSection">
          <label>
            Water Rate (KES per Unit)
          </label>

          <input
            className="rateInput"
            type="number"
            value={rate}
            onChange={handleRateChange}
          />
        </div>

        <div className="tableWrapper">
          <table className="waterTable">

            <thead id="waterHead">
              <tr>
                <th>House</th>
                <th>Tenant</th>
                <th>Previous Reading</th>
                <th>Current Reading</th>
                <th>Usage</th>
                <th>Bill (KES)</th>
              </tr>
            </thead>

            <tbody id="waterBody">
              {houses.map((house, index) => (
                <tr key={house.houseId}>
                  <td>{house.houseNo}</td>

                  <td>{house.tenant}</td>

                  <td>{house.previousReading}</td>

                  <td>
                    <input
                      className="readingInput"
                      type="number"
                      value={house.currentReading}
                      onChange={(e) =>
                        handleReadingChange(
                          index,
                          e.target.value
                        )
                      }
                    />
                  </td>

                  <td>{house.usage}</td>

                  <td>
                    KES {house.bill.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

        <div className="buttonRow">
          <button
            type="submit"
            className="waterButton"
          >
            Review Water Charges
          </button>
        </div>
      </form>
    </div>
  );
};

export default WaterUpdate;