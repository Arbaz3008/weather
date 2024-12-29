// App.js
import React from 'react';
import { Provider } from 'react-redux';
import WeatherScreen from './src/screens/WeatherScreen';
import store from './src/redux/store';

export default function App() {
  return (
    <Provider store={store}>
      <WeatherScreen />
    </Provider>
  );
}
