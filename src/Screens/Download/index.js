import React, {useState, useEffect,useContext} from "react";
import { TouchableOpacity, View, StatusBar, TextInput, TouchableWithoutFeedback, FlatList, Modal} from "react-native";
import styled from "styled-components";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {Colors, Images, Metrics} from '/Constants';
import { McText, McImage, PlayButton } from 'Components';
import { dummyData } from 'Mock';
import BottomBar from "../Library/BottomBar";
import { MusicContext } from "../../Context/MusicProvider";
import RNFetchBlob from 'rn-fetch-blob';
import TrackPlayer from "react-native-track-player";

const Downloader = ({navigation}) => {
    const context = useContext(MusicContext);
    const {currentSong, isPlaying, resume, pause } = context;
    const [obj, setObj] = useState(null);

    const getDownload = async () => {
        const downloadDir = RNFetchBlob.fs.dirs.DownloadDir;

        RNFetchBlob.fs.ls(downloadDir)
        .then(async (files) => {
            const mp3Files = files.filter((file) => file.toLowerCase().endsWith('.mp3'));
            // xử lý danh sách các tệp MP3 ở đây
            const songs = mp3Files.map((file, index) => {
                const name = file.replace('.mp3', ''); // loại bỏ đuôi .mp3
                const parts = name.split('-'); // tách chuỗi thành các phần bằng dấu '-'
                const title = parts[0].trim(); // lấy phần tử đầu tiên là tiêu đề
                const artist = parts[1].trim(); // lấy phần tử thứ hai là nghệ sĩ
                const id = String(index);
                return {
                    id,
                    title,
                    artist,
                    url: 'file://' + downloadDir +'/'+ file, // đường dẫn đến tệp nhạc
                };
            })
            setObj(songs);
            
        })
        .catch((error) => {
            console.log(error);
        });
    }

    const storeDataMusic = async (value) => {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem('@selectedMusic', jsonValue);
        } catch (e) {
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

    useEffect(()=> {
        getDownload();
    }, [])
  
    return (
        <Container>
            <StatusBar styled='light-content'/>
            <HeaderSection>
                <TouchableOpacity onPress={()=>{
                    navigation.goBack();
                }}>
                    <McImage source={Images.left}/>
                </TouchableOpacity>
                <McText bold size={14} color={Colors.grey5}>Đã tải xuống</McText>
                <View/>
            </HeaderSection>
            <FlatList
                data={obj}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableWithoutFeedback onPress={async () => {
                        await storeDataMusic(item);
                        try {
                            await TrackPlayer.reset();
                            await TrackPlayer.add(item);
                            await TrackPlayer.play();
                        
                        } catch (e) {
                            console.log('er', e);
                        }
                        
                    }}>
                        <FavoriteItemView>
                            <View style={{ flexDirection: "row" }}>
                                <MusicCirle>
                                    <McImage source={Images.music} />
                                </MusicCirle>
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
                        <TouchableOpacity>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}>
                                <McImage source={require('Assets/images/download_image.png')} style={{
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

const Container = styled.SafeAreaView`
    flex: 1;
    background_color: ${Colors.background};
`;

const HeaderSection = styled.View`
    marginTop: 10px;
    width: 327px;
    height: 30px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    alignSelf: center;
`;

const MusicCirle = styled.View`
    width: 42px;
    height: 42px;
    border-radius: 42px;
    background_color: ${Colors.secondary};
    justify-content: center;
    align-items: center;
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
export default Downloader;