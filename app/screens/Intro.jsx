import React,{useState} from 'react'
import { Image,
         View , 
         Text, 
         TextInput, 
         StatusBar, 
         StyleSheet,
         Dimensions } from 'react-native'
import colors from '../misc/colors'
import Memo from '../../assets/img/memo.png'
import RoundIconBtn from '../components/RoundIconBtn'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Intro = ({onFinish}) => {
    const [name, setName] = useState('');
    const handleOnChangeText = text =>setName(text);

    const handleSubmit = async()=>{
        const user = {name:name}
        await AsyncStorage.setItem('user',JSON.stringify(user));
        if(onFinish) onFinish();
    };

  return (
    <>
        <StatusBar style="hidden" />
        <View style={styles.container}>
            <Image source={Memo} style={styles.logo} />
            <Text style={styles.inputTitle}>이름을 입력하세요.</Text>
            <TextInput 
               placeholder="이름"
               style={styles.textInput}
               value={name}
               onChangeText={handleOnChangeText}
            />     
            {name.trim().length >= 2 ? (<RoundIconBtn antIconName='arrowright' onPress={(handleSubmit)} /> ):null}
        </View>
    </>
  );
};
const width = Dimensions.get('window').width - 100;
console.log(width);
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: 'center',
        justifyContent: 'center'
    },
    textInput:{
        borderWidth: 2,
        borderColor: colors.PRIMARY,
        width,
        height:50,
        borderRadius: 10,
        paddingLeft:20,
        fontSize:25,
        marginTop:10,
        marginBottom:20 
    },
    inputTitle: {
       alignSelf: 'flex-start',
       paddingLeft:50,
       fontSize: 20,
       opacity:0.5
    },
    logo : { 
       width:100,
       height:100,
       position:'absolute' ,
       top: 100,
       left: width/2
    }
})

export default Intro;