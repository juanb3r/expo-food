import React from 'react';
import { Text, View, TextInput, SafeAreaView, Image, Button, FlatList } from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import {VEA_STAGE, VEA_API_BASE_URL} from '@env'

import { styles } from './styles/styles';

import foodImages from './assets/plato-de-ensalada.png';
import errorImages from './assets/error.png';
import logo from './assets/logos/4.png';

export default class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      url: null,
      imageBase64: null,
      error: null,
      loading: false,
      data: null,
      screen: 'home',
      subject: null,
      message: null,
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

  sendMessage = async () => {

    this.setState({loading: true});

    axios.post(`${VEA_API_BASE_URL}/${VEA_STAGE}/report`, {
      subject: this.state.subject,
      message: this.state.message
    })
    .then(res => {
      console.log(JSON.stringify(res));

      this.setState({
        loading: false,
        data: res.data,
        subject: null,
        message: null,
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
        error: null,
        screen: 'home'
      }
    );
  };

  HomeScreen = () => {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Bienvenido</Text>
        <Text style={styles.subtitle}>Verificador Estado de Alimento</Text>
        <Image
          source={logo}
          style={styles.image}
        />
        <Text style={styles.subtitle}>Menú</Text>
        <View style={styles.buttonContainer}>
          <View style={styles.buttonContainer}>
            <Button
              color='black' 
              title='Verificar'
              onPress={() => {
                this.setState({ screen: 'checker' }) 
              }
            }
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              color='black' 
              title='Reportar'
              onPress={() => {
                  this.setState({ screen: 'reporter' }) 
                }
              }
            />
          </View>
          
        </View>
      </View>
    );
  }

  CheckerFoodScreen = () => {
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
          <View style={styles.buttonContainer}>
              <Button
                color='black'
                title='Volver'
                onPress={this.onButtonPress}
              />
          </View>
        </View>
      </View>
    );
  }

  ReporterScreen = () => {

    return (

      <SafeAreaView style={styles.text_container}>
        <Text style={styles.subtitle}>Asunto:</Text>
        <TextInput
          style={styles.input}
          onChangeText={subject => this.setState({ subject: subject })}
          value={this.state.subject}
          placeholder="Inserte asunto"
        />
        <Text style={styles.subtitle}>Mensaje:</Text>
        <TextInput
          style={styles.input}
          onChangeText={message => this.setState({ message: message })}
          value={this.state.message}
          placeholder="Inserte su reporte"
        />
        <View style={styles.buttonContainer}>
          <Button
            color='black' 
            title='Enviar'
            onPress={this.sendMessage}
          />
        </View>
        <View style={styles.buttonContainer}>
            <Button
              color='black'
              title='Volver'
              onPress={this.onButtonPress}
            />
        </View>
      </SafeAreaView>
      
    );
  };

  render () {
    if (this.state.data) {
      return (
        <View style={styles.container}>
          <View style={styles.buttonContainer}>
          <FlatList 
            data={this.state.data}
            renderItem={
              ({item}) => <Text style={styles.subtitle}>{item.Name}</Text>}
          />
          </View>
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
          <Text style={styles.title}>Enviando</Text>
        </View>
      );
    }
    if (this.state.screen === 'home') {
      return this.HomeScreen();
    }
    else if (this.state.screen === 'checker') {
      return this.CheckerFoodScreen();
    }
    else if (this.state.screen === 'reporter') {
      return this.ReporterScreen();
    }
  }
}
