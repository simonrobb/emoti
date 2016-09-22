import React, { Component } from 'react'
import {
  Animated,
  Easing
} from 'react-native'

class BackButton extends Component {
  constructor(props) {
    super(props)

    this.pressAnimValue = new Animated.Value(0)
  }

  pressAnimation() {
    this.pressAnimValue.setValue(0)
    Animated.timing(
      this.pressAnimValue,
      {
        duration: 100,
        easing: Easing.out(Easing.ease),
        toValue: 0.5
      }
    ).start()
  }

  releaseAnimation() {
    Animated.timing(
      this.pressAnimValue,
      {
        duration: 200,
        easing: Easing.in(Easing.elastic(2)),
        toValue: 1
      }
    ).start()
  }

  handleResponderGrant() {
    this.pressAnimation()
  }
  
  handleResponderRelease() {
    const { onPress } = this.props
    onPress()

    this.releaseAnimation()
  }

  render() {
    const pressAnimStyle = {
      transform: [{scale: this.pressAnimValue.interpolate({
          inputRange: [0, 0.5, 1.2],
          outputRange: [1, 0.8, 1.2]
        })
      }]
    }

    return <Animated.Image source={require('../../assets/arrow.png')} style={pressAnimStyle} onStartShouldSetResponder={() => true} onResponderGrant={() => this.handleResponderGrant()} onResponderRelease={() => this.handleResponderRelease()} />
  }
}

export default BackButton