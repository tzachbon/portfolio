import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';
import { MuiThemeProvider } from '@material-ui/core';
import { THEME } from './utils/material';


const Index = () => (
    <BrowserRouter>
        <MuiThemeProvider theme={THEME}>
            <App />
        </MuiThemeProvider>
    </BrowserRouter>
)

ReactDOM.render(<Index />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
