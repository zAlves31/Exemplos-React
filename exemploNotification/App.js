import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityBase, View } from 'react-native';

//Importar os recursos da biblioteca
import * as Notifications from "expo-notifications"

//solicitar as permissoes de notificacao ao iniciar o app
Notifications.requestPermissionsAsync();

//definir como as notificacoes devem ser tratadas quando recebidas
Notifications.setNotificationHandler({
  handleNotification: async () => ({

    //mostra o alerta quando a notificacao for recebida
    shouldShowAlert: true,

    //reproduz ou nao som ao receber a notificacao
    shouldPlaySound:true,

    //configura numero de notificacoes no icone do app
    shouldSetBadge:false,

  })
})

export default function App() {

  //funcao para lidar com a chamada da notificacao
  const handleNotification = async () => {
   
    //obtem o status da permisssao
    const {status} = await Notifications.getPermissionsAsync();

    if(status !== "granted" ){
      alert("voce nao deixou as notificacoes ativas");
      return;
    }

    //obter o token de envio de notificacao
    const token = await Notifications.getExpoPushTokenAsync();
    console.log(token);

    //agendar uma notificacao para ser exibida apos 5 segundos
    await Notifications.scheduleNotificationAsync({
      content:{
        title: "Exemplo de notificacao",
        body:"Criando uma POC para implementar expo notifications",
        sound:"assets/belligol-belligol-belligham-e-ele.mp3",
      },
      trigger:null
    })

  };


  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleNotification}>
        <Text style={styles.text}>Notificação</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
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

  button:{
    backgroundColor:"#BB59E6",
    width:"80%" ,
    height:70,
    borderRadius:20,
    alignItems:'center',
    justifyContent:'center',
  },
  
  text:{
    color:'#FFFFFF',
    fontSize:20,
  },

  
});
