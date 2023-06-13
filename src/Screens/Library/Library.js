import React, {useState, useEffect,useContext} from "react";
import { TouchableOpacity, View, StatusBar, TextInput, TouchableWithoutFeedback, FlatList, ScrollView} from "react-native";
import styled from "styled-components";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {Colors, Images, Metrics} from '/Constants';
import { McText, McImage, PlayButton } from 'Components';
import { dummyData } from 'Mock';
import BottomBar from './BottomBar';
import { MusicContext } from "../../Context/MusicProvider";
import TrackPlayer from "react-native-track-player";

const Library = ({navigation}) => {
    const context = useContext(MusicContext);
    const {currentSong, isPlaying, resume, pause , host} = context;
    const [favorite, setFavorite] = useState([]);
    const [playlist, setPlaylist] = useState([]);

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
                setFavorite(data_.data.favorite_song)
            } else {
                alert(data_.message);
            }
        })
        .catch(error => {
            console.log("Have error: ", error )
            getFavorite(id);
        })
    }

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

    const getDataUser = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@user')
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch(e) {
            console.log(e);
        }
    }

    const storeDataMusic = async (value) => {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem('@selectedMusic', jsonValue);
        } catch (e) {
            console.log(e);
        }
    }
    
    const _renderItem = ({ item, index}) => {
        return(
            <TouchableWithoutFeedback onPress={() => {
                 navigation.navigate('InPlaylist', {selected: item});
            }}>
                <View>
                    <View style={{
                        marginTop:16,
                        marginLeft: index === 0? 24:0,
                        marginRight:index === playlist.length - 1?0:24
                    }}>
                    <McImage key={index} source={{uri: item.thumbnail}} style={{marginBottom:12, height: 80, width: 80, borderRadius: 20}}/>
                    <View style={{width: 80}}>
                        <McText semi size={16} color={Colors.grey5}>{item.name}</McText>
                    </View>
                    
                    <McText medium size={12} color={Colors.grey3} style={{
                        marginTop: 4
                    }}>
                        {item.list_of_songs.length} bài hát</McText>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getDataUser().then(value => {
                getFavorite(value._id);
                getPlaylist(value._id);
            })
        });

        return unsubscribe;
    }, [navigation]);
    
    return(
        <Container>
            <StatusBar barStyle='light-content'/>

            <HeaderSection>
                <TouchableOpacity onPress={() =>{ navigation.push('Option')}}>
                    <McImage source={Images.profile} style={{height: 30, width: 30}}></McImage>
                </TouchableOpacity>
                    
                <McText bold align='center'size={28} color={Colors.primary}>My Library</McText>

                <TouchableOpacity onPress={()=> navigation.navigate('Home')}>
                    <McImage source={Images.home}/>
                </TouchableOpacity>
                    
            </HeaderSection>
            
            <TouchableOpacity onPress={()=> {navigation.navigate('Search')}}>
                <SearchSetion>
                    <McImage 
                        source={Images.find}
                        style={{marginLeft: 16, marginRight:12}}lik
                    ></McImage>
                    <McText color={Colors.grey3} size={14}>Tìm kiếm bài hát, nghệ sĩ</McText>
                </SearchSetion>
            </TouchableOpacity>
            

            <TouchableWithoutFeedback onPress={()=>{
                    console.log('Go to Playlist page');
                    navigation.navigate('MyPlaylist', {id_song: null})
                }}>
                <TitleSection>
                    <McText medium size={20} color={Colors.grey4}>Danh sách kết hợp</McText>           
                    <McImage source={Images.right}/>
                </TitleSection>
            </TouchableWithoutFeedback>

            <View>
                <FlatList
                    keyExtractor={(item) => 'playlist_' + item._id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{}}
                    data={playlist}
                    renderItem={_renderItem}
                />

            </View>
            <TouchableWithoutFeedback onPress={()=>{
                    console.log('Go to Favorite page');
                    navigation.navigate('Favorites');
                }}>
                <TitleSection>
                    <McText medium size={20} color={Colors.grey4}>Bài hát yêu thích</McText>
                    <McImage source={Images.right}/>
                </TitleSection>
            </TouchableWithoutFeedback>

            <View style={{marginTop: 10, height: 250}}>
            <FlatList
                data={favorite}
                keyExtractor={(item) => item._id}
                renderItem={({ item, index }) => (
                    <TouchableWithoutFeedback onPress={async () => {
                        await TrackPlayer.reset();
                        await TrackPlayer.add(favorite);
                        await TrackPlayer.skip(index);
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
                                {item.artist}
                                </McText>
                            </View>
                        </View>
                        
                    </FavoriteItemView>
                    </TouchableWithoutFeedback>
                )}
            />
            </View>

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
                        <TouchableOpacity onPress={() => navigation.navigate('Player')}>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}>
                                <McImage source={{uri: currentSong?.artwork}} style={{
                                    width: 38,
                                    height: 38,
                                    borderRadius: 19,
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
    )
}


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

const SearchSetion = styled.View`
    width: 317px;
    height: 52px;
    border-radius: 30px;
    background_color: ${Colors.secondary};
    margin: 20px 24px 0px;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
`;

const TitleSection = styled.View`
    margin: 20px 24px 0px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
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

export default Library;
