// src/redux/weatherSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch weather data
export const fetchWeather = createAsyncThunk(
  'weather/fetchWeather',
  async (query) => {
    const API_KEY = '5e9223c8326fd1a536c9f5957af58a74'; // Replace with your OpenWeather API key
    const url =
      query.includes(',')
        ? `https://api.openweathermap.org/data/2.5/weather?lat=${query.split(',')[0]}&lon=${query.split(',')[1]}&units=metric&appid=${API_KEY}`
        : `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=metric&appid=${API_KEY}`; // Corrected API key usage
    const response = await axios.get(url);
    return response.data;
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default weatherSlice.reducer;
