import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  Image,
  TouchableWithoutFeedback
} from 'react-native';

class HomeScene extends Component {
  render() {
    const { onPlayPress } = this.props
    return (
      <TouchableWithoutFeedback onPress={onPlayPress}>
        <Image style={styles.container} source={require('./assets/background.jpg')} />
      </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: null,
    height: null,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: Image.resizeMode.contain
  }
});

export default HomeScene
