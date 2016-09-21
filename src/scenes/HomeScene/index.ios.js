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
    logoColor: '#476079',
    emojis: AnimalEmojis
  },
  {
    name: 'Travel',
    image: require('./assets/travel.jpg'),
    logoColor: 'white',
    emojis: FacesEmojis
  }
]

class HomeScene extends Component {
  constructor(props) {
    super(props)

    this.state = {
      currentPack: packs[0], 
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

  gotoPackByIndex(index) {
    const pack = packs[index]

    if (!pack) {
      throw `Invalid pack index {${index}} passed to gotoPackByIndex`
    }

    // Start the carousel animation
    this._carousel.goToPage(index)

    // Update the current pack approximately halfway through the animation
    setTimeout(() => {
      this.setState({ currentPack: pack })
    }, 500)
  }

  getCurrentPackIndex() {
    return packs.indexOf(this.state.currentPack)
  }

  openPack(pack) {
    const { onPlayPress } = this.props
    onPlayPress(pack)
  }

  handlePageChange(index) {
    this.setState({ currentIndex: index })
  }

  handlePrevPackPress() { 
    this.gotoPackByIndex(this.getCurrentPackIndex()-1)
  }

  handleNextPackPress() {
    this.gotoPackByIndex(this.getCurrentPackIndex()+1)
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
          outputRange: [1, 0.8, 4]
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
    const logoStyles = [styles.logo, logoAnimStyle, {
      tintColor: this.state.currentPack.logoColor
    }]

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

    // Arrow styles
    const currIndex = this.getCurrentPackIndex()
    const arrowLeftStyles = [styles.arrow, styles.arrowLeft, { opacity: (currIndex <= 0 ? 0 : 1) }]
    const arrowRightStyles = [styles.arrow, styles.arrowRight, { opacity: (currIndex >= (packs.size-1) ? 0 : 1) }]

    // Carousel element
    const carouselDimensionsStyle = {
      width,
      height
    }
    const carouselStyles = [styles.carousel, carouselDimensionsStyle]
    const carouselEl = <View style={carouselStyles}>
      <Carousel pageWidth={width} sneak={0} initialPage={this.state.currentIndex} onPageChange={index => this.handlePageChange(index)} ref={ref => this._carousel = ref}>
        {packs.map(pack => {
          const imageStyles = [styles.image, carouselDimensionsStyle]
          if (this.state.openingPack === pack.name) {
            imageStyles.push(openAnimStyle)
          }

          return <Animated.Image style={imageStyles} source={pack.image} key={pack.name} />
        })}
      </Carousel>
    </View>

    // Overlay element
    const overlayEl = <View style={styles.pack} key={this.state.currentPack.name}>
      <View style={styles.wrapper}>
        <View style={styles.content}>
          <Animated.Image source={require('./assets/logo.png')} style={logoStyles}  />
          <View style={styles.play}>
            <Animated.Image source={require('./assets/play.png')} style={playButtonStyles} onStartShouldSetResponder={event => this.handleStartShouldSetResponder(event)} onResponderGrant={event => this.handleResponderGrant(event)} onResponderMove={event => this.handleResponderMove(event)} onResponderRelease={event => this.handleResponderRelease(event, this.state.currentPack)} />
          </View>
          <Animated.View style={carouselBarStyles}>
            <View>
              <TouchableWithoutFeedback onPress={() => this.handlePrevPackPress()}>
                <Image source={require('./assets/arrow.png')} style={arrowLeftStyles} />
              </TouchableWithoutFeedback>
            </View>
            <Text style={styles.packName}>{this.state.currentPack.name}</Text>
            <View>
              <TouchableWithoutFeedback onPress={() => this.handleNextPackPress()}>
                <Image source={require('./assets/arrow.png')} style={arrowRightStyles} />
              </TouchableWithoutFeedback>
            </View>
          </Animated.View>
        </View>
      </View>
    </View>

    // Put it together
    return <View style={styles.container}>
      {carouselEl}
      {overlayEl}
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  pack: {
    flex: 1
  },
  carousel: {
    position: 'absolute',
    top: 0,
    left: 0
  },
  image: {
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
    flexDirection: 'row',
    width: null,
    height: 44,
    marginBottom: 37,
    backgroundColor: 'rgba(0,0,0,0)'
  },
  packName: {
    flex: 1,
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
    fontFamily: 'American Typewriter',
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: 0,
    shadowOffset: { width: 1, height: 2},
    textAlign: 'center'
  },
  arrow: {
    marginLeft: 20,
    marginRight: 20,
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: 0,
    shadowOffset: { width: 1, height: 2},
    opacity: 0.8
  },
  arrowLeft: {
    transform: [{rotate: '180deg'}],
    shadowOffset: { width: -1, height: -2},
  }
});

export default HomeScene
