import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import moment from 'moment';

import * as LocalAuthentication from 'expo-local-authentication'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect, useState } from 'react';

export default function App() {
  const [ history, setHistory] = useState({})
  const [ authenticated, setAuthenticated] = useState(false)
  const [biometricExist, setBiometricExist] = useState(false)

  async function CheckExistAuthenticates(){
    //Validar se o aparelho tem acesso a biometria
    const compatible = await LocalAuthentication.hasHardwareAsync()
    setBiometricExist( compatible )

    const types = await LocalAuthentication.supportedAuthenticationTypesAsync()
    console.log(LocalAuthentication.AuthenticationType[types[0]]);
  }

  async function handleAuthentication(){
    const biometric = await LocalAuthentication.isEnrolledAsync();

    if ( !biometric) {
      return Alert.alert(
        "Falha ao logar",
        "Não foi encontrado nenhuma biometria cadastrada "
      )
    }

    //Caso exista ->
    const auth = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Login com biometria'
    })

    setAuthenticated( auth.success )

    if(auth.success){
      SetHistory();
    }
  }

  async function SetHistory(){
    const objAuth = {
      dateAuthenticate: moment().format("DD/MM/YYYY HH:mm:ss")
    }

    await AsyncStorage.setItem("authenticate", JSON.stringify( objAuth ))

    SetHistory( objAuth )
  }

  async function GetHistory(){
    const objAuth = await AsyncStorage.getItem("authenticate")

    if( objAuth )
    {
      setHistory( JSON.parse( objAuth ))
    }
  }

  useEffect(() => {
    CheckExistAuthenticates();

    GetHistory()
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {biometricExist ? 'Seu dispositivo e compativel com a Biometria' : 'Seu dispositivo nao suporta o faceId / Biometria'}
      </Text>

      <TouchableOpacity style={styles.btnAuth} onPress={() => handleAuthentication()}>
        <Text style={styles.txtAuth}>Autenticar acesso</Text>
      </TouchableOpacity>

      <Text style={[styles.txtReturn, {color : authenticated ? 'green' : 'red'}]}>
        {authenticated ? 'Autenticado' : 'Não Autenticado'}
      </Text>

      {
        history.dateAuthenticate
        ? <Text style={styles.txtHistory}>Ultimo acesso em {history.dateAuthenticate}</Text> :null
      }
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize : 20,
    textAlign :'center',
    lineHeight:30,
    width:'70%',
  },
  btnAuth: {
    padding:16,
    borderRadius:15,
    backgroundColor: '#5ECCEB',
    marginTop:16,
  },
  txtAuth: {
    color:'#FFF',
    fontSize:20,
    fontWeight:'bold',
  },

  txtReturn: {
    fontSize:22,
    textAlign:'center',
    marginTop :40,
  },

  txtHistory: {
    fontSize:16,
    fontWeight:'bold',
    color:'#858383',
    position: 'absolute',
    bottom:120,
  },
});
