import React, { Component } from 'react'
import {
  Animated,
  Easing,
  Image
} from 'react-native'
import Styles from './style'

class Emoji extends Component {
  constructor(props) {
    super(props)
  }

  pressAnimation() {
    const { animationValue } = this.props
    animationValue.setValue(0)
    Animated.timing(
      animationValue,
      {
        duration: 100,
        easing: Easing.out(Easing.ease),
        toValue: 0.5
      }
    ).start()
  }

  releaseAnimation() {
    const { animationValue } = this.props
    Animated.timing(
      animationValue,
      {
        duration: 200,
        easing: Easing.in(Easing.elastic(2)),
        toValue: 1
      }
    ).start()
  }

  handleResponderGrant() {
    const { wordDisplayed } = this.props
    if (!wordDisplayed) {
      this.pressAnimation()
    }
  }
  
  handleResponderRelease() {
    const { onPress } = this.props
    onPress()

    this.releaseAnimation()
  }

  render() {
    const { emoji, animationValue } = this.props
    
    const pressAnimStyle = {
      transform: [{scale: animationValue.interpolate({
          inputRange: [0, 0.5, 1.2],
          outputRange: [1, 0.9, 1.2]
        })
      }]
    }
    const emojiStyles = [Styles.emoji, pressAnimStyle]

    return <Animated.View style={emojiStyles} onStartShouldSetResponder={() => true} onResponderGrant={event => this.handleResponderGrant(event)} onResponderMove={event => this.handleResponderMove(event)} onResponderRelease={event => this.handleResponderRelease(event)}>
      <Image source={emoji.image} style={Styles.image} />
    </Animated.View> 
  }
}

export default Emoji