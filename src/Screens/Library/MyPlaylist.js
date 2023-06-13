import React, {useState, useEffect, useContext} from 'react';
import { TouchableOpacity, View, StatusBar, TextInput, TouchableWithoutFeedback, FlatList, Modal} from "react-native";
import styled from "styled-components";

import {Colors, Images, Metrics} from '/Constants';
import { McText, McImage, PlayButton } from 'Components';
import BottomBar from './BottomBar';
import { MusicContext } from "../../Context/MusicProvider";
import AsyncStorage from '@react-native-async-storage/async-storage';


const MyPlaylist = ({navigation, route}) => {
    const context = useContext(MusicContext);
    const [songItem, setSongItem] = useState({id_song: null});
    const [currentPlaylist, setCurrentPlaylist] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalAddVisible, setModalAddVisible] = useState(false);
    const [playlistName, setPlaylistName] = useState('');
    const {currentSong, isPlaying, resume, pause , host} = context;
    const [playlist, setPlaylist] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null)
    const [modalDelVisible, setModalDelVisible] = useState(false)
    const [user, setUser] = useState({});

    const getPlaylist = async (id) => {
        fetch("https://d882-2402-800-62d0-f334-3c96-4e34-4204-67b2.ap.ngrok.io/user/"+id+"/get-playlist", {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            }
        }
        )
        .then(response => {
            return response.text()
        })
        .then(data => {
            let data_ = JSON.parse(data);
            if (data_.success) {
                setPlaylist(data_.data)
            } else {
                alert(data_.message);
            }
        })
        .catch(error => {
            console.log("Have error: ", error )
            getPlaylist(id);
        })
    }

    const addSongToPlaylist = async (id) => {
        fetch("https://d882-2402-800-62d0-f334-3c96-4e34-4204-67b2.ap.ngrok.io/user/playlist/add-song", {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            }, 
            body: JSON.stringify({
                user_id: user._id,
                playlist_id: id,
                song_id: songItem.id_song
            })
        }
        )
        .then(response => {
            return response.text()
        })
        .then(data => {
            let data_ = JSON.parse(data);
            getPlaylist(user._id);
            alert(data_.message);
        })
        .catch(error => {
            console.log("Have error: ", error )
            addSongToPlaylist(id);
        })
    }

    const deletePlaylist = async (id) => {
        fetch("https://d882-2402-800-62d0-f334-3c96-4e34-4204-67b2.ap.ngrok.io/user/"+user._id+"/playlist/" + id, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            }
        }
        )
        .then(response => {
            return response.text()
        })
        .then(data => {
            let data_ = JSON.parse(data);
            alert(data_.message);
            getPlaylist(user._id)
        })
        .catch(error => {
            console.log("Have error: ", error )
            deletePlaylist(id);
        })
    }

    const createPlaylist = async (name) => {
        fetch("https://d882-2402-800-62d0-f334-3c96-4e34-4204-67b2.ap.ngrok.io/user/playlist/", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            }, 
            body: JSON.stringify({
                user_id: user._id,
                playlist_name: name,
                song_id: []
            })
        }
        )
        .then(response => {
            return response.text()
        })
        .then(data => {
            let data_ = JSON.parse(data);
            alert(data_.message);
            getPlaylist(user._id)
        })
        .catch(error => {
            console.log("Have error: ", error )
            createPlaylist(name);
        })
    }

    const handlePlayPress = async () => {
        try {
            if (isPlaying) {
                await pause();
            } else {
                await resume();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleCancel = () => {
        setModalAddVisible(false);
        setModalVisible(false);
        setPlaylistName('');
    };

    const handleOk = () => {
        if (playlistName) {
            // Xử lý thông tin playlist tại đây
            setModalVisible(false);
            createPlaylist(playlistName);
            setPlaylistName('');
        } else {
            alert('Vui lòng nhập tên playlist');
        }
    };

    const getDataUser = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@user')
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch(e) {
            console.log(e);
        }
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getDataUser().then(value => {
                getPlaylist(value._id);
                setUser(value);
            })
            setSongItem(route.params);
            console.log(songItem);
        });
        
        return unsubscribe;
    }, [navigation]);

    return(
    <Container>
        <StatusBar barStyle='light-content'/>

        {/* Thanh chức năng */}
        <HeaderSection>
            <TouchableOpacity onPress={()=>{
                navigation.goBack();
            }}>
                <McImage source={Images.left}/>
            </TouchableOpacity>
            <McText bold size={14} color={Colors.grey5}>Danh sách kết hợp</McText>
            <McImage source={Images.menu}/>
        </HeaderSection>
        
        <TouchableOpacity onPress={() => {setModalVisible(true), console.log(modalVisible)}}>
            <FavoriteItemView>
                <View style={{ flexDirection: "row" }}>                                               
                    <McImage source={require('Assets/images/new_playlist.png')} style={{height: 50, width: 50, borderRadius: 10}}/>                                  
                    <View style={{ marginLeft: 12,width: 259 - 24, justifyContent: 'center' }}>
                        <McText semi size={14} color={Colors.grey5}>
                            Thêm danh sách phát mới
                        </McText>
                    </View>
                </View>   
            </FavoriteItemView>
        </TouchableOpacity>
        
        <FlatList
            data={playlist}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
                <TouchableWithoutFeedback onPress={() => {
                    console.log(songItem?.id_song);
                    if (songItem?.id_song === null) navigation.navigate('InPlaylist', {selected: item});
                    else {
                        setModalAddVisible(true);
                        setCurrentPlaylist(item);
                    }
                }}>
                    <FavoriteItemView>
                        <View style={{ flexDirection: "row" }}>                                               
                            <McImage source={{uri: item.thumbnail}} style={{height: 50, width: 50, borderRadius: 10}}/>                                  
                            <View style={{ marginLeft: 12,width: 259 - 24 }}>
                                <McText semi size={14} color={Colors.grey5}>
                                    {item.name}
                                </McText>
                                <McText medium size={12} color={Colors.grey3} style={{ marginTop: 4 }}>
                                    {item.list_of_songs.length} bài hát
                                </McText>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => {
                            setModalDelVisible(true);
                            setSelectedPlaylist(item);
                        }}>
                            <McImage source={Images.menu_n} />
                        </TouchableOpacity>
                        <Modal animationType="slide" transparent={true} visible={modalDelVisible}>
                            <View style={{
                                marginLeft: 30,
                                marginRight: 30,
                                position: "absolute",
                                bottom: 100,
                                backgroundColor: Colors.grey4,
                                borderRadius: 10
                            }}>
                                <View style={{marginTop: 10,paddingHorizontal: 20}}>
                                    <McText>Bạn có muốn xóa "{selectedPlaylist?.name}" khỏi các danh sách kết hợp ?</McText>
                                </View>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginHorizontal: 50,
                                    marginVertical: 20
                                }}>
                                    <TouchableOpacity onPress={() => {setModalDelVisible(false)}}>
                                        <McText>Không</McText>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => {
                                        setModalDelVisible(false);
                                        deletePlaylist(selectedPlaylist?._id)
                                    }}>
                                        <McText>Có</McText>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                        <Modal animationType="slide" transparent={true} visible={modalVisible}>
                            <View style={{
                                marginLeft: 30,
                                marginRight: 30,
                                position: "absolute",
                                bottom: 100,
                                backgroundColor: Colors.grey4,
                                borderRadius: 10
                            
                            }}>
                                <View style={{marginTop: 10,alignItems: 'center'}}>
                                    <McText>Tạo playlist mới :</McText>
                                    <TextInput
                                        onChangeText={setPlaylistName}
                                        value={playlistName}
                                        style={{ textAlign: 'center', marginTop: 10, width: 300}}
                                        placeholder='Nhập tên playlist mới'
                                        placeholderTextColor={Colors.grey3}
                                        maxLength={30}
                                    />
                                </View>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginHorizontal: 50,
                                    marginVertical: 20,
                                }}>
                                    <TouchableOpacity onPress={handleCancel}>
                                        <McText>Hủy</McText>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={handleOk}>
                                        <McText>Xong</McText>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                        <Modal animationType="slide" transparent={true} visible={modalAddVisible}>
                            <View style={{
                                marginLeft: 30,
                                marginRight: 30,
                                position: "absolute",
                                bottom: 100,
                                backgroundColor: Colors.grey4,
                                borderRadius: 10
                            
                            }}>
                                <View style={{marginTop: 10,alignItems: 'center', paddingHorizontal: 10, width: 300}}>
                                    <McText>Bạn có muốn thêm bài hát vào {currentPlaylist?.name}</McText>
                                </View>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginHorizontal: 50,
                                    marginVertical: 20
                                }}>
                                    <TouchableOpacity onPress={handleCancel}>
                                        <McText>Không</McText>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => {
                                        addSongToPlaylist(currentPlaylist._id);
                                        setModalAddVisible(false);
                                        setSongItem({id_song: null});
                                    }}>
                                        <McText>Có</McText>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>   
                    </FavoriteItemView>
                </TouchableWithoutFeedback>
            )}
        />
        <View style={{
                        height:84,
                        marginTop: 30
                    }}
        ></View>
        
        <BottomSection>
                <BottomBar>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignContent: 'center',
                        alignItems: 'center',
                        marginHorizontal: 16,
                        marginVertical: 12
                    }}> 
                        <TouchableOpacity onPress={() => {navigation.navigate('Player')}}>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}>
                                <McImage source={{uri: currentSong?.artwork}} style={{
                                    width: 38,
                                    height: 38,
                                    borderRadius: 19
                                }}/>
                                <View style={{marginLeft:12, width:199 - 12}}>
                                    <McText bold size={12} color={Colors.grey5}>
                                        {currentSong?.title}
                                    </McText>
                                    <McText medium size={10} color={Colors.grey3} style={{marginTop: 4}}>{currentSong?.artist}</McText>
                                </View>
                            </View>
                        </TouchableOpacity>
                        
                        <PlayButton size={46} circle={41.28} icon={isPlaying ? Images.stop : Images.play} onPress={handlePlayPress}></PlayButton>
                    </View>
                </BottomBar>
        </BottomSection>
        
    </Container>
)}

const Container = styled.SafeAreaView`
    flex: 1;
    background_color: ${Colors.background};
`;

const HeaderSection = styled.View`
    marginTop: 12px;
    width: 327px;
    height: 30px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    alignSelf: center;
`;

const FavoriteItemView = styled.View`
    margin: 10px 24px;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
`;

const BottomSection = styled.View`
    margin: 0px 24px;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start; 
    position: absolute;
    bottom: 10px;
    left: 0px;
    z-index: 1;
`;

export default MyPlaylist;