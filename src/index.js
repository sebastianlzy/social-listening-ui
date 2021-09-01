import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import {createTheme, ThemeProvider} from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';

const theme = createTheme({
    palette: {
        primary: {
            main: "#C2012F",
        },
        secondary: {
            main: blue[500]
        }
    },

});

ReactDOM.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <App/>
        </ThemeProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
