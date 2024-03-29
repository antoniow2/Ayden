import React, { useState, useEffect } from "react";
import Axios from "axios";
import Cookies from "js-cookie";
import Header from "./Header";
import Footer from "./Footer";

const DietaryRestrictions = () => {
  const [healthLabels, setHealthLabels] = useState([]);
  const [selectedRestrictions, setSelectedRestrictions] = useState([]);
  const [userHealthLabels, setUserHealthLabels] = useState([]);

  useEffect(() => {
    // Fetch health labels from the server
    Axios.get(
      "https://systembreakerswhat-a8b3a7e03d39.herokuapp.com/users/healthlabels"
    )
      .then((response) => {
        setHealthLabels(response.data.labels);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleCheckboxChange = (label) => {
    // Toggle the selected status of the label
    setSelectedRestrictions((prevSelected) => {
      if (prevSelected.includes(label)) {
        return prevSelected.filter((selected) => selected !== label);
      } else {
        return [...prevSelected, label];
      }
    });
  };

  const handleSaveRestrictions = async () => {
    try {
      const authToken = Cookies.get("userToken");

      // Fetch the healthLabel_ids corresponding to the selected health labels
      const response = await Axios.get(
        "https://systembreakerswhat-a8b3a7e03d39.herokuapp.com/users/healthlabels_ids",
        {
          params: { selectedRestrictions: selectedRestrictions.join(",") },
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const healthLabelIds = response.data.healthLabelIds;

      console.log(healthLabelIds);

      await Axios.post(
        "https://systembreakerswhat-a8b3a7e03d39.herokuapp.com/users/dietary_restrictions",
        { selectedRestrictions: healthLabelIds },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      console.log("Dietary restrictions saved successfully!");
      setUserHealthLabels(selectedRestrictions);
    } catch (error) {
      console.error("Error saving dietary restrictions:", error);
    }
  };

  useEffect(() => {
    Axios.get(
      "https://systembreakerswhat-a8b3a7e03d39.herokuapp.com/users/user_healthlabels",
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${Cookies.get("userToken")}`,
        },
      }
    )
      .then((response) => {
        // console.log('Response from server:', response)
        const savedRestrictions = response.data.userHealthLabels || [];
        setUserHealthLabels(savedRestrictions);
        setSelectedRestrictions(savedRestrictions);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <Header />
      <h1>Restrictions</h1>
      <form>
        // <h3>Select your allergy :</h3>
        {healthLabels.map((label) => (
          <div key={label}>
            <label>
              <input
                type="checkbox"
                value={label}
                checked={selectedRestrictions.includes(label)}
                onChange={() => handleCheckboxChange(label)}
              />
              {label}
            </label>
          </div>
        ))}{" "}
      </form>
      <button type="button" onClick={handleSaveRestrictions}>
        Save Dietary Restrictions
      </button>
      <div className="saved-restrictions">
        <h2>Your Saved Restrictions</h2>
        <ul>
          {userHealthLabels.map((savedLabel) => (
            <li key={savedLabel}>{savedLabel}</li>
          ))}
        </ul>
      </div>
      <Footer />
    </div>
  );
};

export default DietaryRestrictions;
