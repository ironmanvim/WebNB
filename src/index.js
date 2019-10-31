import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from "react-router-dom";


import Console from './Components/Console';
import './Assets/css/index.css';
import './Assets/fontawesome-free-5.10.2-web/css/all.css';


const App = () => {
    return (
        <BrowserRouter>
            <div className="container">
                <Console/>
            </div>
        </BrowserRouter>
    );
};

ReactDOM.render(<App/>, document.getElementById('root'));
