import Radium from 'radium';
import { flip, flipInY, rubberBand } from 'react-animations';


export const FlipAnimation = (seconds) => {

    let flipAnimation = {
        animationDuration: `${seconds}s`,
        animationName: Radium.keyframes(flip, "flip")
    };

    return flipAnimation;

};

export const FlipInYAnimation = (seconds) => {

    let flipInYAnimation = {
        animationDuration: `${seconds}s`,
        animationName: Radium.keyframes(flipInY, "flipInY")
    };

    return flipInYAnimation;

};

export const RubberBandAnimation = (seconds) => {

    let rubberBandAnimation = {
        animationDuration: `${seconds}s`,
        animationName: Radium.keyframes(rubberBand, "rubberBand")
    };

    return rubberBandAnimation;

};