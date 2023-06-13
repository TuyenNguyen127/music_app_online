import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Stacks from './Stacks';
import { MusicProvider } from '../../Context/MusicProvider';

export default function AppNavigator() {
    return (
        <MusicProvider>
            <NavigationContainer>
                <Stacks />
            </NavigationContainer>
        </MusicProvider>
    );
}
