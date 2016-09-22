import React, { Component } from 'react'
import {
  Animated
} from 'react-native'
import Styles from './style'

export default function(props) {
  const { word, wordDisplayed, animationValue } = props

  const enterStyle = {
    opacity: animationValue.interpolate({
      inputRange: [0.7, 1],
      outputRange: [0, 1]
    }),
    transform: [{scale: animationValue.interpolate({
        inputRange: [0.5, 1, 1.2],
        outputRange: [0, 1, 1.1]
      })
    }]
  }
  const styles = [Styles.word]
  if (wordDisplayed) {
    styles.push(enterStyle)
  }

  return <Animated.Text style={styles}>
    {word}
  </Animated.Text>
}