import './style.css'
import * as Phaser from 'phaser';
import { scenes } from './scene/index';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,  // webGLを使うかcanvasを使うかをphaserが自動で判断してくれる
    width: 1280,
    height: 720,
    parent: 'game-app',  // #game-app内にcanvasを生成
    scene: scenes
};

new Phaser.Game(config);
