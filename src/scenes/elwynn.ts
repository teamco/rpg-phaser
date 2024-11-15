import { TILES, DIMS, LAYERS, SPRITES, initLayers, MAPS } from "../utils/constants";
import { Player } from "../entities/player";
import { Enemy } from "../entities/enemy";

export class Elwynn extends Phaser.Scene {

    private player?: Player | undefined;
    private boar?: Enemy | undefined;

    private assetsPath: string;
    private charactersPath: string;
    private mapKey: string;

    private map: {
        ELWYNN: {
            map: string,
            image: string
        }
    }

    constructor() {
        super({ key: 'durotar' });

        this.assetsPath = 'src/assets';
        this.charactersPath = `${this.assetsPath}/characters`;

        this.map = {
            ELWYNN: {
                map: `${this.assetsPath}/elwynn.json`,
                image: `${this.assetsPath}/summer_tiles.png`
            }
        }

        this.mapKey = 'ELWYNN';
    }

    preload() {
        this.load.tilemapTiledJSON(this.mapKey, this.map.ELWYNN.map);
        this.load.image(TILES.ELWYNN, this.map.ELWYNN.image);

        this.load.spritesheet(SPRITES.PLAYER, `${this.charactersPath}/alliance.png`, { 
            frameWidth: DIMS.PLAYER.WIDTH, 
            frameHeight: DIMS.PLAYER.HEIGHT 
        });

        this.load.spritesheet(SPRITES.BOAR.base, `${this.charactersPath}/boar.png`, { 
            frameWidth: DIMS.BOAR.WIDTH, 
            frameHeight: DIMS.BOAR.HEIGHT 
        });
    }

    create() {
        const map = this.make.tilemap({ key: this.mapKey });
        const tileset: Phaser.Tilemaps.Tileset = map.addTilesetImage(
            TILES.ELWYNN, 
            TILES.ELWYNN, 
            DIMS.TILE.HEIGHT,
            DIMS.TILE.WIDTH
        );  

        initLayers(MAPS.ELWYNN);

        const groundLayer = map.createLayer(LAYERS.GROUND, tileset, 0, 0);
        
        const wallLayer = map.createLayer(LAYERS.WALLS, tileset, 0, 0);
        wallLayer?.setCollisionByExclusion([-1]);

        this.player = new Player(this, 400, 250, SPRITES.PLAYER);

        this.boar = new Enemy(this, 100, 100, SPRITES.BOAR.base);

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);

        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        
        this.player.setCollideWorldBounds(true);

        this.physics.add.collider(this.player, wallLayer);
    }   

    update(time: number, delta: number): void {
        this.player?.update(delta);
        this.boar?.update();
    }

    getPlayer(): Player | undefined {
        return this.player;
    }
}