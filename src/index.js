import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; 
// Import the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


// const name = 'Raymond Regoso';
// const user = {
//   firstName: "Jane",
//   lastName: "Smith"
// }

// function formatName(user){
//   return user.firstName + ' ' + user.lastName
// }

// const element = <h1> Hello there, {formatName(user)}</h1>; // JSX - JavaScript XML

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(element);