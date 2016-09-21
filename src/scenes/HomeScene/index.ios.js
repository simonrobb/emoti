import React, { Component } from 'react'
import {
  AppRegistry,
  StyleSheet,
  View,
  Image,
  Text,
  TouchableWithoutFeedback,
  Animated,
  Easing,
  Dimensions
} from 'react-native'
import Carousel from 'react-native-carousel-control'
import AnimalEmojis from '../../components/Emojis/Animals'
import FacesEmojis from '../../components/Emojis/Faces'

const packs = [
  {
    name: 'Animals',
    image: require('./assets/animals.jpg'),
    emojis: AnimalEmojis
  },
  {
    name: 'Travel',
    image: require('./assets/travel.jpg'),
    emojis: FacesEmojis
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
    this.playButtonPressAnimValue = new Animated.Value(0)
  }

  playButtonPressAnimation() {
    this.playButtonPressAnimValue.setValue(0)
    Animated.timing(
      this.playButtonPressAnimValue,
      {
        duration: 100,
        easing: Easing.out(Easing.ease),
        toValue: 0.5
      }
    ).start()
  }

  playButtonReleaseAnimation() {
    Animated.timing(
      this.playButtonPressAnimValue,
      {
        duration: 350,
        easing: Easing.out(Easing.ease),
        toValue: 1
      }
    ).start()
  }

  openAnimation(pack, callback) {
    this.openAnimValue.setValue(0)
    Animated.timing(
      this.openAnimValue,
      {
        duration: 350,
        easing: Easing.out(Easing.ease),
        toValue: 1
      }
    ).start(() => callback(pack))
  }

  openPack(pack) {
    const { onPlayPress } = this.props
    onPlayPress(pack)
  }

  handlePageChange(index) {
    this.setState({ currentIndex: index })
  }

  handleStartShouldSetResponder(event) {
    return true
  }

  handleResponderGrant(event) {
    this.playButtonPressAnimation()
  }

  handleResponderRelease(event, pack) {
    this.playButtonReleaseAnimation()
    this.openAnimation(pack, this.openPack.bind(this))
    this.setState({ openingPack: pack.name })
  }

  render() {
    const { width, height } = Dimensions.get('window')

    // Play button animation styles
    const playButtonPressAnimStyle = {
      transform: [{scale: this.playButtonPressAnimValue.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [1, 0.9, 4]
        })
      }],
      opacity: this.playButtonPressAnimValue.interpolate({
        inputRange: [0.5, 1],
        outputRange: [1, 0]
      })
    }
    const playButtonStyles = [playButtonPressAnimStyle]

    // Image animation styles
    const openAnimStyle = {
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

    // Logo animation styles
    const logoAnimStyle = {
      transform: [{translateY: this.openAnimValue.interpolate({
          inputRange: [0, 0.35],
          outputRange: [0, -120],
          extrapolate: 'clamp'
        })
      }],
      opacity: this.openAnimValue.interpolate({
        inputRange: [0, 0.35],
        outputRange: [1, 0],
        extrapolate: 'clamp'
      })
    }
    const logoStyles = [styles.logo, logoAnimStyle]

    // Carousel bar animation styles
    const carouselBarAnimStyle = {
      transform: [{translateY: this.openAnimValue.interpolate({
          inputRange: [0, 0.35],
          outputRange: [0, 120],
          extrapolate: 'clamp'
        })
      }],
      opacity: this.openAnimValue.interpolate({
        inputRange: [0, 0.35],
        outputRange: [1, 0],
        extrapolate: 'clamp'
      })
    }
    const carouselBarStyles = [styles.carouselBar, carouselBarAnimStyle]

    return (
      <Carousel pageWidth={width} sneak={0} initialPage={this.state.currentIndex} onPageChange={index => this.handlePageChange(index)} style={styles.carousel}>
        {packs.map(pack => {
          const imageStyles = [styles.image, {
            width,
            height
          }]
          if (this.state.openingPack === pack.name) {
            imageStyles.push(openAnimStyle)
          }

          return <View style={styles.pack} key={pack.name}>
            <View style={styles.wrapper}>
              <Animated.Image style={imageStyles} source={pack.image} />
              <View style={styles.content}>
                <Animated.Image source={require('./assets/logo.png')} style={logoStyles}  />
                <View style={styles.play}>
                  <Animated.Image source={require('./assets/play.png')} style={playButtonStyles} onStartShouldSetResponder={event => this.handleStartShouldSetResponder(event)} onResponderGrant={event => this.handleResponderGrant(event)} onResponderMove={event => this.handleResponderMove(event)} onResponderRelease={event => this.handleResponderRelease(event, pack)} />
                </View>
                <Animated.View style={carouselBarStyles}>
                  <Text style={styles.packName}>{pack.name}</Text>
                </Animated.View>
              </View>
            </View>
          </View>
        })}
      </Carousel>
    )
  }
}

const styles = StyleSheet.create({
  pack: {
    flex: 1,
    zIndex: 1
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: Image.resizeMode.cover
  },
  wrapper: {
    flex: 1
  },
  content: {
    flex: 1,
    width: null,
    height: null,
    alignItems: 'center'
  },
  logo: {
    marginTop: 53
  },
  play: {
    flex: 1,
    justifyContent: 'center'
  },
  carouselBar: {
    width: null,
    height: 44,
    marginBottom: 37,
    backgroundColor: 'rgba(0,0,0,0)'
  },
  packName: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
    fontFamily: 'American Typewriter',
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: 0,
    shadowOffset: { width: 1, height: 2}
  }
});

export default HomeScene
