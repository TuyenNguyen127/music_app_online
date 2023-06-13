import React, { useState, useEffect, useContext } from "react";
import { StatusBar, Text, TouchableOpacity, View, TextInput, FlatList, TouchableWithoutFeedback } from "react-native";
import styled from "styled-components";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Colors, Images, Metrics } from "/Constants";
import { McText, McImage, PlayButton } from "Components";
import { MusicContext } from "../../Context/MusicProvider";
import BottomBar from "../Library/BottomBar";
import TrackPlayer from "react-native-track-player";


const Search = ({ navigation }) => {
    const context = useContext(MusicContext);
    const {currentSong, isPlaying, resume, pause , host} = context;
    const [textSearch, setTextSerach] = useState(null);
    const [dataSearch, setDataSearch] = useState([], []);
    const search = async () => {
        fetch("https://d882-2402-800-62d0-f334-3c96-4e34-4204-67b2.ap.ngrok.io/search?q=" + textSearch, {
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
                setDataSearch(data_.data)
            } else {
                alert(data_.message);
            }
        })
        .catch(error => {
            console.log("Have error: ", error )
            search();
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
            {/* Thanh chức năng */}
            <HeaderSection>
                <TouchableOpacity onPress={()=>{
                    navigation.goBack();
                }}>
                    <McImage source={Images.left}/>
                </TouchableOpacity>
                <McText bold size={14} color={Colors.grey5}>Tìm kiếm bài hát, nghệ sĩ</McText>
                <View/>
            </HeaderSection>

            <SearchSetion>
                <McImage 
                    source={Images.find}
                    style={{marginLeft: 16, marginRight:12}}
                ></McImage>
                <TextInput 
                    placeholder="Nhập tên bài hát, nghệ sĩ"
                    placeholderTextColor={Colors.grey3}
                    style={{
                        color: Colors.grey4
                    }}
                    value={textSearch}
                    onChangeText={value => setTextSerach(value)}
                    onSubmitEditing={search}
                ></TextInput>
            </SearchSetion>
            
            <View style={{height: 235}}>
                <TitleSection>
                    <McText medium size={15} color={Colors.grey4}> Bài hát : </McText>
                </TitleSection>
                <FlatList
                    data={dataSearch[0]}
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
                                            {item.artist}
                                        </McText>
                                    </View>
                                </View>                       
                            </FavoriteItemView>
                        </TouchableWithoutFeedback>
                    )}
                />
            </View>

            <View style={{height: 235}}>
                <TitleSection>
                    <McText medium size={15} color={Colors.grey4}> Nghệ sĩ : </McText>
                </TitleSection>
                <FlatList
                    data={dataSearch[1]}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <TouchableWithoutFeedback onPress={async () => {
                            navigation.navigate('Theartist',{id: item._id})
                        }}>
                            <FavoriteItemView>
                                <View style={{ flexDirection: "row" }}>                        
                                    <McImage source={{uri: item.thumbnail}} style={{height: 42, width: 42, borderRadius: 21}}/>          
                                    <View style={{ marginLeft: 12,width: 259 - 24 }}>
                                        <McText semi size={14} color={Colors.grey5}>
                                            {item.name}
                                        </McText>
                                        <McText medium size={12} color={Colors.grey3} style={{ marginTop: 4 }}>
                                            Nghệ sĩ
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
    );
};

const Container = styled.SafeAreaView`
    flex: 1;
    background_color: ${Colors.background};
`;
const HeaderSection = styled.View`
    marginVertical: 15px;
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
const TitleSection = styled.View`
    margin: 10px 24px 10px;
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
export default Search;
