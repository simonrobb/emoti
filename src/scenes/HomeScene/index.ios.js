import React, { Component } from 'react'
import {
  AppRegistry,
  StyleSheet,
  View,
  Image,
  TouchableWithoutFeedback,
  Animated,
  Easing,
  Dimensions
} from 'react-native'
import Carousel from 'react-native-carousel-control'

const packs = [
  {
    name: 'Animals',
    image: require('./assets/animals.jpg')
  },
  {
    name: 'Travel',
    image: require('./assets/travel.jpg')
  }
]

class HomeScene extends Component {
  constructor(props) {
    super(props)

    this.state = {
      currentIndex: 0, 
      openingPack: null
    }
    this.openAnimValue = new Animated.Value(0)
  }

  openAnimation(callback) {
    this.openAnimValue.setValue(0)
    Animated.timing(
      this.openAnimValue,
      {
        duration: 350,
        easing: Easing.out(Easing.ease),
        toValue: 1
      }
    ).start(callback)
  }

  openPack() {
    const { onPlayPress } = this.props
    onPlayPress()
  }

  handlePageChange(index) {
    this.setState({ currentIndex: index })
  }

  handlePress(pack) {
    this.setState({ openingPack: pack.name })
    this.openAnimation(this.openPack.bind(this))
  }

  render() {
    const { width, height } = Dimensions.get('window')

    const imageStyles = [styles.image, {
      width,
      height
    }]

    const openAnimStyle = {
      zIndex: 2,
      transform: [{scale: this.openAnimValue.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 3]
        })
      }],
      opacity: this.openAnimValue.interpolate({
        inputRange: [0.5, 1],
        outputRange: [1, 0]
      })
    }

    const othersAnimStyle = {
      opacity: this.openAnimValue.interpolate({
        inputRange: [0, 0.4],
        outputRange: [1, 0]
      })
    }

    return (
      <Carousel pageWidth={width} sneak={0} initialPage={this.state.currentIndex} onPageChange={index => this.handlePageChange(index)} style={styles.carousel}>
        {packs.map(pack => {
          const packStyles = [styles.pack]
          packStyles.push((this.state.openingPack === pack.name)
            ? openAnimStyle
            : othersAnimStyle
          )

          return <Animated.View style={packStyles} key={pack.name}>
            <TouchableWithoutFeedback onPress={() => this.handlePress(pack)}>
              <Image style={imageStyles} source={pack.image} />
            </TouchableWithoutFeedback>
          </Animated.View>
        })}
      </Carousel>
    )
  }
}

const styles = StyleSheet.create({
  pack: {
    zIndex: 1
  },
  image: {
    flex: 1,
    width: null,
    height: null,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: Image.resizeMode.cover
  }
});

export default HomeScene
