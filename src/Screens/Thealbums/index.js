import React, { useState, useEffect, useRef, useContext } from "react";
import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import { View, TouchableOpacity, StatusBar, FlatList, TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Colors, Images, Metrics} from '/Constants';
import { McText, McImage, PlayButton } from 'Components';
import { dummyData } from 'Mock';
import BottomBar from '../Library/BottomBar';
import { MusicContext } from "../../Context/MusicProvider";
import TrackPlayer from "react-native-track-player";

const Thealbums = ({ navigation, route }) => {
    const [likeAlbum, setlikeAlbum] = useState(false);
    const context = useContext(MusicContext)
    const {currentSong, isPlaying, resume, pause, host } = context;
    const [data, setData] = useState({artist_id:{}, list_of_songs:[]})

    const getAlbum = async (id) => {
        fetch("https://d882-2402-800-62d0-f334-3c96-4e34-4204-67b2.ap.ngrok.io/album/"+ id, {
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
        .then(async data => {
            let data_ = JSON.parse(data);
            if (data_.success) {
                setData(data_.data)
                console.log(data_.data.list_of_songs.length);
                await TrackPlayer.add(data_.data.list_of_songs);
            } else {
                alert(data_.message);
            }
        })
        .catch(error => {
            console.log("Have error: ", error )
            getAlbum(id);
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

    const getDataMusic = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@selectedMusic')
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch(e) {
            console.log(e);
        }
    }

    async function load() {
        try {
            await TrackPlayer.reset();
            await getDataMusic().then(async (value) => {
                await TrackPlayer.add(value);
            })
        } catch(error) {
            console.log(error);
        }
    }

    useEffect(() => {
        let { id } = route.params;
        getAlbum(id);
        load();
    }, []);

    const clickLikeAlbum = async () => {
        if (likeAlbum) {
            setlikeAlbum(false);
        } else {
            setlikeAlbum(true);
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

    return (
        <Container>
            <StatusBar barStyle='light-content'/>

            <HeaderSection>
                <TouchableOpacity onPress={()=>{
                    navigation.goBack();
                }}>
                    <McImage source={Images.left}/>
                </TouchableOpacity>
                <McImage source={Images.menu}/>
            </HeaderSection>
            
            <DetailSection>
                <McImage source={{uri: data?.thumbnail}} style={{
                    alignItems: 'center',
                    marginVertical: 4,
                    width: 180,
                    height: 180,
                    borderRadius: 20,
                }}/>
                <View style={{
                    marginTop:16,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <McText semi size={24} color={Colors.grey5} align='center'>{data?.name} the album</McText>
                    <McText medium size={14} color={Colors.grey3} style={{marginTop: 8}} align='center'>{data?.artist_id.name} - {data?.list_of_songs.length} bài hát</McText>
                </View>
            </DetailSection> 
            
            <SelectOptionSection>   
                <ContactSection style={{marginLeft: 10}}>
                    <TouchableWithoutFeedback onPress={clickLikeAlbum}>
                        <McImage source={likeAlbum ? Images.fullLike : Images.like}/>
                    </TouchableWithoutFeedback>
                    <McText medium color={Colors.grey3} size={10}>{data?.num_liked}</McText>
                </ContactSection>
                
                
                <TouchableOpacity onPress={async ()=>{
                    await TrackPlayer.skip(Math.random() * data?.list_of_songs.length);
                    await TrackPlayer.play();
                }} 
                style={{
                    height: 40,
                    width: 200,
                    borderRadius: 40,
                    justifyContent: 'center',
                    alignItems:'center',
                    backgroundColor: Colors.secondary
                }}>
                    <McText bold color={Colors.grey5} size={14}>Phát ngẫu nhiên</McText>
                </TouchableOpacity>
                <ContactSection style={{marginRight: 10}}>
                    <McImage source={Images.share}/>
                    <McText medium color={Colors.grey3} size={10}>{data?.num_shared}</McText>
                </ContactSection>
                
            </SelectOptionSection>
            
            <McText semi align='center' size={12} style={{
                marginVertical: 25,
                color: Colors.grey3
            }}>{data?.description}</McText>

            <View style={{height: 204, width: 327, alignSelf: 'center'}}>
                <FlatList
                    data={data.list_of_songs}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item, index }) => {
                            return (
                                <TouchableWithoutFeedback onPress={async () => {
                                    await storeDataMusic(item);
                                    await TrackPlayer.skip(index + 1);
                                    navigation.navigate('Player')
                                }}>
                                <FavoriteItemView>
                                    <View style={{ flexDirection: "row" }}>
                                        <McImage source={{uri: item.artwork}} style={{height: 42, width: 42, borderRadius: 21}}/>
                                        <View style={{ marginLeft: 12, width: 246 }}>
                                            <McText semi size={14} color={Colors.grey5}>
                                                {item.title}
                                            </McText>
                                            <McText medium size={12} color={Colors.grey3} style={{ marginTop: 4 }}>
                                                {data?.artist_id.name}
                                            </McText>
                                        </View>
                                    </View>
                                </FavoriteItemView>
                                </TouchableWithoutFeedback>
                            )
                    }}   
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
    );
};

const Container = styled(LinearGradient).attrs({
        colors: ['#D512C1','#1A0938','#1A0938'],
        start: { x: 1, y: 0 },
        end: { x: 1 , y: 1 },
    })`
    flex: 1;
`;

const HeaderSection = styled.View`
    margin: 12px 24px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const DetailSection = styled.View`
    margin: 0px 24px;
    justify-content: center;
    align-items: center;
`;

const SelectOptionSection = styled.View`
    marginTop: 16px;
    width: 327px;
    height: 30px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    alignSelf: center;
`;

const ContactSection = styled.View`
    margin: 0px 24px;
    justify-content: center;
    align-items: center;
`;

const FavoriteItemView = styled.View`
    marginBottom: 12px;
    flex-direction: row;
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
    marginTop: 10px;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start; 
    position: absolute;
    bottom: 5px;
    left: 0px;
    z-index: 1;
`;
export default Thealbums;
