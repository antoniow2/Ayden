import React from 'react';
import { Link } from 'react-router-dom';

function FrontPage() {
    return (
        <div style={{textAlign:'center',fontFamily:'cursive',}}>
            <div>
                <h1>Welcome to What to Cook</h1>
            </div>
            <nav>
                <ul>
                    <a>
                        <Link to="/login">
                        <button style={{fontFamily: 'cursive',fontSize: '30px'}}>
                            Login
                        </button>
                        </Link>
                    </a>
                    <a>
                        <Link to="/register">
                        <button style={{fontFamily: 'cursive',fontSize: '30px'}}>
                            Register
                        </button>
                        </Link>
                    </a>
                </ul>
            </nav>
        </div>
    )
}

export default FrontPage