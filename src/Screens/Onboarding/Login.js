import React, { useContext, useEffect, useState } from "react";
import { TextInput, View, StatusBar, TouchableOpacity} from "react-native";
import styled from "styled-components";

import {Colors, Images, Metrics, Fonts} from 'Constants';
import { McText, McImage, PlayButton } from 'Components';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MusicContext } from "../../Context/MusicProvider";


const Login = ({navigation}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const context = useContext(MusicContext);
    const {host} = context;
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        fetch("https://d882-2402-800-62d0-f334-3c96-4e34-4204-67b2.ap.ngrok.io/login", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            },
            body: JSON.stringify({email: email, password: password}),
        }
        )
        .then(response => {
            return response.text()
        })
        .then(data => {
            let data_ = JSON.parse(data);
            if (data_.success) {
                alert('Đăng nhập thành công');
                storeDataUser(data_.user)
                setTimeout(()=> navigation.navigate('Home'), 1000 )
            } else {
                alert("Đăng nhập thất bại! \n\n"+ data_.message);
            }
        })
        .catch(error => {
            console.log("Have error: ", error )
        })
    }

    const storeDataUser = async (value) => {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem('@user', jsonValue);
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <Container>
            <StatusBar barStyle='light-content'/>
            <McImage source={Images.logo} style={{marginTop: 40}}/>

            <McText color={Colors.primary} size={24} black>The sound of life</McText>

            <McText color={Colors.grey4} size={14} medium align='center' style={{
                marginHorizontal: 51,
                marginTop: 8
            }}> Music is not an entertainment, but also it is our life </McText>

            <McText color={Colors.grey4} size={24} bold align='center' style={{
                marginTop: 28
            }}> Đăng nhập </McText>

            <View style={{
                height: 275,
                justifyContent: 'center',
                alignItems: 'center',
                
            }}>
                <InputSection>
                    <McImage 
                        source={Images.profile}
                        style={{height: 24, width: 24, marginLeft: 16, marginRight:12}}
                    ></McImage>
                    <TextInput 
                        placeholder="Email đăng nhập"
                        placeholderTextColor={Colors.grey3}
                        style={{
                            color: Colors.grey4,
                            
                        }}
                        value={email}
                        onChangeText={txt => setEmail(txt)}
                    ></TextInput>
                </InputSection>
                <InputSection>
                    <McImage 
                        source={Images.password}
                        style={{marginLeft: 16, marginRight:12}}
                    ></McImage>
                    <TextInput 
                        placeholder="Mật khẩu"
                        placeholderTextColor={Colors.grey3}
                        style={{
                            color: Colors.grey4,
                        }}
                        value={password}
                        onChangeText={txt => setPassword(txt)}
                        secureTextEntry={true}
                    ></TextInput>
                </InputSection>
                <TouchableOpacity style={{marginTop: 28}} onPress={() => {navigation.navigate('ForgetPassword')}}>
                    <McText bold size={12} style={{
                        color: Colors.accent1,
                    }}>
                        Quên mật khẩu ? 
                    </McText>
                </TouchableOpacity>
                
                <View style={{
                    marginTop: 28,
                    flexDirection: 'row'
                }}>
                    <McText bold size={12} style={{
                        color: Colors.grey4
                    }}>Chưa có tài khoản ?</McText>
                    <TouchableOpacity onPress={() => {navigation.navigate('Register')}}>
                        <McText bold size={12} style={{
                            color: Colors.accent1
                        }}> Đăng ký </McText>
                    </TouchableOpacity>
                </View>
            </View>
        

            <View style={{marginTop: 639, position:"absolute"}}>
                <PlayButton 
                    size={78} 
                    circle={70} 
                    icon={Images.right_arrow}
                    onPress={ async (event)=>{
                        await handleSubmit(event)
                    }}
                />
            </View>
        </Container>
)}

const Container = styled.SafeAreaView`
    flex: 1;
    background_color: ${Colors.background};
    justify-content: flex-start;
    align-items: center;
`;

const InputSection = styled.View`
    width: 268px;
    height: 52px;
    border-radius: 30px;
    background_color: ${Colors.secondary};
    marginTop: 28px;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
`;

export default Login;