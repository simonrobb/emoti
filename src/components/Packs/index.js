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
    image: require('./assets/animals.jpg'),
    logoColor: '#476079',
    emojis: AnimalsEmojis
  },
  {
    name: 'The City',
    image: require('./assets/animals.jpg'),
    logoColor: '#476079',
    emojis: CityEmojis
  },
  {
    name: 'Sports',
    image: require('./assets/animals.jpg'),
    logoColor: '#476079',
    emojis: SportsEmojis
  },
  {
    name: 'Food',
    image: require('./assets/animals.jpg'),
    logoColor: '#476079',
    emojis: FoodEmojis
  },
  {
    name: 'Faces',
    image: require('./assets/travel.jpg'),
    logoColor: 'white',
    emojis: FacesEmojis
  }
]

export default packs