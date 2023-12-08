import React from 'react'
import { Link } from 'react-router-dom'
import Header from './Header';
import Footer from './Footer';

function Home() {
    
    return (
        <div style={{textAlign:'center'}}>
            <Header/>
            <div>
                <h1>Welcome to What to Cook</h1>
            </div>
            <Footer/>
        </div>
    )
}

export default Home