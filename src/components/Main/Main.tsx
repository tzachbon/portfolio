import React, { useRef, useEffect, useState } from 'react'
import { observer } from 'mobx-react';
import Animation from '../../utils/3d/3d';
import { DESKTOP } from '../../utils/mobile';


interface Props {

}

const Main = (props: Props) => {

    const mainRef = useRef<HTMLDivElement>(null)
    const [animation, setAnimation] = useState<Animation>(null)

    useEffect(() => {
        setAnimation(new Animation(
            mainRef.current,
            !DESKTOP
        ))
    }, []);

    return (
        <div className='main' ref={mainRef}>

        </div>
    )
}

export default observer(Main)
