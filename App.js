import React from 'react';
import { Text, View, StyleSheet, Image, Button, FlatList } from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import {VEA_STAGE, VEA_API_BASE_URL} from '@env'

import foodImages from './assets/plato-de-ensalada.png';
import errorImages from './assets/error.png';


export default class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      url: null,
      imageBase64: null,
      error: null,
      loading: false,
      data: null
    }
  }


  openImagePickerAsync = async () => {
    let permissionPhotoResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionPhotoResult.granted === false) {
      alert("Se requiere permiso para acceder a la galería!");
      return;
    }

    const pickerPhotoResult = await ImagePicker.launchImageLibraryAsync(
      {
        base64: true
      }
    )
    if (pickerPhotoResult.cancelled === true) {
      return;
    }
    this.sendImage(pickerPhotoResult.base64);
  }


  openCameraPickerAsync = async () => {
    let permissionCameraResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionCameraResult.granted === false) {
      alert("Se requiere permiso para acceder a la cámara!");
      return;
    }

    const pickerCameraResult = await ImagePicker.launchCameraAsync(
      {
        base64: true
      }
    );
    if (pickerCameraResult.cancelled === true) {
      return;
    }
    this.sendImage(pickerCameraResult.base64);
  }

  sendImage = async (image) => {

    this.setState({loading: true});

    axios.post(`${VEA_API_BASE_URL}/${VEA_STAGE}/food`, {
      image: image
    })
    .then(res => {
      console.log(JSON.stringify(res));

      this.setState({
        loading: false,
        data: res.data
      });
    })
    .catch(error => {
      console.log(error);
      this.setState({
        error: error
      });
    });
  }

  onButtonPress = () => {
    this.setState(
      {
        loading: false,
        data: null,
        error: null
      }
    );
  };

  InitialScreen = () => {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Pruebalo</Text>
        <Text style={styles.subtitle}>Verifica el estado de tu comida</Text>
        <Image
          source={foodImages}
          style={styles.image}
        />
        <Text style={styles.subtitle}>Selecciona</Text>
        <View style={styles.buttonContainer}>
          <View style={styles.buttonContainer}>
            <Button
              color='black' 
              title='Galería'
              onPress={this.openImagePickerAsync}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              color='black' 
              title='Cámara'
              onPress={this.openCameraPickerAsync}
            />
          </View>
        </View>
      </View>
    );
  }

  render () {
    if (this.state.data) {
      return (
        <View style={styles.container}>
          <FlatList
            data={this.state.data}
            renderItem={
              ({item}) => <Text style={styles.subtitle}>{item.Name}</Text>}
          />
          <View style={styles.buttonContainer}>
          <Button
              color='black' 
              title='Volver'
              onPress={this.onButtonPress}
            />
          </View>
        </View>
      );
    }
    if (this.state.error) {
      return (
        <View style={styles.container}>
          <Image
            source={errorImages}
            style={styles.image}
          />
          <Text style={styles.title}>Upps, lo sentimos hubo un error en el servidor</Text>
          <View style={styles.buttonContainer}>
              <Button
                color='black'
                title='Volver'
                onPress={this.onButtonPress}
              />
          </View>
        </View>
      );
    }
    if (this.state.loading) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Verificando</Text>
        </View>
      );
    }
    return this.InitialScreen();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'orange',
  },
  buttonContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    margin: 10,
    flexWrap: 'wrap',
  },
  subtitle: { fontSize: 15, color: 'white' },
  title: { fontSize: 30, color: 'white' },
  subtitle: { fontSize: 20, color: 'white' },
  image: { width: 200, height: 200 },
});
