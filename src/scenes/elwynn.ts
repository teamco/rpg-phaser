import { TILES, DIMS, LAYERS, SPRITES, initLayers, MAPS } from "../utils/constants";
import { Player } from "../entities/player";
import { Enemy } from "../entities/enemy";

export class Elwynn extends Phaser.Scene {

    private player?: Player | undefined;

    private boars: Enemy[] = [];

    private assetsPath: string;
    private charactersPath: string;
    private mapKey: string;

    private killsText: Phaser.GameObjects.Text | undefined;

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

        this.load.spritesheet(SPRITES.PLAYER.base, `${this.charactersPath}/alliance.png`, { 
            frameWidth: DIMS.PLAYER.WIDTH, 
            frameHeight: DIMS.PLAYER.HEIGHT 
        });

        this.load.spritesheet(SPRITES.BOAR.base, `${this.charactersPath}/boar.png`, { 
            frameWidth: DIMS.BOAR.WIDTH, 
            frameHeight: DIMS.BOAR.HEIGHT 
        });

        this.load.spritesheet(SPRITES.PLAYER.fight, `${this.charactersPath}/alliance-fight-small.png`, { 
            frameWidth: DIMS.PLAYER.WIDTH, 
            frameHeight: DIMS.PLAYER.HEIGHT 
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

        this.physics.add.collider(this.player, wallLayer);

        this.killsText = this.add.text(600, 10, `Kills: ${this.player?.kills}`, {
            fontFamily: 'monospace, Arial, sans-serif',
            fontSize: '32px',
            color: '#fff'
        });

        this.killsText?.setScrollFactor(0);
    }   

    update(time: number, delta: number): void {
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