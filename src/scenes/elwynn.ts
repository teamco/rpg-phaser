import { TILES, DIMS, LAYERS, SPRITES, initLayers, MAPS } from "../utils/constants";
import { Player } from "../entities/player";
import { Enemy } from "../entities/enemy";

import alliance from '../assets/characters/alliance.png';
import fight from '../assets/characters/alliance-fight-small.png';
import boar from '../assets/characters/boar.png';
import summer_tiles from '../assets/summer_tiles.png';

export class Elwynn extends Phaser.Scene {

    private player?: Player | undefined;

    private boars: Enemy[] = [];

    private mapKey: string;

    private killsText: Phaser.GameObjects.Text | undefined;

    constructor() {
        super({ key: 'durotar' });
        this.mapKey = 'ELWYNN';
    }

    preload() {
        this.load.tilemapTiledJSON(this.mapKey, MAPS.ELWYNN);
        this.load.image(TILES.ELWYNN, summer_tiles);

        this.load.spritesheet(SPRITES.PLAYER.base, alliance, { 
            frameWidth: DIMS.PLAYER.WIDTH, 
            frameHeight: DIMS.PLAYER.HEIGHT 
        });

        this.load.spritesheet(SPRITES.BOAR.base, boar, { 
            frameWidth: DIMS.BOAR.WIDTH, 
            frameHeight: DIMS.BOAR.HEIGHT 
        });

        this.load.spritesheet(SPRITES.PLAYER.fight, fight, { 
            frameWidth: DIMS.PLAYER.WIDTH, 
            frameHeight: DIMS.PLAYER.HEIGHT 
        });
    }

    create() {
        const map = this.make.tilemap({ key: this.mapKey });
        const tileset = map.addTilesetImage(
            TILES.ELWYNN, 
            TILES.ELWYNN, 
            DIMS.TILE.HEIGHT,
            DIMS.TILE.WIDTH
        );  

        initLayers(MAPS.ELWYNN);

        map.createLayer(LAYERS.GROUND, tileset as Phaser.Tilemaps.Tileset, 0, 0);
        
        const wallLayer = map.createLayer(LAYERS.WALLS, tileset as Phaser.Tilemaps.Tileset, 0, 0);
        wallLayer?.setCollisionByExclusion([-1]);

        this.player = new Player(this, 400, 250, SPRITES.PLAYER);

        this.boars = [
            new Enemy(this, 100, 100, SPRITES.BOAR.base),
            new Enemy(this, 600, 300, SPRITES.BOAR.base),
            new Enemy(this, 200, 250, SPRITES.BOAR.base),
            new Enemy(this, 250, 550, SPRITES.BOAR.base)
        ]

        this.boars.forEach((boar: Enemy) => {
            boar?.setPlayer(this.player);
        }) 

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);

        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        
        this.player.setCollideWorldBounds(true);
        this.player.setEnemies([...this.boars]);

        this.physics.add.collider(this.player, wallLayer as Phaser.Tilemaps.TilemapLayer);

        this.killsText = this.add.text(600, 10, `Kills: ${this.player?.kills}`, {
            fontFamily: 'monospace, Arial, sans-serif',
            fontSize: '32px',
            color: '#fff'
        });

        this.killsText?.setScrollFactor(0);
    }   

    update(_: any, delta: number): void {
        this.player?.update(delta);

        this.boars.forEach((boar: Enemy) => {
            boar?.update();
        });   
        
        this.killsText?.setText(`Kills: ${this.player?.kills}`);
    }

    getPlayer(): Player | undefined {
        return this.player;
    }
}