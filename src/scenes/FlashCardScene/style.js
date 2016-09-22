import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  bar: {
    flex: 0,
    flexDirection: 'row',
    height: 70,
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})

export default styles