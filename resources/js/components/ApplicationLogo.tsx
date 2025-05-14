import { Attributes, ImgHTMLAttributes, SVGAttributes } from 'react';

export default function ApplicationLogo(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img src='/img/logo.jpg' alt='logo' {...props} />
    );
}
