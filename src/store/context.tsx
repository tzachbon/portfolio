import { createContext, useContext } from 'react'
import Store from './store';
import SliderStore from './slider';

export const storesContext = createContext({
    store: new Store(),
    slider: new SliderStore()
})

export const useStores = () => useContext(storesContext);