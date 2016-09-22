import React, { Component } from 'react'
import {
  AppRegistry,
  Text,
  View,
  Image,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Animated,
  Easing,
  StatusBar
} from 'react-native';
import Sound from 'react-native-sound'
import Styles from './style'
import Emoji from './components/Emoji'
import Word from './components/Word'
import BackButton from './components/BackButton'

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
      this.sfx.dismissEmoji.setVolume(0.1)
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

  nextEmoji() {
    this.setState({ emoji: this.getRandomEmoji() })
  }

  getRandomEmoji() {
    const { pack } = this.props
    const index = Math.floor(Math.random() * (pack.emojis.length))
    const emoji = { ...pack.emojis[index] }

    if (Array.isArray(emoji.image)) {
      const index = Math.floor(Math.random() * (emoji.image.length))
      emoji.image = emoji.image[index]
    } 

    return emoji
  }

  handleEmojiPress(event) {
    if (this.state.wordDisplayed) {
      this.textExit()
      this.nextEmoji()
    } else {
      this.textEnter()
    }
  }

  render() {
    const { onBackPress } = this.props
    const { wordDisplayed, emoji } = this.state

    return (
      <View style={Styles.container}>
        <StatusBar hidden={true} />
        <View style={Styles.bar}>
          <BackButton onPress={onBackPress} />
        </View>
        <View style={Styles.main}>
          <Emoji emoji={emoji} wordDisplayed={wordDisplayed} onPress={() => this.handleEmojiPress()} animationValue={this.emojiPressAnimValue} />
          <Word word={emoji.word} wordDisplayed={wordDisplayed} animationValue={this.emojiPressAnimValue} />
        </View>
      </View>
    );
  }
}

export default FlashCardScene