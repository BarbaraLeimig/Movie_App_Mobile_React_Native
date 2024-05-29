import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, View, KeyboardAvoidingView, Platform } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

export default function App() {
  const [movieTitle, setMovieTitle] = useState('');
  const [movieData, setMovieData] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão de localização não concedida', 'Por favor, conceda permissão de localização para obter a localização.');
        return;
      }
      let locationData = await Location.getCurrentPositionAsync({});
      setLocation(locationData);
    })();
  }, []);

  const handleSearch = async () => {
    if (movieTitle.trim() === '') {
      Alert.alert('Aviso', 'Por favor, insira um título de filme válido.');
      return;
    }

    try {
      const apiKey = '4e2f67b7';
      const apiUrl = `https://www.omdbapi.com/?t=${movieTitle}&apikey=${apiKey}`;

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.Response === 'True') {
        setMovieData(data);
      } else {
        Alert.alert('Erro', 'Filme não encontrado. Verifique o título e tente novamente.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Houve um problema na busca do filme. Tente novamente mais tarde.');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={{ fontSize: 20, textAlign: 'center', marginTop: 20 }}>
          Busca de Filmes
        </Text>
        <TextInput
          style={styles.input}
          placeholder='Digite o nome do filme'
          value={movieTitle}
          onChangeText={(text) => setMovieTitle(text)}
        />
        <Button title="Buscar Filme" onPress={handleSearch} />

        {movieData && (
          <View style={styles.movieData}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{movieData.Title}</Text>
            <Text>Ano: {movieData.Year}</Text>
            <Text>Gênero: {movieData.Genre}</Text>
            <Text>Diretor: {movieData.Director}</Text>
            <Text>Prêmios: {movieData.Awards}</Text>
          </View>
        )}

        {location && (
          <View style={styles.mapContainer}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Sua Localização</Text>
            <Text>Latitude: {location.coords.latitude}</Text>
            <Text>Longitude: {location.coords.longitude}</Text>

            <MapView
              style={styles.map}
              initialRegion={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              <Marker
                coordinate={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }}
                title="Sua localização"
              />
            </MapView>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    margin: 10,
    padding: 8,
    width: '100%',
  },
  movieData: {
    marginVertical: 20,
    alignItems: 'center',
  },
  mapContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 30,
  },
  map: {
    width: '100%',
    height: 300,
  },
});

