import "./Header.css";
import PriceComp from "./Comparer";
import Profile from "./Profile";
import Recipes from "./Recipes";
import Dietary from "./DietaryRestrictions";
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Home() {
return (
    <a href="/home">
    <button style={{fontFamily: 'cursive',fontSize: '25px'}}>
        Home
    </button>
    </a>
    );
}

function Recipe() {
return (
    <Link to="/recipes">
    <button style={{fontFamily: 'cursive',fontSize: '25px'}}>
        Recipe Generator
    </button>
    </Link>
    );
}
function Price() {
return (
    <Link to="/pricecompare">
    <button style={{fontFamily: 'cursive',fontSize: '25px'}}>
        Price Comparator
    </button>
    </Link>
    );
}
function Prof() {
return (
    <Link to="/profile">
    <button style={{fontFamily: 'cursive',fontSize: '25px'}}>
        Profile
    </button>
    </Link>
    );
}
function Diet() {
  return (
    <Link to="/dietary">
      <button style={{ fontFamily: "cursive", fontSize: "25px" }}>
        DietaryRestrictions
      </button>
    </Link>
  );
}

function Header() {
    return (
      <header style={{background: 'lemonchiffon',fontFamily:'cursive',}} className="header">
        <nav>
          <ul className="right">
            <div style={{fontFamily:'cursive', fontSize: '30px'}} className="left">WhatToCook</div>
            <Home/>
            <Recipe/>
            <Price/>
            <Diet/>
            <Prof/>
          </ul>
        </nav> 
        <ul style={{color: 'lemonchiffon', fontSize: '15px'}}>
          Space
        </ul>
      </header>
    );
  }

export default Header;
  
