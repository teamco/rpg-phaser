import { Entity } from "./entity";
import { Player } from "./player";
import { Elwynn } from "../scenes/elwynn";
import { SPRITES } from "../utils/constants";

export class Enemy extends Entity {

    private player: Player | undefined;
    private isFollowing: boolean = false;
    private isAlive: boolean = true;
    private argoDistance: number = 100;
    private attackRange: number = 40;
    private followRange: number = 250;
    private moveSpeed: number = 100;
    private initialPosition: { x: number, y: number };

    constructor(scene: Elwynn, x: number, y: number, texture: string) {
        super(scene, x, y, texture, SPRITES.BOAR.base);

        this.initialPosition = { x, y };

        this.cycleTween();
        this.setFlipX(true);

        this.setPlayer(scene.getPlayer());
    }

    setPlayer(player: Player | undefined): void {
        this.player = player;
    }

    cycleTween(): void {
        this.scene.tweens.add({
            targets: this,
            duration: 1000,
            repeat: -1,
            ease: 'Linear',
            yoyo: true,
            x: this.x + 50,
            onRepeat: () => {
                this.setFlipX(true);
            },
            onYoyo: () => {
                this.setFlipX(false);
            }
        })
    }

    stopCycleTween(): void {
        this.scene.tweens.killTweensOf(this);
    }

    followToPlayer(): void {
        const player = this.player;

        if (player) {
            this.scene.physics.moveToObject(this, player, this.moveSpeed);
        }
    }

    returnToInitialPosition(distancePosition: number): void {
        this.setVelocity(0, 0);
        
        this.scene.tweens.add({
            targets: this,
            duration: distancePosition * 1000 / this.moveSpeed,
            x: this.initialPosition.x,
            y: this.initialPosition.y,
            onComplete: () => {
                this.cycleTween();
            }
        });
    }   

    update() {
        const player = this.player;
        const distanceToPlayer = Phaser.Math.Distance.Between(this.x, this.y, player?.x ?? 0, player?.y ?? 0);
        const distancePosition = Phaser.Math.Distance.Between(this.x, this.y, this.initialPosition.x, this.initialPosition.y);

        if (!this.isFollowing && distanceToPlayer < this.argoDistance) {
            this.isFollowing = true;
            this.stopCycleTween();
        }

        if (this.isFollowing && this.isAlive) {
            this.followToPlayer();

            if (distanceToPlayer < this.attackRange) {
                this.setVelocity(0, 0);
            }

            if (distancePosition > this.followRange) {
                this.isFollowing = false;
                this.returnToInitialPosition(distancePosition);
            }
        }
    }

    attack(target: Entity): void {
        const time = Math.floor(this.scene.game.loop.time);
    }

    takeDamage(damage: number): void {
        super.takeDamage(damage);

        if (this.health <= 0) {
            this.deactivate();
        }
    }

    deactivate(): void {
        this.stopCycleTween();
        this.setPosition(this.initialPosition.x, this.initialPosition.y);
        this.setVisible(false);
        this.setVelocity(0, 0);

        this.destroy();

        this.isAlive = false;
    }
}