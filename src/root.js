import React, { useState, useEffect, AppRegistry } from 'react';
import { ActivityIndicator } from 'react-native';
import {AppearanceProvider} from 'react-native-appearance';
import * as Font from 'expo-font';

import {AppNavigator} from 'Navigation'; 
import { Fonts } from 'Constants';
import TrackPlayer from 'react-native-track-player';

const App = ({ params }) => {
    const [assetsLoaded, setAssetsLoaded] = useState(false);
    const [musicLoaded, setMusicLoaded] = useState(false);

    /* Loading custom fonts in async */
    const _loadAssetsAsync = async () => {
        await Font.loadAsync(Fonts.customFonts);
        setAssetsLoaded(true);
    };

    const _loadMusicAsync = async () => {
        if (!musicLoaded) { 
            await TrackPlayer.setupPlayer();
            setMusicLoaded(true);
        }
    };
  
    useEffect(() => {
        _loadAssetsAsync();
        _loadMusicAsync();
    });

    return assetsLoaded && musicLoaded ? (
        <AppearanceProvider>
            <AppNavigator />
        </AppearanceProvider>
    ) : (
        <ActivityIndicator size="small"></ActivityIndicator>
    );
};

export default App;
