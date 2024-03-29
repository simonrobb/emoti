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
  Dimensions,
  StatusBar
} from 'react-native'
import Sound from 'react-native-sound'
import Carousel from 'react-native-carousel-control'
import Packs from '../../components/Packs'

const SFX_CHANGE_PAGE_PATH = 'click.wav'
const SFX_OPEN_PACK_PATH = 'open.wav'

class HomeScene extends Component {
  constructor(props) {
    super(props)

    this.state = {
      currentPack: Packs[0], 
      openingPack: null
    }
    this.openAnimValue = new Animated.Value(0)
    this.playButtonPressAnimValue = new Animated.Value(0)
  }

  componentWillMount() {
    // Preload sounds
    this.sfx = {}
    this.sfx.changePage = new Sound(SFX_CHANGE_PAGE_PATH, Sound.MAIN_BUNDLE, error => { 
      if (error) {
        return console.error(`Failed to load sound ${SFX_CHANGE_PAGE_PATH}`, error)
      }
      this.sfx.changePage.setVolume(0.1)
    })
    this.sfx.openPack = new Sound(SFX_OPEN_PACK_PATH, Sound.MAIN_BUNDLE, error => { 
      if (error) {
        return console.error(`Failed to load sound ${SFX_OPEN_PACK_PATH}`, error)
      }
    })
  }

  componentWillDismount() {
    // Release sound resources
    for (const key in this.sfx) {
      this.sfx[key].release()
    }
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
    const pack = Packs[index]

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
    return Packs.indexOf(this.state.currentPack)
  }

  openPack(pack) {
    const { onPlayPress } = this.props
    onPlayPress(pack)
  }

  handlePageChange(index) {
    if (index !== this.getCurrentPackIndex()) {
      // Play SFX
      this.sfx.changePage.play()

      // Update the state
      this.setState({ currentPack: Packs[index] })
    }
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
    // Play SFX
    this.sfx.openPack.play()

    // Start animations
    this.playButtonReleaseAnimation()
    this.openAnimation(pack, this.openPack.bind(this))

    // Update the state
    this.setState({ openingPack: pack.name })
  }

  render() {
    const { width, height } = Dimensions.get('window')

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
      left: width / 2,
      tintColor: this.state.currentPack.logoColor
    }]

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
    const playButtonStyles = [playButtonPressAnimStyle, {
      top: height / 2,
      left: width / 2
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
    const arrowRightStyles = [styles.arrow, styles.arrowRight, { opacity: (currIndex >= (Packs.length-1) ? 0 : 1) }]

    // Carousel element
    const carouselDimensionsStyle = {
      width,
      height
    }
    const carouselStyles = [styles.carousel, carouselDimensionsStyle]
    const carouselEl = <View style={carouselStyles}>
      <Carousel pageWidth={width} sneak={0} initialPage={this.state.currentIndex} onPageChange={index => this.handlePageChange(index)} ref={ref => this._carousel = ref}>
        {Packs.map(pack => {
          const imageStyles = [styles.image, carouselDimensionsStyle]
          if (this.state.openingPack === pack.name) {
            imageStyles.push(openAnimStyle)
          }

          return <Animated.Image style={imageStyles} source={pack.image} key={pack.name} />
        })}
      </Carousel>
    </View>

    // Put it together
    return <View style={styles.container}>
      <StatusBar hidden={true} />
      {carouselEl}
      <Animated.Image source={require('./assets/logo.png')} style={logoStyles}  />
      <View style={styles.play}>
        <Animated.Image source={require('./assets/play.png')} style={playButtonStyles} onStartShouldSetResponder={event => this.handleStartShouldSetResponder(event)} onResponderGrant={event => this.handleResponderGrant(event)} onResponderRelease={event => this.handleResponderRelease(event, this.state.currentPack)} />
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
  }
}

const styles = StyleSheet.create({
  container: {
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
  logo: {
    position: 'absolute',
    top: 43,
    marginLeft: -(157 / 2)
  },
  play: {
    position: 'absolute',
    marginLeft: -(53 / 2),
    marginTop: -(63 / 2)
  },
  carouselBar: {
    position: 'absolute',
    left: 0,
    bottom: 37,
    width: 376,
    height: 44,
    flexDirection: 'row',
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
