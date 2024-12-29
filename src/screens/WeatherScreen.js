import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  FlatList,
  Switch,
} from 'react-native';
import * as Location from 'expo-location';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWeather } from '../redux/weatherSlice';
import WeatherDetails from '../components/WeatherDetails';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WeatherScreen = () => {
  const [city, setCity] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [isCelsius, setIsCelsius] = useState(true);
  const dispatch = useDispatch();
  const { data, forecast, loading, error } = useSelector((state) => state.weather);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const favoritesString = await AsyncStorage.getItem('favorites');
      if (favoritesString) {
        setFavorites(JSON.parse(favoritesString));
      }
    } catch (err) {
      console.error('Failed to load favorites', err);
    }
  };

  const saveFavorite = async (city) => {
    try {
      const newFavorites = [...favorites, city];
      setFavorites(newFavorites);
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
    } catch (err) {
      console.error('Failed to save favorite', err);
    }
  };

  const removeFavorite = async (city) => {
    try {
      const newFavorites = favorites.filter((item) => item !== city);
      setFavorites(newFavorites);
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
    } catch (err) {
      console.error('Failed to remove favorite', err);
    }
  };

  const handleFetchWeatherByLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'We need location access to fetch the weather. Please enable it in your settings.'
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const coords = `${location.coords.latitude},${location.coords.longitude}`;
      dispatch(fetchWeather(coords));
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Unable to fetch location.');
    }
  };

  const handleFetchWeatherByCity = () => {
    if (city.trim()) {
      dispatch(fetchWeather(city));
      saveFavorite(city);
    } else {
      Alert.alert('Validation Error', 'Please enter a city name.');
    }
  };

  const handleToggleUnit = () => {
    setIsCelsius(!isCelsius);
  };

  const handleDoubleClick = (city, onPress) => {
    let lastPress = 0;
    return () => {
      const time = new Date().getTime();
      const delta = time - lastPress;
      const DOUBLE_PRESS_DELAY = 300;
      if (delta < DOUBLE_PRESS_DELAY) {
        onPress(city);
      }
      lastPress = time;
    };
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weather App</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter city name"
        value={city}
        onChangeText={setCity}
      />
      <TouchableOpacity style={styles.button} onPress={handleFetchWeatherByCity}>
        <Text style={styles.buttonText}>Get Weather by City</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleFetchWeatherByLocation}>
        <Text style={styles.buttonText}>Get Weather by Location</Text>
      </TouchableOpacity>
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Celsius</Text>
        <Switch
          value={isCelsius}
          onValueChange={handleToggleUnit}
        />
        <Text style={styles.switchLabel}>Fahrenheit</Text>
      </View>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text style={styles.error}>Error: {error}</Text>}
      <WeatherDetails weather={data} forecast={forecast} isCelsius={isCelsius} />
      <Text style={styles.favoritesTitle}>Favorite Locations:</Text>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.favoriteItem}
            onPress={() => {
              setCity(item);
              dispatch(fetchWeather(item));
            }}
            onPressIn={handleDoubleClick(item, removeFavorite)}
          >
            <Text style={styles.favoriteText}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    marginTop:10,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 7,
  },
  button: {
    backgroundColor: 'grey',
    padding: 10,
    marginVertical: 10,
    borderRadius: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  switchLabel: {
    fontSize: 16,
    marginHorizontal: 10,
  },
  favoritesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  favoriteItem: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  favoriteText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default WeatherScreen;
