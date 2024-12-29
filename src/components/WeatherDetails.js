import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const WeatherDetails = ({ weather, forecast, isCelsius }) => {
  if (!weather) {
    return null;
  }

  const temperature = isCelsius
    ? weather.main.temp
    : (weather.main.temp * 9/5) + 32; // Convert to Fahrenheit if needed
  const unit = isCelsius ? '°C' : '°F';

  const renderForecastItem = ({ item }) => {
    const forecastTemp = isCelsius ? item.temp.day : (item.temp.day * 9/5) + 32;
    return (
      <View style={styles.forecastItem}>
        <Text style={styles.forecastDate}>{new Date(item.dt * 1000).toDateString()}</Text>
        <Text style={styles.forecastTemp}>{forecastTemp.toFixed(2)} {unit}</Text>
        <Text style={styles.forecastCondition}>{item.weather[0].description}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.city}>{weather.name}</Text>
      <Text style={styles.temperature}>
        {temperature.toFixed(2)}
        {unit}
      </Text>
      <Text style={styles.condition}>{weather.weather[0].description}</Text>

      {forecast && (
        <View style={styles.forecastContainer}>
          <Text style={styles.forecastTitle}>Next Week Forecast:</Text>
          <FlatList
            data={forecast}
            renderItem={renderForecastItem}
            keyExtractor={(item) => item.dt.toString()}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 20,
  },
  city: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  condition: {
    fontSize: 18,
    fontStyle: 'italic',
  },
  forecastContainer: {
    marginTop: 20,
  },
  forecastTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  forecastItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  forecastDate: {
    fontSize: 16,
  },
  forecastTemp: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  forecastCondition: {
    fontSize: 16,
    fontStyle: 'italic',
  },
});

export default WeatherDetails;
