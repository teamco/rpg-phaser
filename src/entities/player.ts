import { SPRITES } from "../utils/constants";
import { Entity } from "./entity";

type ITexture = {
    [key: string]: string
}

export class Player extends Entity {

    private moveSpeed: number;
    private isAttacking: boolean = false;

    kills: number = 0;

    private enemies: Entity[] = [];

    private playerHealthBar?: Phaser.GameObjects.Graphics;
    private enemyHealthBar?: Phaser.GameObjects.Graphics;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: ITexture) {
        super(scene, x, y, texture.base, SPRITES.PLAYER.base);

        this.moveSpeed = 10;

        this.animate(`down`, texture.base, 0, 2);
        this.animate(`left`, texture.base, 12, 14);
        this.animate(`right`, texture.base, 24, 26);
        this.animate(`up`, texture.base, 36, 38);

        this.animate(`fight`, texture.fight, 3, 6, 0);

        this.setSize(28, 32);
        this.setOffset(10, 16);
        this.setScale(.8);

        this.setupKeys();

        this.drawPlayerHealthBar();

        this.on('animationcomplete', this.onAnimationComplete);
    }

    private onAnimationComplete(animation: string): void {
        if (animation === 'fight') {
            this.isAttacking = false;
        }
    }

    private animate(key: string, texture: string, start: number, end: number, repeat: number = -1): void {
        const anims = this.scene.anims;
        const frameRate = 9;

        anims.create({
            key,
            frames: anims.generateFrameNumbers(texture, { start, end }),
            frameRate,
            repeat
        });
    }

    private drawHealthBar(graphics: Phaser.GameObjects.Graphics, x: number, y: number, percentage: number): void {
        const healthBarWidth = 100;
        const healthBarHeight = 10;

        graphics.fillStyle(0x000000, 1);
        graphics.fillRect(x, y, healthBarWidth, healthBarHeight);

        let rgb = 0x00ff00;

        if (percentage > 0.5 && percentage <= 0.75) {
            rgb = 0xffff00;
        } else if (percentage <= 0.5) {
            rgb = 0xff0000;
        }

        graphics.fillStyle(rgb, 1);
        graphics.fillRect(x, y, healthBarWidth * percentage, healthBarHeight);

    } 
    
    private drawPlayerHealthBar(): void {
        this.playerHealthBar = this.scene.add.graphics();
        this.playerHealthBar.setScrollFactor(0);

        this.drawHealthBar(this.playerHealthBar, 10, 10, this.health / 100);  
    }

    private drawEnemyHealthBar(target: Entity | null): void {
        this.enemyHealthBar = this.scene.add.graphics();
        this.enemyHealthBar.setScrollFactor(0);

        if (target) {
            this.drawHealthBar(this.enemyHealthBar, 10, 30, target.health / 100); 
        }
    }

    addKill(): void {
        this.kills++;
    }

    attack(target: Entity | null): void {
        const distanseToEnemy = Phaser.Math.Distance.Between(this.x, this.y, target?.x || 0, target?.y || 0);
        
        if (target && distanseToEnemy <= 50) {
            target.takeDamage(25);
        }
    }

    setEnemies(enemies: Entity[]): void {
        this.enemies = enemies;
    }

    findTarget(): Entity | null {
        let target = null;
        let minDistance = Infinity;

        this.enemies.forEach((enemy) => {
            const distance = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y);

            if (distance < minDistance) {
                minDistance = distance;
                target = enemy;
            }
        });

        return target;
    }

    private setupKeys(): void {
        this.scene.input.keyboard?.on('keydown-SPACE', () => {
            const target = this.findTarget();

            this.play('fight', true);
            this.setVelocity(0, 0);

            this.attack(target);
            this.drawEnemyHealthBar(target);

        });
    }

    update(delta: number): void {      

        this.drawPlayerHealthBar();
        this.drawEnemyHealthBar(this.findTarget());

        const keys = this.scene.input.keyboard?.createCursorKeys();

        if (keys?.up.isDown) {
            this.play('up', true);
            this.setVelocityY(-delta * this.moveSpeed);
        } else if (keys?.down.isDown) {
            this.play('down', true);
            this.setVelocityY(delta * this.moveSpeed);
        } else if (keys?.left.isDown) {
            this.play('left', true);
            this.setVelocityX(-delta * this.moveSpeed);
        } else if (keys?.right.isDown) {
            this.play('right', true);
            this.setVelocityX(delta * this.moveSpeed);
        } else if (this.isAttacking) {
            this.setVelocity(0, 0);    
        } else {
            this.stop();
            this.setVelocity(0, 0);
        }  
    }
}   