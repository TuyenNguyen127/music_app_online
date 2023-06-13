import React, { useContext, useEffect, useState } from 'react';
import { View, StatusBar, TouchableOpacity } from 'react-native';
import styled, { useTheme } from 'styled-components/native';

import { Fonts, Images, Metrics, Colors } from 'Constants';
import { McText, McImage, McAvatar, PlayButton } from 'Components';
import BottomBar from '../Library/BottomBar';
import { MusicContext } from '../../Context/MusicProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Option = ({ navigation }) => {
    const context = useContext(MusicContext);
    const {currentSong, isPlaying, resume, pause } = context;
    const [user, setUser] = useState({});

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
    const logOut = async () => {
        try {
            await AsyncStorage.removeItem('@user');
        } catch(e) {
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

    useEffect(() => {
        getDataUser().then(value => {
            setUser(value);
        })
    }, [])

    return (
        <Container>
           <StatusBar barStyle='light-content'/>

            <HeaderSection>
                <TouchableOpacity onPress={()=>{
                    navigation.goBack();
                }}>
                    <McImage source={Images.left}/>
                </TouchableOpacity>
                <McText size={15} medium color={Colors.grey5}>Tài khoản</McText>
                <View/>
            </HeaderSection>
            
            <View style={{
                marginTop: 30,
                alignItems: 'center'
            }}>
                <McImage source={Images.profile}></McImage>

                <McText size={14} bold color={Colors.grey5} style={{marginTop: 10}}>{user?.email}</McText>
            </View>
            

            <View style={{marginTop: 72}}>
                <TouchableOpacity onPress={()=>{
                    navigation.navigate('Library');
                }}>
                    <SelectSection>
                        <McText medium size={20} color={Colors.grey4}>Thư viện của tôi</McText>
                        <McImage source={Images.right}/>        
                    </SelectSection>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=>{
                        navigation.navigate('Downloader');
                }}>
                    <SelectSection>
                        <McText medium size={20} color={Colors.grey4}>Đã tải xuống</McText>
                        <McImage source={Images.right}/>        
                    </SelectSection>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=>{
                        navigation.navigate('ResetPassword',{form: true});
                }}>
                    <SelectSection>
                        <McText medium size={20} color={Colors.grey4}>Đổi mật khẩu</McText>
                        <McImage source={Images.right}/>        
                    </SelectSection>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=>{
                        logOut();
                        navigation.navigate('Login');
                }}>
                    <SelectSection>
                        <McText medium size={20} color={Colors.grey4}>Đăng xuất</McText>
                        <McImage source={Images.right}/>        
                    </SelectSection>
                </TouchableOpacity>
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
                                <McImage source={require('Assets/images/Music_Circle.png')} style={{
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
    margin: 12px 24px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const SelectSection = styled.View`
    margin: 20px 24px 0px;
    flex-direction: row;
    justify-content: space-between;
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

export default Option
