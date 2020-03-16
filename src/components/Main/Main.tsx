/* eslint-disable jsx-a11y/alt-text */
import { observer, useLocalStore } from 'mobx-react';
import React, { useEffect, useRef } from 'react';
import { useStores } from '../../store/context';
import Animation from '../../utils/3d/3d';
import { DESKTOP } from '../../utils/mobile';
import './Main.scss';
interface Props {

}

const Main = (props: Props) => {

    const mainRef = useRef<HTMLDivElement>(null)
    const localStore = useLocalStore(() => ({
        isZoomed: false,
        opacity: 1,
        showImage: true
    }))
    const { store } = useStores();

    useEffect(() => {

        store.animation = new Animation(mainRef.current, !DESKTOP);

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
        }

    }







    return (
        <div className='main' onClick={onMainClicked} ref={mainRef}>
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
            

        </div>
    )
}

export default observer(Main)
