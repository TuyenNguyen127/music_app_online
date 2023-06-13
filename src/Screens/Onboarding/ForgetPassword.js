import React, { useContext, useState } from "react";
import { TextInput, View, StatusBar, TouchableOpacity} from "react-native";
import styled from "styled-components";

import {Colors, Images, Metrics, Fonts} from 'Constants';
import { McText, McImage, PlayButton } from 'Components';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MusicContext } from "../../Context/MusicProvider";


const ForgetPassword = ({navigation}) => {
    const [numS, setNumS] = useState(true);
    const [email, setEmail] = useState('');
    const [otp, setOTP] = useState('');
    const context = useContext(MusicContext);
    const {host} = context;

    const storeDataUser = async (value) => {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem('@user', jsonValue);
        } catch (e) {
            console.log(e);
        }
    }

    const handleSubmit = () => {
        if (numS) {
            fetch("https://d882-2402-800-62d0-f334-3c96-4e34-4204-67b2.ap.ngrok.io/forget-password", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache'
                },
                body: JSON.stringify({email: email}),
            }
            )
            .then(response => {
                return response.text()
            })
            .then(data_ => {
                let data = JSON.parse(data_);
                alert('Gửi yêu cầu quên mật khẩu thành công vui lòng kiểm tra mail để lấy mã xác nhận')
                if (data.success) {                        
                    setNumS(false);
                }
                
            })
            .catch(error => {
                alert('Yêu cầu thất bại')
                console.log("Have error: ", error )
            })
            
        } else {
            fetch("https://d882-2402-800-62d0-f334-3c96-4e34-4204-67b2.ap.ngrok.io/otp", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache'
                },
                body: JSON.stringify({otp: otp, email: email}),
            }
            )
            .then(response => {
                return response.text()
            })
            .then(data_ => {
                let data = JSON.parse(data_);
                alert('Xác nhận thành công')
                if (data.success) {
                    const user_ = {_id: data.user_id}
                    storeDataUser(user_);
                    setTimeout(() => navigation.navigate('ResetPassword', {form: false}), 1000)
                }
                
            })
            .catch(error => {
                alert('Yêu cầu thất bại')
                console.log("Have error: ", error )
            })
        }
    }

    const renderScreen_ = (numS) => {
        if (numS)
            return (
                <View style={{
                    height: 275,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <InputSection>
                        <McImage 
                            source={Images.profile}
                            style={{height: 24, width: 24,marginLeft: 16, marginRight:12}}
                        ></McImage>
                        <TextInput 
                            placeholder="Nhập email đã đăng ký"
                            placeholderTextColor={Colors.grey3}
                            value={email}
                            onChangeText={value => setEmail(value)}
                            style={{
                                color: Colors.grey4,
                                
                            }}
                        ></TextInput>
                    </InputSection>
        
                    <TouchableOpacity style={{marginTop: 28}} onPress={() => {navigation.navigate('Login')}}>
                        <McText bold size={12} style={{
                            color: Colors.accent1,
                        }}>
                            Quay lại đăng nhập ~
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
            ) 
            else return  (
                <View style={{
                    height: 275,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <InputSection>
                        <McImage 
                            source={Images.password}
                            style={{marginLeft: 16, marginRight:12}}
                        ></McImage>
                        <TextInput 
                            placeholder="Nhập mã xác nhận"
                            placeholderTextColor={Colors.grey3}
                            value={otp}
                            onChangeText={value => setOTP(value)}
                            style={{
                                color: Colors.grey4,
                                
                            }}
                        ></TextInput>
                    </InputSection>

                    <TouchableOpacity style={{marginTop: 28}} onPress={() => {navigation.navigate('Login')}}>
                        <McText bold size={12} style={{
                            color: Colors.accent1,
                        }}>
                            Quay lại đăng nhập ~ 
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
            )
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
        }}> Quên mật khẩu </McText>

        {renderScreen_(numS)}

        <View style={{marginTop: 639, position:"absolute"}}>
            <PlayButton 
                size={78} 
                circle={70} 
                icon={Images.right_arrow}
                onPress={ ()=>{handleSubmit()}}
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
    marginBottom: 28px;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
`;

export default ForgetPassword;