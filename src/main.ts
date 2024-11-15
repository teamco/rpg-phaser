import Phaser from "phaser";

import { scenes } from "./scenes";

import "./style.module.css";

const game = new Phaser.Game({
  type: Phaser.AUTO,
  title: 'RPG',
  width: 800,
  height: 600,
  parent: "app",
  url: import.meta.env.BASE_URL || '',
  version: import.meta.env.VERSION || '0.0.1',
  backgroundColor: '#000000',
  physics: {
    default: 'arcade',
    arcade: {
      debug: true
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: scenes,
  pixelArt: true
});
