import React, {useState} from 'react'
import { StyleSheet, Text, View, ScrollView, Alert } from 'react-native'
import colors from '../misc/colors'
import RoundIconBtn from './RoundIconBtn'
import { useNotes } from '../contexts/NoteProvider'
import NoteInputModal from './NoteInputModal'
import AsyncStorage from '@react-native-async-storage/async-storage'



const formatDate = (ms) => {
    const date = new Date(ms);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hrs = date.getHours();
    const min = date.getMinutes();
    const sec = date.getSeconds();

    return `${year}-${month}-${day}(${hrs}시 ${min}분 ${sec})`;
};
const NoteDetail = (props) => {
    const [note, setNote] = useState(props.route.params.note);
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const {setNotes} = useNotes();
  

    const deleteNote = async () => {
        const result = await AsyncStorage.getItem('notes');
        let notes = [];
        if(result !== null) notes = JSON.parse(result);

        const newNotes = notes.filter(n => n.id !== note.id);
        setNotes(newNotes);
        await AsyncStorage.setItem('notes', JSON.stringify(newNotes));
        props.navigation.goBack();
    };
    const displayDeleteAlert = () => {
        Alert.alert(
            '정말로 삭제하시겠습니까?',
            '',
            [
                { text:'삭제', onPress: deleteNote },
                { text:'취소', onPress: () => console.log('삭제 취소') },
            ],
        );
    };

    const handleUpdate = async (title, desc, time) => {
        const result = await AsyncStorage.getItem('notes');
        let notes = [];
        if(result !== null) notes = JSON.parse(result);

        const newNotes = notes.map(n => {
            if(n.id == note.id){
                n.title = title;
                n.desc = desc;
                n.time = time;
            }
            return n;
        });

        setNotes(newNotes);
        await AsyncStorage.setItem('notes', JSON.stringify(newNotes));
        setNote({...note, title, desc, time});
    };

    const handleOnClose = () => setShowModal(false);
    const openEditModal = () => {
        setIsEdit(true);
        setShowModal(true);
    };

  return (
    <>
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.time}>
                ${formatDate(note.time)}
            </Text>
            <Text style={styles.title}>{note.title}</Text>
            <Text style={styles.desc}>{note.desc}</Text>
        </ScrollView>
        <View style={styles.btnContainer}>
            <RoundIconBtn antIconName='delete' onPress={displayDeleteAlert} style={{backgroundColor: colors.ERROR, marginBottom:15}}/>
            <RoundIconBtn antIconName='edit' onPress={openEditModal}/>
        </View>
        <NoteInputModal isEdit={isEdit} note={note} onClose={handleOnClose} onSubmit={handleUpdate} visible={showModal}/>
    </>
  );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15,
        paddingTop:10,
    },
    time: {
        textAlign: 'right',
        fontSize: 12,
        opacity: 0.6
    },
    title: {
        fontSize: 30,
        color: colors.PRIMARY,
        fontWeight: 'bold'
    },
    desc: {
        fontSize: 20,
        opacity:0.8
    },
    btnContainer: {
        position:'absolute',
        right:15,
        bottom: 50
    }
})

export default NoteDetail