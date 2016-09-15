/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback
} from 'react-native';
import Emoji from 'react-native-emoji';
import classNames from 'classnames';

const emojis = [
  { name: 'poop', word: 'poop' },
  { name: 'eggplant', word: 'eggplant' },
  { name: 'joy', word: 'joy' },
  { name: 'ghost', word: 'ghost' },
  { name: 'tada', word: 'party' },
  { name: 'boom', word: 'explosion' },
  { name: 'bomb', word: 'bomb' },
  { name: 'dancer', word: 'dancer' },
  { name: 'monkey', word: 'monkey' },
]

class emoti extends Component {
  constructor(props) {
    super(props)

    this.state = {
      wordDisplayed: false,
      emoji: this.getRandomEmoji()
    }
  }

  handleEmojiPress() {
    if (!this.state.wordDisplayed) {
      this.setState({ wordDisplayed: true })
    } else {
      this.setState({ 
        wordDisplayed: false,
        emoji: this.getRandomEmoji()
      })
    }
  }

  getRandomEmoji() {
    const index = Math.floor(Math.random() * (emojis.length));
    return emojis[index]
  }

  render() {
    const { wordDisplayed, emoji } = this.state

    const wordStyles = [styles.word]
    if (wordDisplayed) {
      wordStyles.push(styles.visible)
    }

    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={() => this.handleEmojiPress()}>
          <View>
            <Text style={styles.emoji}>
              <Emoji name={emoji.name} />
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <Text style={wordStyles}>
          {emoji.word}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  emoji: {
    paddingBottom: 10,
    fontSize: 70,
    textAlign: 'center',
    marginBottom: 5
  },
  word: {
    opacity: 0,
    fontSize: 54,
    fontFamily: 'American Typewriter',
    color: '#475358',
  },
  visible: {
    opacity: 1,
  }
});

AppRegistry.registerComponent('emoti', () => emoti);
