import { SPRITES } from "../utils/constants";
import { Entity } from "./entity";

export class Player extends Entity {

    private textureKey: string;
    private moveSpeed: number;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture, SPRITES.PLAYER);

        this.textureKey = texture;
        this.moveSpeed = 10;

        this.animate(`down`, 0, 2);
        this.animate(`left`, 12, 14);
        this.animate(`right`, 24, 26);
        this.animate(`up`, 36, 38);

        this.setSize(28, 32);
        this.setOffset(10, 16);
        this.setScale(.8);
    }

    private animate(key: string, start: number, end: number): void {
        const anims = this.scene.anims;
        const frameRate = 9;

        anims.create({
            key,
            frames: anims.generateFrameNumbers(this.textureKey, { start, end }),
            frameRate,
            repeat: -1
        });
    }

    update(delta: number): void {      

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
        } else {
            this.stop();
            this.setVelocity(0, 0);
        }  
    }
}   