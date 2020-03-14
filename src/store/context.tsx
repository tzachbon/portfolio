import { createContext, useContext } from 'react'
import Store from './store';

export const storesContext = createContext({
    store: new Store()
})

export const useStores = () => useContext(storesContext);