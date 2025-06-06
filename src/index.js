// import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import App from './App';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-photo-view/dist/react-photo-view.css';
import '~/styles/index.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.render(
    // <React.StrictMode>
    <Provider store={store}>
        <App />
        <ToastContainer />
    </Provider>,
    // </React.StrictMode>,
    document.getElementById('root'),
);
