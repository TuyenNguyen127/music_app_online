import React, {useState, useEffect,useContext} from "react";
import { TouchableOpacity, View, StatusBar, Modal, TouchableWithoutFeedback, FlatList, ScrollView} from "react-native";
import styled from "styled-components";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {Colors, Images, Metrics} from '/Constants';
import { McText, McImage, PlayButton } from 'Components';
import { dummyData } from 'Mock';
import BottomBar from './BottomBar';
import { MusicContext } from "../../Context/MusicProvider";
import TrackPlayer from "react-native-track-player";

const Favorite = ({navigation}) => {
    const context = useContext(MusicContext);
    const {currentSong, isPlaying, resume, pause , host} = context;
    const [dataFavorite, setDataFavorite] = useState([]);
    const [user, setUser] = useState({});
    const [modalDelVisible, setModalDelVisible] = useState(false);
    const [selectedSong, setSelectedSong] = useState(null);

    const getFavorite = async (id) => {
        fetch("https://d882-2402-800-62d0-f334-3c96-4e34-4204-67b2.ap.ngrok.io/user/"+id+"/favorite-song", {
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
                setDataFavorite(data_.data.favorite_song)
            } else {
                alert(data_.message);
            }
        })
        .catch(error => {
            console.log("Have error: ", error )
            getFavorite(id);
        })
    }

    const deleteSong = async (id) => {
        fetch("https://d882-2402-800-62d0-f334-3c96-4e34-4204-67b2.ap.ngrok.io/user/delete-song-from-favorite", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                 'Cache-Control': 'no-cache'
            },
            body: JSON.stringify({user_id: user._id, song_id: id}),
        }
        )
        .then(response => {
            return response.text()
        })
        .then(data => {
            let data_ = JSON.parse(data);
            alert(data_.message);
            getFavorite(user._id)
        })
        .catch(error => {
            console.log("Have error: ", error )
            deleteSong(id);
        })
    }

    const getDataUser = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@user')
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch(e) {
            console.log(e);
        }
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

    const storeDataMusic = async (value) => {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem('@selectedMusic', jsonValue);
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getDataUser().then(value => {
                setUser(value);
                getFavorite(value._id);
            })
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
            <McText bold size={14} color={Colors.grey5}>Danh sách bài hát yêu thích</McText>
            <View/>
        </HeaderSection>

        <FlatList
            data={dataFavorite}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
                <TouchableWithoutFeedback onPress={async () => {
                    await TrackPlayer.reset();
                    await TrackPlayer.add(item)
                    storeDataMusic(item);
                    navigation.navigate('Player');
                }}>
                <FavoriteItemView>
                    <View style={{ flexDirection: "row" }}>                        
                        <McImage source={{uri: item.artwork}} style={{height: 42, width: 42, borderRadius: 21}}/>          
                        <View style={{ marginLeft: 12,width: 259 - 24 }}>
                            <McText semi size={14} color={Colors.grey5}>
                                {item.title}
                            </McText>
                            <McText medium size={12} color={Colors.grey3} style={{ marginTop: 4 }}>
                                {item.artist[0].name}
                            </McText>
                        </View>
                        <TouchableOpacity onPress={() => {
                            setModalDelVisible(true);
                            setSelectedSong(item);
                        }}>
                            <McImage source={Images.menu_n} />
                        </TouchableOpacity>
                        <Modal animationType="slide" transparent={true} visible={modalDelVisible}>
                            <View style={{
                                marginLeft: 30,
                                marginRight: 30,
                                marginTop: 530,
                                aliginItems: 'center',
                                backgroundColor: Colors.grey4,
                                borderRadius: 10
                            }}>
                                <View style={{marginTop: 10,paddingHorizontal: 20}}>
                                    <McText>Bạn có muốn xóa bài hát "{selectedSong?.title}" khỏi danh sách yêu thích ?</McText>
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
                                        deleteSong(selectedSong?._id)
                                    }}>
                                        <McText>Có</McText>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                    </View>
                    
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
    marginHorizontal: 15px;
    marginVertical: 10px;
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

const MusicCirle = styled.View`
    width: 42px;
    height: 42px;
    border-radius: 42px;
    background_color: ${Colors.secondary};
    justify-content: center;
    align-items: center;
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

export default Favorite;