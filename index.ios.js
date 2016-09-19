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
  Image,
  TouchableWithoutFeedback,
  Animated,
  Easing
} from 'react-native';
import classNames from 'classnames';

const emojis = [
  { image: require('./emoji-one/1f40a.png'), word: 'crocodile' },
  { image: require('./emoji-one/1f40b.png'), word: 'whale' },
  { image: require('./emoji-one/1f40c.png'), word: 'snail' },
  { image: require('./emoji-one/1f40d.png'), word: 'snake' },
  { image: require('./emoji-one/1f40e.png'), word: 'horse' },
  { image: require('./emoji-one/1f40f.png'), word: 'sheep' },
  { image: require('./emoji-one/1f41a.png'), word: 'shell' },
  { image: require('./emoji-one/1f41b.png'), word: 'caterpillar' },
  { image: require('./emoji-one/1f41c.png'), word: 'ant' },
  { image: require('./emoji-one/1f41d.png'), word: 'bee' },
  { image: require('./emoji-one/1f41e.png'), word: 'ladybird' },
  { image: require('./emoji-one/1f41f.png'), word: 'fish' },
  { image: require('./emoji-one/1f42a.png'), word: 'llama' },
  { image: require('./emoji-one/1f42b.png'), word: 'camel' },
  { image: require('./emoji-one/1f42c.png'), word: 'dolphin' },
  { image: require('./emoji-one/1f42d.png'), word: 'mouse' },
  { image: require('./emoji-one/1f42e.png'), word: 'cow' },
  { image: require('./emoji-one/1f42f.png'), word: 'tiger' },
  { image: require('./emoji-one/1f43a.png'), word: 'wolf' },
  { image: require('./emoji-one/1f43b.png'), word: 'bear' },
  { image: require('./emoji-one/1f43c.png'), word: 'panda' },
  { image: require('./emoji-one/1f43f.png'), word: 'squirrel' },
]

class emoti extends Component {
  constructor(props) {
    super(props)

    this.state = {
      wordDisplayed: false,
      emoji: this.getRandomEmoji()
    }

    this.fadeValue = new Animated.Value(0)
  }
  
  textEnter() {
    this.fadeValue.setValue(0)
    Animated.timing(
      this.fadeValue, 
      {
        duration: 300,
        easing: Easing.in(Easing.ease),
        toValue: 1
      }
    ).start()
  }

  textExit() {
    this.fadeValue.setValue(0)
  }

  handleEmojiPress() {
    if (!this.state.wordDisplayed) {
      this.textEnter()
      this.setState({ wordDisplayed: true })
    } else {
      this.textExit()
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

    const fade = this.fadeValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1]
    })

    const fadeStyle = {
      opacity: fade
    }

    const wordStyles = [styles.word, fadeStyle]
    if (true || wordDisplayed) {
      wordStyles.push(styles.visible)
    }

    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={() => this.handleEmojiPress()}>
          <View>
            <Text style={styles.emoji}>
              <Image source={emoji.image} style={styles.image} />
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <Animated.Text style={wordStyles}>
          {emoji.word}
        </Animated.Text>
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
  image: {
    width: 240,
    height: 240
  },
  word: {
    fontSize: 54,
    fontFamily: 'American Typewriter',
    color: '#475358',
  }
});

AppRegistry.registerComponent('emoti', () => emoti);
