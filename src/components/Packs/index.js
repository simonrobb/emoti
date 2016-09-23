import { 
  Animals as AnimalsEmojis, 
  City as CityEmojis, 
  Sports as SportsEmojis, 
  Food as FoodEmojis, 
  Faces as FacesEmojis 
} from '../../components/Emojis'

const packs = [
  {
    name: 'Animals',
    image: require('./assets/animals.png'),
    logoColor: '#FFFFFF',
    emojis: AnimalsEmojis
  },
  {
    name: 'Sports',
    image: require('./assets/sports.png'),
    logoColor: '#476079',
    emojis: SportsEmojis
  },
  {
    name: 'Food',
    image: require('./assets/food.png'),
    logoColor: '#896428',
    emojis: FoodEmojis
  }
]

export default packs