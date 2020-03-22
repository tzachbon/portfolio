/* eslint-disable jsx-a11y/alt-text */
import { observer, useLocalStore } from 'mobx-react';
import React, { useEffect, useRef } from 'react';
import { useStores } from '../../store/context';
import Animation from '../../utils/3d/3d';
import { DESKTOP } from '../../utils/mobile';
import './Main.scss';
import Button from '../Button/Button';
interface Props {

}

const Main = (props: Props) => {

    const mainRef = useRef<HTMLDivElement>(null)
    const localStore = useLocalStore(() => ({
        isZoomed: false,
        opacity: 1,
        isZoomEnded: false,
        loaded: 0,
        isLoaded() {
            return this.loaded >= 100;
        }
    }))
    const { store } = useStores();

    useEffect(() => {

        store.animation = new Animation(mainRef.current, !DESKTOP);

        const loading$ = store.animation
            .loadingStatus
            .subscribe(loaded => localStore.loaded = loaded)

        return loading$.unsubscribe;

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onMainClicked = () => {
        if (!localStore.isZoomed) {
            onUpdateOpacity();
            localStore.isZoomed = true;
            store.zoomIn();
        }
    }

    const onUpdateOpacity = () => {
        if (localStore.opacity > 0) {
            localStore.opacity -= 0.01;
            requestAnimationFrame(onUpdateOpacity)
        } else {
            localStore.isZoomEnded = true;
        }

    }







    return (
        <div className='main' onClick={onMainClicked} ref={mainRef}>
            {
                !localStore.isLoaded() && (
                    <div className="loaded" style={{
                        background: `linear-gradient(0deg, rgba(0,0,0, 1) ${localStore.loaded}%), rgba(255, 255, 255, 1) ${localStore.loaded}%`
                    }}></div>
                )
            }
            <header >
                <h1 style={{
                    opacity: localStore.opacity
                }}>
                    Portfolio
                </h1>
                <h3 style={{
                    opacity: localStore.opacity

                }}>
                    By Tzach Bonfil
                </h3>
            </header>

            {
                localStore.isZoomEnded && (
                    <div className='button-container'>
                        <Button white to='/about-me' onClick={store.animation.zoomInOnSection('aboutMe')} className='about-me'>
                            About Me
                        </Button>
                        <Button white to='/my-work' onClick={store.animation.zoomInOnSection('myWork')} className='my-work'>
                            My Work
                        </Button>
                    </div>
                )
            }

        </div>
    )
}

export default observer(Main)
