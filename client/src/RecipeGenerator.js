import React, { useState, useEffect } from "react";
import Axios from "axios";
import Header from "./Header";
import Footer from "./Footer";
import Cookies from "js-cookie";
import Search from "./Search";

export const RecipeGenerator = () => {
  const [readyRecipes, setreadyRecipes] = useState([]);
  const [closeRecipes, setcloseRecipes] = useState([]);
  const [response, setResponse] = useState([]);

  const fetchData = async () => {
    try {
      const responseData = await Axios.get(
        "https://systembreakerswhat-a8b3a7e03d39.herokuapp.com/recipe/recipesIngredient",
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${Cookies.get("userToken")}`,
          },
        }
      );
      setResponse(responseData);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  useEffect(() => {
    const processRecipes = () => {
      const RR = [];
      const CR = [];
      for (const [recipeName, ingredients] of Object.entries(response.data)) {
        if (ingredients.length === 0) {
          RR.push(recipeName);
        } else {
          CR.push(recipeName);
        }
      }
      setreadyRecipes(RR);
      setcloseRecipes(CR);
    };

    if (response.data) {
      processRecipes();
    }
  }, [response]);

  const handleButtonClick = () => {
    fetchData("yourSearchValue");
  };

  return (
    <div>
      <Header />
      <Search />
      <div>
        <button onClick={handleButtonClick}>Refresh List</button>
      </div>
      <div>
        <h2>You have all the ingredients for this recipe:</h2>
        <ul>
          {readyRecipes.map((recipe, index) => (
            <li key={index}>{recipe}</li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Other recipes:</h2>
        <ul>
          {closeRecipes.map((recipeName, index) => (
            <li key={index}>
              {recipeName} <br />
              Missing ingredients: {response.data[recipeName].join(", ")}
            </li>
          ))}
        </ul>
      </div>
      <Footer />
    </div>
  );
};

export default RecipeGenerator;
