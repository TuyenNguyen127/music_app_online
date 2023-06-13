import React, { useState } from "react";
import { TextInput, View, StatusBar, TouchableOpacity} from "react-native";
import styled from "styled-components";

import {Colors, Images, Metrics, Fonts} from 'Constants';
import { McText, McImage, PlayButton } from 'Components';


const Register = ({navigation}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const handleSubmit = async (e) => {

        e.preventDefault();
        if (password == confirmPassword) {
            fetch("https://3ce0-2402-800-62d0-bf1c-fca5-643-fd5b-d6a7.ap.ngrok.io/register", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email: email, password: password}),
            }
            )
            .then(response => {
                return response.text()
            })
            .then(data_ => {
                let data = JSON.parse(data_);
                if (data.success) {
                    alert('Đăng ký thành công')
                    setTimeout(() => navigation.navigate('Login'), 5000)
                } else {
                    alert('Đăng ký thất bại \n\n'+ data.message )
                }
                
            })
            .catch(error => {
                alert('Đăng ký không thành công')
                console.log("Have error: ", error )
            })
        } else {
            alert('Mật khẩu nhập lại không trùng khớp');
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
            }}> Đăng ký tài khoản </McText>

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
                            color: Colors.grey4
                        }}
                        value={password}
                        onChangeText={txt => setPassword(txt)}
                        secureTextEntry={true}
                    ></TextInput>
                </InputSection>

                <InputSection>
                    <McImage 
                        source={Images.password}
                        style={{marginLeft: 16, marginRight:12}}
                    ></McImage>
                    <TextInput 
                        placeholder="Nhập lại mật khẩu"
                        placeholderTextColor={Colors.grey3}
                        style={{
                            color: Colors.grey4
                        }}
                        value={confirmPassword}
                        onChangeText={txt => setConfirmPassword(txt)}
                        secureTextEntry={true}
                    ></TextInput>
                </InputSection>

                <View style={{
                    marginTop: 28,
                    flexDirection: 'row'
                }}>
                    <McText bold size={12} style={{
                        color: Colors.grey4
                    }}>Đã có tài khoản ?</McText>
                    <TouchableOpacity onPress={() => {navigation.navigate('Login')}}>
                        <McText bold size={12} style={{
                            color: Colors.accent1
                        }}> Đăng nhập </McText>
                    </TouchableOpacity>
                </View>
            </View>
        

            <View style={{marginTop: 639, position:"absolute"}}>
                <PlayButton 
                    size={78} 
                    circle={70} 
                    icon={Images.right_arrow}
                    onPress={ (event)=>{
                        handleSubmit(event) 
                    }}
                />
            </View>
        </Container>
    )
}

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

export default Register;