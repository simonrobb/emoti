/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View
} from 'react-native';
import HomeScene from './src/scenes/HomeScene'
import FlashCardScene from './src/scenes/FlashCardScene'

class emoti extends Component {
  constructor(props) {
    super(props)

    this.state = {
      scene: 'home'
    }
  }

  handlePlayPress() {
    this.setState({ scene: 'flashCards' })
  }

  handleFlashCardBackPress() {
    this.setState({ scene: 'home' })
  }

  render() {
    let scene
    switch(this.state.scene) {
      case 'home':
        scene = <HomeScene onPlayPress={() => this.handlePlayPress()} />
        break
      
      case 'flashCards':
        scene = <FlashCardScene onBackPress={() => this.handleFlashCardBackPress()} />
        break
    }

    return scene
  }
}

AppRegistry.registerComponent('emoti', () => emoti);
