import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, StyleSheet, Text, StatusBar, TouchableWithoutFeedback, Keyboard, FlatList } from 'react-native';
import colors from '../misc/colors';
import SearchBar from '../components/SearchBar';
import { useNotes } from '../contexts/NoteProvider';
import RoundIconBtn from '../components/RoundIconBtn';
import NotFound from '../components/NotFound';
import Note from '../components/Note';
import NoteInputModal from '../components/NoteInputModal';

const reverseData = data => {
    return data.sort((a, b) => {
        const aInt = parseInt(a.time);
        const bInt = parseInt(b.time);
        if (aInt < bInt) return 1;
        if (aInt === bInt) return 0;
        if (aInt > bInt) return -1;
    });
};

const NoteScreen = ({ user, navigation }) => {
    const [greet, setGreet] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [resultNotFound, setResultNotFound] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const { notes, setNotes, findNotes } = useNotes();

    const findGreet = () => {
        const hrs = new Date().getHours();
        if (hrs < 12) return setGreet('Morning');
        if (hrs < 17) return setGreet('Afternoon');
        setGreet('Evening');
    };

    useEffect(() => {
        findGreet();
    }, []);

    const reverseNote = reverseData(notes);

    const handleOnSubmit = async (title, desc) => {
        const note = { id: Date.now(), title, desc, time: Date.now() };
        const updatedNotes = [...notes, note];
        setNotes(updatedNotes);
        await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
    };

    const openNote = (note) => {
        navigation.navigate('NoteDetail', { note });
    };

    const handleOnSearchInput = async (text) => {
        setSearchQuery(text);
        if (!text.trim()) {
            setSearchQuery('');
            setResultNotFound(false);
            return await findNotes();
        }

        const filteredNotes = notes.filter(note => {
            if (note.title.toLowerCase().includes(text.toLowerCase())) {
                return note;
            }
        });
        if (filteredNotes.length) {
            setNotes([...filteredNotes]);
            setResultNotFound(false);
        } else {
            setResultNotFound(true);
        }
    };

    const handleOnClear = async () => {
        setSearchQuery('');
        setResultNotFound(false);
        return await findNotes();
    };

    return (
        <>
            <StatusBar barStyle='dark-content' backgroundColor={colors.LIGHT} />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <Text style={styles.header}>
                        {`Good ${greet} ${user.name} 님!`}
                    </Text>
                    {notes.length ? (
                        <SearchBar
                            value={searchQuery}
                            onChangeText={handleOnSearchInput}
                            containerStyle={{ marginVertical: 15 }}
                            onClear={handleOnClear}
                        />
                    ) : null}
                    {resultNotFound ? (
                        <NotFound />
                    ) : (
                        <FlatList
                            data={reverseNote}
                            numColumns={2}
                            columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 15 }}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <Note onPress={() => openNote(item)} item={item} />
                            )}
                        />
                    )}
                    {!notes.length ? (
                        <View style={[StyleSheet.absoluteFillObject, styles.emptyHeaderContainer]}>
                            <Text style={styles.emptyHeader}>메모하기</Text>
                        </View>
                    ) : null}
                </View>
            </TouchableWithoutFeedback>
            <RoundIconBtn
                antIconName='plus'
                style={styles.addbtn}
                onPress={() => setModalVisible(true)}
            />
            <NoteInputModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSubmit={handleOnSubmit}
            />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        flex: 1,
        zIndex: 1,
    },
    header: {
        marginTop: 15,
        fontSize: 22,
        fontWeight: 'bold',
    },
    emptyHeader: {
        fontSize: 25,
        fontWeight: 'bold',
        opacity: 0.2,
    },
    emptyHeaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: -1,
    },
    addbtn: {
        position: 'absolute',
        right: 30,
        bottom: 40,
        zIndex: 1,
    },
});

export default NoteScreen;