import React, {useContext, useEffect, useState} from "react";
import { TextInput, View, StatusBar, TouchableOpacity} from "react-native";
import styled from "styled-components";

import {Colors, Images, Metrics, Fonts} from 'Constants';
import { McText, McImage, PlayButton } from 'Components';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MusicContext } from "../../Context/MusicProvider";


const ResetPassword = ({navigation, route}) => {
    const [numS, setNumS] = useState(true);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [user, setUser] = useState({});
    const context = useContext(MusicContext);
    const {host} = context;

    const getDataUser = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@user')
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch(e) {
            console.log(e);
        }
    }

    const handleSubmit = () => {
        if (numS) {
            if (newPassword == confirmPassword) {
                fetch("https://d882-2402-800-62d0-f334-3c96-4e34-4204-67b2.ap.ngrok.io/change-password", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-cache'
                    },
                    body: JSON.stringify({user_id: user._id, password: oldPassword, newPassword: newPassword}),
                }
                )
                .then(response => {
                    return response.text()
                })
                .then(data_ => {
                    let data = JSON.parse(data_);
                    alert(data.message )
                    if (data.success) {                        
                        setTimeout(() => navigation.navigate('Option'), 1000)
                    }
                    
                })
                .catch(error => {
                    alert('Đổi mật khẩu thất bại')
                    console.log("Have error: ", error )
                })
            } else {
                alert('Mật khẩu nhập lại không trùng khớp');
            }
        } else {
            if (newPassword == confirmPassword) {
                fetch("https://d882-2402-800-62d0-f334-3c96-4e34-4204-67b2.ap.ngrok.io/reset-password", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-cache'
                    },
                    body: JSON.stringify({user_id: user._id, password: newPassword}),
                }
                )
                .then(response => {
                    return response.text()
                })
                .then(data_ => {
                    let data = JSON.parse(data_);
                    alert(data.message)
                    if (data.success) {
                        setTimeout(() => navigation.navigate('Login'), 1000)
                    }
                    
                })
                .catch(error => {
                    alert('Đổi mật khẩu thất bại')
                    console.log("Have error: ", error )
                })
            } else {
                alert('Mật khẩu nhập lại không trùng khớp');
            }
        }
    }

    useEffect(() => {
        setNumS(route.params.form)
        getDataUser().then(value => {
            setUser(value)
        })
    }, [])

    const renderScreen_ = (numS) => {
        if (!numS)
            return (
                <View style={{
                    height: 270,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <InputSection>
                        <McImage 
                            source={Images.password}
                            style={{marginLeft: 16, marginRight:12}}
                        ></McImage>
                        <TextInput 
                            placeholder="Nhập mật khẩu mới"
                            placeholderTextColor={Colors.grey3}
                            style={{
                                color: Colors.grey4,                            
                            }}
                            value={newPassword}
                            onChangeText={value => setNewPassword(value)}
                        ></TextInput>
                    </InputSection>
                    <InputSection>
                        <McImage 
                            source={Images.password}
                            style={{marginLeft: 16, marginRight:12}}
                        ></McImage>
                        <TextInput 
                            placeholder="Nhập lại mật khẩu mới"
                            placeholderTextColor={Colors.grey3}
                            style={{
                                color: Colors.grey4,                           
                            }}
                            value={confirmPassword}
                            onChangeText={value => setConfirmPassword(value)}
                        ></TextInput>
                    </InputSection>
                </View>
        ) 
        else return (
            <View style={{
                height: 270,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <InputSection>
                    <McImage 
                        source={Images.password}
                        style={{marginLeft: 16, marginRight:12}}
                    ></McImage>
                    <TextInput 
                        placeholder="Nhập mật khẩu cũ"
                        placeholderTextColor={Colors.grey3}
                        style={{
                            color: Colors.grey4,
                        }}
                        value={oldPassword}
                        onChangeText={value => setOldPassword(value)}
                    ></TextInput>
                </InputSection>
                <InputSection>
                    <McImage 
                        source={Images.password}
                        style={{marginLeft: 16, marginRight:12}}
                    ></McImage>
                    <TextInput 
                        placeholder="Nhập mật khẩu mới"
                        placeholderTextColor={Colors.grey3}
                        style={{
                            color: Colors.grey4,                       
                        }}
                        value={newPassword}
                        onChangeText={value => setNewPassword(value)}
                    ></TextInput>
                </InputSection>
                <InputSection>
                    <McImage 
                        source={Images.password}
                        style={{marginLeft: 16, marginRight:12}}
                    ></McImage>
                    <TextInput 
                        placeholder="Nhập lại mật khẩu mới"
                        placeholderTextColor={Colors.grey3}
                        style={{
                            color: Colors.grey4,
                        }}
                        value={confirmPassword}
                        onChangeText={value => setConfirmPassword(value)}
                    ></TextInput>
                </InputSection>
            </View>
        )
    }

    return (
    <Container>
        <StatusBar barStyle='light-content'/>
        <TouchableOpacity onPress={()=>{
            navigation.goBack();
        }} style={{
            marginLeft: 24,
            marginTop: 5
        }}>
            <McImage source={Images.left}/>
        </TouchableOpacity>

        <McImage source={Images.logo} style={{marginHorizontal: 100,marginTop: 20}}/>

        <McText color={Colors.primary} align='center' size={24} black>The sound of life</McText>

        <McText color={Colors.grey4} size={14} medium align='center' style={{
            marginHorizontal: 51,
            marginTop: 8
        }}> Music is not an entertainment, but also it is our life </McText>

        <McText color={Colors.grey4} size={24} bold align='center' style={{
            marginTop: 28
        }}> Đổi mật khẩu </McText>

        {renderScreen_(numS)}

        <View style={{marginTop: 639, position:"absolute", alignSelf: 'center'}}>
            <PlayButton 
                size={78} 
                circle={70} 
                icon={Images.right_arrow}
                onPress={ ()=>{
                    handleSubmit()
                }}
            />
        </View>
    </Container>
)}

const Container = styled.SafeAreaView`
    flex: 1;
    background_color: ${Colors.background};
    justify-content: flex-start;  
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

export default ResetPassword;