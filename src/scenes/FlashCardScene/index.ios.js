import React, { Component } from 'react'
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Animated,
  Easing
} from 'react-native';
import AnimalEmojis from '../../components/Emojis/Animals'

class FlashCardScene extends Component {
  constructor(props) {
    super(props)

    this.state = {
      wordDisplayed: false,
      emoji: this.getRandomEmoji()
    }

    this.fadeValue = new Animated.Value(0)
    this.emojiPressAnimValue = new Animated.Value(0)
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

  emojiPressAnimation() {
    this.emojiPressAnimValue.setValue(0)
    Animated.timing(
      this.emojiPressAnimValue,
      {
        duration: 100,
        easing: Easing.out(Easing.ease),
        toValue: 0.5
      }
    ).start()
  }

  emojiReleaseAnimation() {
    Animated.timing(
      this.emojiPressAnimValue,
      {
        duration: 200,
        easing: Easing.in(Easing.elastic(2)),
        toValue: 1
      }
    ).start()
  }

  getRandomEmoji() {
    const index = Math.floor(Math.random() * (AnimalEmojis.length));
    return AnimalEmojis[index]
  }

  handleStartShouldSetResponder(event) {
    return true
  }

  handleResponderGrant(event) {
    if (this.state.wordDisplayed) {
      
    } else {
      this.emojiPressAnimation()
    }
  }

  handleResponderMove(event) {
    if (this.state.wordDisplayed) {
      console.log(event)
    }
  }

  handleResponderRelease(event) {
    if (this.state.wordDisplayed) {
      this.textExit()
      this.setState({ 
        wordDisplayed: false,
        emoji: this.getRandomEmoji()
      })
    } else {
      this.emojiReleaseAnimation()
      this.textEnter()
      this.setState({ wordDisplayed: true })
    }
  }

  render() {
    const { onBackPress } = this.props
    const { wordDisplayed, emoji } = this.state

    const emojiPressAnimStyle = {
      transform: [{scale: this.emojiPressAnimValue.interpolate({
          inputRange: [0, 0.5, 1.2],
          outputRange: [1, 0.8, 1.2]
        })
      }]
    }
    const emojiStyles = [styles.emoji, emojiPressAnimStyle]

    const fadeStyle = {
      opacity: this.fadeValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1]
      })
    }
    const wordStyles = [styles.word, fadeStyle]

    return (
      <View style={styles.container}>
        <View style={styles.bar}>
          <TouchableHighlight onPress={onBackPress}>
            <Text style={styles.back}>Back</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.main}>
          <Animated.View style={emojiStyles} onStartShouldSetResponder={event => this.handleStartShouldSetResponder(event)} onResponderGrant={event => this.handleResponderGrant(event)} onResponderMove={event => this.handleResponderMove(event)} onResponderRelease={event => this.handleResponderRelease(event)}>
            <Image source={emoji.image} style={styles.image} />
          </Animated.View>
          <Animated.Text style={wordStyles}>
            {emoji.word}
          </Animated.Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  bar: {
    flex: 0,
    flexDirection: 'row',
    height: 40,
    marginTop: 20,
    paddingLeft: 5,
    paddingRight: 5,
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  back: {
    fontSize: 16,
    color: '#ccced8'
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    paddingBottom: 10,
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

export default FlashCardScene