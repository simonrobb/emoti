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
import Sound from 'react-native-sound'

const SFX_TEXT_ENTER_PATH = 'ping.wav'
const SFX_DISMISS_EMOJI_PATH = 'whoosh.wav'

class FlashCardScene extends Component {
  constructor(props) {
    super(props)

    this.state = {
      wordDisplayed: false,
      emoji: this.getRandomEmoji()
    }

    this.emojiPressAnimValue = new Animated.Value(0)
  }

  componentWillMount() {
    // Preload sounds
    this.sfx = {}
    this.sfx.textEnter = new Sound(SFX_TEXT_ENTER_PATH, Sound.MAIN_BUNDLE, error => { 
      if (error) {
        console.error(`Failed to load sound ${SFX_TEXT_ENTER_PATH}`, error)
      }
    })
    this.sfx.dismissEmoji = new Sound(SFX_DISMISS_EMOJI_PATH, Sound.MAIN_BUNDLE, error => { 
      if (error) {
        console.error(`Failed to load sound ${SFX_DISMISS_EMOJI_PATH}`, error)
      }
    })
  }

  componentWillDismount() {
    // Release sound resources
    for (const key in this.sfx) {
      this.sfx[key].release()
    }
  }

  textEnter() {
    // Play SFX
    this.sfx.textEnter.play()

    // Update the state
    this.setState({ wordDisplayed: true })
  }

  textExit() {
    // Play SFX
    this.sfx.dismissEmoji.play()

    // Update the state
    this.setState({ wordDisplayed: false })
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

  nextEmoji() {
    this.setState({ emoji: this.getRandomEmoji() })
  }

  getRandomEmoji() {
    const { pack } = this.props
    const index = Math.floor(Math.random() * (pack.emojis.length));
    return pack.emojis[index]
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
      this.nextEmoji()
    } else {
      this.emojiReleaseAnimation()
      this.textEnter()
    }
  }

  render() {
    const { onBackPress } = this.props
    const { wordDisplayed, emoji } = this.state

    const emojiPressAnimStyle = {
      transform: [{scale: this.emojiPressAnimValue.interpolate({
          inputRange: [0, 0.5, 1.2],
          outputRange: [1, 0.9, 1.2]
        })
      }]
    }
    const emojiStyles = [styles.emoji, emojiPressAnimStyle]

    const wordEnterStyle = {
      opacity: this.emojiPressAnimValue.interpolate({
        inputRange: [0.7, 1],
        outputRange: [0, 1]
      }),
      transform: [{scale: this.emojiPressAnimValue.interpolate({
          inputRange: [0.5, 1, 1.2],
          outputRange: [0, 1, 1.1]
        })
      }]
    }
    const wordStyles = [styles.word]
    if (this.state.wordDisplayed) {
      wordStyles.push(wordEnterStyle)
    }

    return (
      <View style={styles.container}>
        <View style={styles.bar}>
          <TouchableHighlight onPress={onBackPress}>
            <Image source={require('./assets/arrow.png')} style={styles.back} />
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
    height: 70,
    marginTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  back: {},
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
    opacity: 0,
    fontSize: 54,
    fontFamily: 'American Typewriter',
    color: '#475358',
  }
});

export default FlashCardScene