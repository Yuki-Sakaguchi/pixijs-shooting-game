import './style.css';

import { Application, Container, Sprite, Texture } from 'pixi.js';

/**
 * キャラクターのベース
 */
class Charactor {
  time: number;
  block: Sprite;

  constructor(color: number, x: number, y: number) {
    this.block = new Sprite(Texture.WHITE);
    this.block.tint = color;
    this.block.interactive = true;
    this.block.width = 100;
    this.block.height = 100;
    this.block.anchor.set(0.5);
    this.block.x = x;
    this.block.y = y;

    // 生まれてから立った時間
    this.time = 0;
  }
}

/**
 * 自キャラクター
 */
class Player extends Charactor {
  constructor(x: number, y: number) {
    super(0xffffff, x, y);
  }
}

/**
 * 敵キャラクター
 */
class Enemy extends Charactor {
  constructor(x: number, y: number) {
    super(0xff0000, x, y);
    this.block.scale.set(0.5);
  }
}

class Sketch {
  app: Application;
  width: number;
  height: number;
  time: number;
  container: Container;
  player: Player;
  enemyList: Array<Enemy>;
  mousePoint: { x: number, y: number };

  constructor() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.mousePoint = { x: this.width/2, y: this.height/2 };

    this.app = new Application({
        width: this.width,
        height: this.height,
        antialias: true,
        resolution: (window.devicePixelRatio > 1) ? 2 : 1,
        autoDensity: true,
        resizeTo: window,
        backgroundColor: 0xa0a0a0a,
    });
    document.body.appendChild(this.app.view);
    
    this.time = 0;
    this.container = new Container();
    
    this.app.stage.addChild(this.container);

    this.player = new Player(this.app.screen.width / 2, this.app.screen.height / 2);
    this.container.addChild(this.player.block);

    this.enemyList = [];

    this.render();

    window.addEventListener('resize', this.resize.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
  }

  createBlock() {
    const enemy = new Enemy(this.app.screen.width / 2, this.app.screen.height / 2);
    this.container.addChild(enemy.block);
    this.enemyList.push(enemy);
  }

  render() {
    this.app.ticker.add(() => {
      this.time += 1;

      this.player.block.position.x = this.mousePoint.x;
      this.player.block.position.y = this.mousePoint.y;

      for (let i = 0; i < this.enemyList.length; i++) {
        const enemy = this.enemyList[i];

        // 移動
        enemy.block.position.x += (enemy.time / 50);
        enemy.time += 1;

        // 画面外に消えてたら削除
        if (enemy.block.x <= 0 || enemy.block.y <= 0 || enemy.block.x >= this.app.screen.width || enemy.block.y >= this.app.screen.height) {
          enemy.block.destroy();
          this.enemyList.splice(i, 1);
          continue;
        }
        
        // 当たり判定
        if (this.hitTest(this.player.block, enemy.block)) {
          enemy.block.destroy();
          this.enemyList.splice(i, 1);
          continue;
        }
      }

      console.log(this.enemyList);

      if (this.time % 100 === 0) {
        this.createBlock();
      }
    });
  }

  hitTest(r1: Sprite, r2: Sprite) {
    const r1CenterX = r1.x;
    const r1CenterY = r1.y;
    const r2CenterX = r2.x;
    const r2CenterY = r2.y;
  
    const r1HalfWidth = r1.width / 2;
    const r1HalfHeight = r1.height / 2;
    const r2HalfWidth = r2.width / 2;
    const r2HalfHeight = r2.height / 2;
  
    const vx = r1CenterX - r2CenterX;
    const vy = r1CenterY - r2CenterY;
    
    const combinedHalfWidths = r1HalfWidth + r2HalfWidth;
    const combinedHalfHeights = r1HalfHeight + r2HalfHeight;
    
    let hit = false;
    if (Math.abs(vx) < combinedHalfWidths) {
      if (Math.abs(vy) < combinedHalfHeights) {
        hit = true;
      } else {
        hit = false;
      }
    } else {
      hit = false;
    }
    return hit;
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.app.renderer.resize(window.innerWidth, window.innerHeight);

    this.container.removeChildren(0, this.container.children.length);
    this.createBlock();
  }

  onMouseMove(e: MouseEvent) {
    this.mousePoint.x = e.offsetX; 
    this.mousePoint.y = e.offsetY; 
  }
}

const sketch = new Sketch();

