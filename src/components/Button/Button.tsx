import ClassNames from 'classnames';
import { observer } from 'mobx-react';
import React from 'react';
import { Link } from 'react-router-dom';

interface Props {
    className?: string,
    grey?: boolean,
    white?: boolean,
    type?: "submit" | "button" | "reset",
    primary?: boolean,
    small?: boolean,
    onClick?: (event: any) => any,
    to?: string,
    href?: string,
    target?: string,
    withIcon?: boolean,
    submit?: boolean
}

const Button: React.FC<Props> = (props) => {
    let {
        className,
        grey,
        white,
        type,
        primary,
        children,
        small,
        onClick,
        to,
        href,
        target,
        withIcon,
        submit
    } = props;

    if (!onClick) {
        onClick = (e) => { };
    }

    className = ClassNames('Button', className, {
        'With-icon': withIcon,
        'Button-small': small,
        'Button-primary': primary,
        'Button-grey': grey,
        'Button-white': white
    });

    if (href)
        return (
            <a target={target} href={href} onClick={onClick} className={className}>
                {children}
            </a>
        );

    if (to)
        return (
            <Link
                target={target}
                to={to}
                onClick={onClick}
                className={className}
            >
                {children}
            </Link>
        );

    if (submit)
        return (
            <button
                name={type || 'submit'}
                type={type || 'submit'}
                onClick={onClick}
                className={className}
            >
                {children}
            </button>
        );

    return (
        <div onClick={onClick} className={className}>
            {children}
        </div>
    );
}


export default observer(Button);