import React from 'react';
import { Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import { Theartist, Player, Thealbums, Search, Downloader} from 'Screens';
import { Login, Register, ForgetPassword, ResetPassword } from '../../Screens/Onboarding';
import { Home, Option, NotificationLink } from '../../Screens/Home';
import { Library, MyPlaylist, Favorites, InPlaylist } from '../../Screens/Library';
const Stack = createStackNavigator();

const Stacks = ({ params }) => (
  <Stack.Navigator initialRouteName="Home">
    <Stack.Screen
      name="Home"
      component={Home}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="NotificationLink"
      component={NotificationLink}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="Option"
      component={Option}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="Search"
      component={Search}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="Downloader"
      component={Downloader}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="Thealbums"
      component={Thealbums}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="Theartist"
      component={Theartist}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="Login"
      component={Login}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="Register"
      component={Register}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="ForgetPassword"
      component={ForgetPassword}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="ResetPassword"
      component={ResetPassword}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="Library"
      component={Library}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="MyPlaylist"
      component={MyPlaylist}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="InPlaylist"
      component={InPlaylist}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="Favorites"
      component={Favorites}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="Player"
      component={Player}
      options={{
        headerShown: false,
      }}
    />
  </Stack.Navigator>
);

export default Stacks;
