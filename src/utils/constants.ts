import durotarJSON from '../assets/durotar.json';
import elwynnJSON from '../assets/elwynn.json';

export const MAPS = {
    DUROTAR: durotarJSON,
    ELWYNN: elwynnJSON
}

type TTiles = {
    DUROTAR: string,
    ELWYNN: string
}

export const TILES: TTiles = {
    DUROTAR: durotarJSON.tilesets[0].name,
    ELWYNN: elwynnJSON.tilesets[0].name
}

type TSIZE = {
    WIDTH: number;
    HEIGHT: number;
}

type TDIMS = {
    TILE: TSIZE,
    PLAYER: TSIZE,
    BOAR: TSIZE
}

export const DIMS: TDIMS = {
    TILE: {
        WIDTH: 32,
        HEIGHT: 32   
    },
    PLAYER: {
        WIDTH: 48,
        HEIGHT: 48
    },
    BOAR: {
        WIDTH: 32,
        HEIGHT: 32
    }
}


type TLAYERS = {
    [key: string]: string;
}

export const LAYERS: TLAYERS = {}

export const initLayers = (json: { layers: { name: string }[] }): void => {
    json.layers.map(layer => {
        LAYERS[layer.name.toUpperCase()] = layer.name;
    });     
}

type ISPRITES = {
    PLAYER: string;
    BOAR: {
        base: string
    };
}

export const SPRITES: ISPRITES = {
    PLAYER: 'player',
    BOAR: {
        base: 'boar'
    }
}
