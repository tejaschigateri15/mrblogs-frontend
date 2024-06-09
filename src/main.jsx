import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import store from './components/state.jsx'
import { PersistGate } from 'redux-persist/integration/react'
import {persistStore} from 'redux-persist'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

let persistor = persistStore(store)


ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
  <React.StrictMode>
    <PersistGate persistor={persistor}>
    <App />
    </PersistGate>
  </React.StrictMode>
  </Provider>

)
