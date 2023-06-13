import React, { useState, useEffect, useRef, useContext } from "react";
import { StatusBar, Text, TouchableOpacity, View, Animated, Easing, ScrollView, PermissionsAndroid } from "react-native";
import styled from "styled-components";
import Slider from "@react-native-community/slider";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Colors, Images, Metrics } from "/Constants";
import { McText, McImage, PlayButton } from "Components";
import Swiper from "react-native-swiper";
import { MusicContext } from "../../Context/MusicProvider";
import TrackPlayer, { useProgress } from 'react-native-track-player';
import RNFetchBlob from "rn-fetch-blob";

const Player = ({ navigation}) => {
    const { position, duration } = useProgress()
    const [lyrics, setLyrics] = useState(null);
    const spinValue = useRef(new Animated.Value(0)).current;
    const context = useContext(MusicContext);
    const [isPlaying_ , setIsPlaying] = useState(false);
    const {currentSong, host } = context;
    const [pathURL, setPath] = useState('http://');
    const [user, setUser] = useState({});

    const addSongToFavorite = async (id) => {
        fetch("https://d882-2402-800-62d0-f334-3c96-4e34-4204-67b2.ap.ngrok.io/user/favorite/add-song", {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            },
            body: JSON.stringify({
                user_id: user._id,
                song_id: id
            })
        }
        )
        .then(response => {
            return response.text()
        })
        .then(data => {
            let data_ = JSON.parse(data);
            alert(data_.message);
        })
        .catch(error => {
            console.log("Have error: ", error )
            addSongToFavorite(id);
        })
    }

    const storeDataMusic = async (value) => {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem('@selectedMusic', jsonValue);
        } catch (e) {
            console.log(e);
        }
    }

    const getDataUser = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@user')
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch(e) {
            console.log(e);
        }
    }
    
    // Load nhạc
    async function loadSound() {
        try {
            await TrackPlayer.play();
            let trackIndex = await TrackPlayer.getCurrentTrack();
            let trackObject = await TrackPlayer.getTrack(trackIndex);
            setIsPlaying(true);
            const lyrics = trackObject.lyric;
            const sentences = lyrics.split(/\n/);
            setLyrics(sentences);
            getDataUser().then(value => {
                setUser(value);
            });
            setPath(trackObject.url)
        } catch (error) {
            console.error(error);
        }
    }
    
    // Khởi động component
    useEffect(() => {
        loadSound(); 
        spinAnimation();
    }, []);

    // Phát nhạc đoạn ấn vào trên thanh slider
    const handleSlidingComplete = async (value) => {
        const newPosition = value * duration;
        await TrackPlayer.seekTo(newPosition);
    };

    // Chơi hoặc tạm dừng
    const handlePlayPress = async () => {
        try {
            if (isPlaying_) {
                await TrackPlayer.pause();
                setIsPlaying(false);
            } else {
                await TrackPlayer.play();
                setIsPlaying(true);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleNext = async () => {
        try {
            await TrackPlayer.skipToNext();
            let trackIndex = await TrackPlayer.getCurrentTrack();
            let trackObject = await TrackPlayer.getTrack(trackIndex);
            await storeDataMusic(trackObject);
            loadSound();
        } catch (error) {
            console.error(error);
        }
    };

    const handlePrevious = async () => {
        try {
            await TrackPlayer.skipToPrevious();
            let trackIndex = await TrackPlayer.getCurrentTrack();
            let trackObject = await TrackPlayer.getTrack(trackIndex);
            await storeDataMusic(trackObject);
            loadSound();
        } catch (error) {
            console.error(error);
        }
    };

    // Tạo format cho thời gian của bài hát
    const formatTime = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(totalSeconds % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    // Thiết lập giá trị vòng quay
    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });
    
    // Tạo hoạt ảnh quay
    const spinAnimation = () => {
        Animated.timing(spinValue, {
            toValue: 1,
            duration: 100000,
            easing: Easing.linear,
            useNativeDriver: true,
        }).start(() => {
            spinValue.setValue(0);
            spinAnimation();
        });
    };

    const requestStoragePermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: 'Downloader App Storage Permission',
                    message:
                        'Downloader App needs access to your storage ' +
                        'so you can download files',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK'
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                downloadFile();
            } else {
                console.log('storage permission denied');
            }
        } catch (err) {
            console.warn(err);
        }
    };

    const downloadFile = () => {
        const {config, fs} = RNFetchBlob;
        const fileDir = fs.dirs.DownloadDir;
        config({
            // add this option that makes response data to be stored as a file,
            // this is much more performant.
            fileCache: true,
            addAndroidDownloads: {
            useDownloadManager: true,
            notification: true,
            path: fileDir +'/'+ currentSong.title + '-' + currentSong.artist + '.mp3'
            },
        })
        .fetch('GET', pathURL, {
          //some headers ..
        })
    };

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
                <McImage source={Images.menu}/>
            </HeaderSection>
            
            {/* Thông tin bài hát */}
            <SwiperBanner>
                <Swiper loop={false}    horizontal
                            showsButtons={true}
                            paginationStyle={{ top: -450}}
                            dot={<View style={{
                                    backgroundColor:'#464646', 
                                    width: 5, 
                                    height: 5,
                                    borderRadius: 5, 
                                    marginLeft: 3, 
                                    marginRight: 3, 
                                    marginTop: 3, 
                                    marginBottom: 3,}} 
                            
                                />}
                            activeDot={<View style={{
                                    backgroundColor: '#B90078',
                                    width: 20,
                                    height: 5,
                                    borderRadius: 40, 
                                    marginLeft: 3, 
                                    marginRight: 3, 
                                    marginTop: 3, 
                                    marginBottom: 3,}} />
                    }>

                    <MusicDetailSection>
                        <Animated.Image source={{uri: currentSong?.artwork}} style={{
                            marginHorizontal: 81,
                            marginVertical: 20,
                            width: 250,
                            height: 250,
                            borderRadius: 250/2,
                            transform: [{ rotate: spin }]
                        }}/>
                        <View style={{
                            marginTop:16,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <McText semi size={20} color={Colors.grey5} align='center'>{currentSong?.title}</McText>
                            <McText medium size={14} color={Colors.grey3} style={{marginTop: 8}} align='center'>{currentSong?.artist}</McText>
                        </View>
                    </MusicDetailSection>

                    <View style={{marginLeft: 10}}>
                        <DetailLyricSection>
                            <McImage source={{uri: currentSong?.artwork}} style={{
                                width: 50,
                                height:50,
                                borderRadius: 10
                            }}></McImage>
                            <View style={{ marginLeft: 12 }}>
                                <McText semi size={14} color={Colors.grey5}>
                                    {currentSong?.title}
                                </McText>
                                <McText medium size={12} color={Colors.grey3} style={{ marginTop: 4 }}>
                                    {currentSong?.artist}
                                </McText>
                            </View>
                        </DetailLyricSection>
                        <ScrollView>
                            {lyrics?.map((sentence, index) => (
                                <McText key={index} color={Colors.primary} align='center' size={18} style={{
                                    marginVertical: 3
                                }}>
                                {sentence.trim()}
                                </McText>
                            ))}
                        </ScrollView>
                    </View>
                    
                </Swiper>
            </SwiperBanner>


            {/* Thanh phát nhạc */}
            <SliderSection style={{marginTop: 8}}>
                <Slider
                    minimumValue={0}
                    maximumValue={1}
                    value={position / duration ? position / duration : 0}
                    onSlidingStart={''}//
                    onValueChange={''}//
                    onSlidingComplete={handleSlidingComplete}//
                    minimumTrackTintColor={Colors.primary}
                    maximumTrackTintColor={Colors.grey3}
                    thumbImage={Images.thumb}
                />
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <McText size={12} color={Colors.grey4}>{formatTime(position)}</McText>
                    <McText size={12} color={Colors.grey4}>{formatTime(duration)}</McText>
                </View>
            </SliderSection>

            {/* Tập hợp nút điều khiển */}
            <ControlSection>
                <McImage source={Images.refresh}/>
                <View style={{
                    width: 231,
                    height: 70,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <View style={{
                        width: 231,
                        height: 54,
                        borderRadius: 54,
                        backgroundColor: Colors.secondary,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <TouchableOpacity onPress={handlePrevious}>
                            <McImage source={Images.back} style={{marginLeft: 24}}/>
                        </TouchableOpacity>
                        
                        <View style={{
                            width: 88,
                            height: 88,
                            borderRadius: 88,
                            backgroundColor: Colors.background,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <PlayButton size={70} circle={62.82} icon={isPlaying_ ? Images.stop : Images.play} onPress={handlePlayPress}></PlayButton>
                        </View>
                        
                        <TouchableOpacity onPress={handleNext}>
                            <McImage source={Images.next} style={{marginRight: 24}}/>   
                        </TouchableOpacity>
                        
                    </View>
                </View>
                <McImage source={Images.speedUp}/>
            </ControlSection>
            <ButtonSection>
                <TouchableOpacity onPress={() => {
                    addSongToFavorite(currentSong?._id);
                }}>
                    <McImage source={Images.like} style={{
                        marginLeft: 24
                    }}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{navigation.navigate('MyPlaylist', {id_song: currentSong?._id}), console.log(currentSong?._id)}}>
                    <McImage source={Images.inplayList}/>
                </TouchableOpacity>
                
                <TouchableOpacity onPress={requestStoragePermission}>
                    <McImage source={Images.download}/>
                </TouchableOpacity>
                
                <McImage source={Images.share} style={{
                    marginRight: 24
                }}/>
            </ButtonSection>
        </Container>
    );}

const Container = styled.SafeAreaView`
    flex: 1;
    background_color: ${Colors.background};
`;

const HeaderSection = styled.View`
    margin: 12px 24px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const MusicDetailSection = styled.View`
    margin: 0px 24px;
    justify-content: center;
    align-items: center;
`;

const SwiperBanner = styled.View`
    marginTop: 30px;
    height: 429px;
    width: 327px;
    alignSelf: center;
`;

const SliderSection = styled.View`
    margin: 0px 24px;
`;

const ControlSection = styled.View`
    margin: 32px 24px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const ButtonSection = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const DetailLyricSection = styled.View`
    flex-direction: row;
    height: 54px;
`;

export default Player;