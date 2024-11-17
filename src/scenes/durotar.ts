import { TILES, DIMS, LAYERS, SPRITES } from "../utils/constants";
import { Player } from "../entities/player";

export class Durotar extends Phaser.Scene {

    private player?: Player;

    private assetsPath: string;
    private charactersPath: string;

    private map: {
        DUROTAR: {
            map: string,
            image: string
        }
    }

    constructor() {
        super({ key: 'durotar' });

        this.assetsPath = 'src/assets';
        this.charactersPath = `${this.assetsPath}/characters`;

        this.map = {
            DUROTAR: {
                map: `${this.assetsPath}/durotar.json`,
                image: `${this.assetsPath}/durotar.png`
            }
        }
    }

    preload() {
        this.load.tilemapTiledJSON('map', this.map.DUROTAR.map);
        this.load.image(TILES.DUROTAR, this.map.DUROTAR.image);

        this.load.spritesheet(SPRITES.PLAYER.base, `${this.charactersPath}/alliance.png`, { 
            frameWidth: DIMS.PLAYER.WIDTH, 
            frameHeight: DIMS.PLAYER.HEIGHT 
        });
    }

    create() {
        const map = this.make.tilemap({ key: 'map' });
        const tileset = map.addTilesetImage(
            TILES.DUROTAR, 
            TILES.DUROTAR, 
            DIMS.TILE.HEIGHT,
            DIMS.TILE.WIDTH
        );  

        map.createLayer(LAYERS.GROUND, tileset as Phaser.Tilemaps.Tileset, 0, 0);
        map.createLayer(LAYERS.WALLS, tileset as Phaser.Tilemaps.Tileset, 0, 0);

        this.player = new Player(this, 400, 250, SPRITES.PLAYER);
        
    }   

    update(_: any, delta: number): void {
        this.player?.update(delta);
    }
}