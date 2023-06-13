import React, { createContext, useRef, useState } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
export const MusicContext = createContext();
import TrackPlayer, {State} from 'react-native-track-player';


export const MusicProvider = ({ children }) => {
    const [currentSong, setCurrentSong] = useState(null);
    const [lastPosition, setLastPosition] = useState(0);
    //const [sound, setSound] = useState(new Audio.Sound());
    const [isPlaying, setIsPlaying] = useState(false);

    async function getStatusPlay() {
            const state = await TrackPlayer.getState();
            if (state === State.Playing) {
                return true;
            } else {
                return false;
            }
    }
    
    const getDataMusic = async () => {
        try {
            if (currentSong === null) {
                const jsonValue = await AsyncStorage.getItem('@selectedMusic')
                return jsonValue != null ? JSON.parse(jsonValue) : null;
            } 
            let trackIndex = await TrackPlayer.getCurrentTrack();
            let trackObject = await TrackPlayer.getTrack(trackIndex);
            return trackObject;
        } catch(e) {
            console.log(e);
        }
    }
    
    // pause audio
    const pause = async () => {
        try {
            await TrackPlayer.pause();
        } catch (error) {
            console.log('error inside pause helper method', error.message);
        }
    };
    
    // resume audio
    const resume = async () => {
        try {
            await TrackPlayer.play();
            setIsPlaying(true);
        } catch (error) {
            console.log('error inside resume helper method', error.message);
        }
    };

    const getCurrentSong = () => {
        getDataMusic().then(song => {
            setCurrentSong(song);
        });
        return currentSong;
    }

    const getIsPlaying = () => {
        getStatusPlay().then(status => {
            setIsPlaying(status);
        });
        return isPlaying;
    }

    return (
        <MusicContext.Provider 
            value={{ 
                currentSong: getCurrentSong(), 
                lastPosition: lastPosition,
                setLastPosition,
                pause: pause,
                resume: resume,
                isPlaying: getIsPlaying(),
                host: "https://d882-2402-800-62d0-f334-3c96-4e34-4204-67b2.ap.ngrok.io"
            }}>
            {children}
        </MusicContext.Provider>
    );
};