import {
  Application,
  Container,
  Sprite,
  Text,
  settings,
  SCALE_MODES,
} from "pixi.js";

import "./style.css";

/**
 * キャラクターのベースクラス
 */
class Charactor {
  time: number;
  sprite: Sprite;

  constructor(
    x: number,
    y: number,
    size: number,
    image: string = "/images/rocket.png"
  ) {
    this.sprite = Sprite.from(image);
    this.sprite.interactive = true;
    this.sprite.width = size;
    this.sprite.height = size;
    this.sprite.anchor.set(0.5);
    this.sprite.x = x;
    this.sprite.y = y;

    // 生まれてから立った時間
    this.time = 0;
  }
}

/**
 * 自キャラクター
 */
class Player extends Charactor {
  hitSizeMin: number;
  hitSizeMax: number;

  constructor(x: number, y: number) {
    super(x, y, 80);
    this.sprite.zIndex = 20;
    this.hitSizeMin = this.sprite.width * 1.0;
    this.hitSizeMax = this.sprite.width * 1.4;
  }
}

/** 移動タイプ */
type MoveType = 1 | 2 | 3 | 4;

/** 敵タイプ */
type EnemyType = 1 | 2;

/**
 * 敵キャラクター
 */
class Enemy extends Charactor {
  enemyType: EnemyType;
  moveType: MoveType;

  constructor(
    x: number,
    y: number,
    enemyType: EnemyType = 1,
    moveType: MoveType = 1
  ) {
    super(
      x,
      y,
      100,
      enemyType === 2 ? "/images/light.png" : "/images/light_dark.png"
    );
    this.sprite.scale.set(0.5);
    this.sprite.zIndex = 10;
    this.moveType = moveType;
    this.enemyType = enemyType;
  }

  moveRight() {
    this.sprite.position.x += this.time / 30;
    this.sprite.scale.set(this.sprite.scale.x + 0.03);
  }

  moveLeft() {
    this.sprite.position.x += -(this.time / 30);
    this.sprite.scale.set(this.sprite.scale.x + 0.03);
  }

  moveTop() {
    this.sprite.position.y += -(this.time / 30);
    this.sprite.scale.set(this.sprite.scale.x + 0.03);
  }

  moveBottom() {
    this.sprite.position.y += this.time / 30;
    this.sprite.scale.set(this.sprite.scale.x + 0.03);
  }

  moveCircle() {}

  update() {
    switch (this.moveType) {
      case 1:
        this.moveRight();
        break;
      case 2:
        this.moveLeft();
        break;
      case 3:
        this.moveTop();
        break;
      case 4:
        this.moveBottom();
        break;
      default:
        this.moveRight();
    }
    this.time += 1;
  }
}

/**
 * メインクラス
 */
class Sketch {
  app: Application;
  width: number;
  height: number;
  time: number;
  container: Container;
  uiContainer: Container;
  player: Player;
  enemyList: Array<Enemy>;
  mousePoint: { x: number; y: number };
  point: number;
  pointText: Text;

  constructor() {
    settings.SCALE_MODE = SCALE_MODES.NEAREST;
    Sprite.from("/images/light.png");
    Sprite.from("/images/light_dark.png");
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.mousePoint = { x: this.width / 2, y: this.height / 2 };
    this.time = 0;

    this.app = new Application({
      width: this.width,
      height: this.height,
      antialias: true,
      resolution: window.devicePixelRatio > 1 ? 2 : 1,
      autoDensity: true,
      resizeTo: window,
      transparent: true,
    });
    document.body.appendChild(this.app.view);

    this.container = new Container();
    this.container.sortableChildren = true;

    this.app.stage.addChild(this.container);

    this.player = new Player(
      this.app.screen.width / 2,
      this.app.screen.height / 2
    );
    this.container.addChild(this.player.sprite);

    this.enemyList = [];

    this.point = 0;
    this.pointText = new Text(`POINT : ${this.point}`, {
      fontFamily: "Arial",
      fontSize: 24,
      fill: 0xffffff,
      align: "left",
    });
    this.pointText.position.x = 10;
    this.pointText.position.y = 10;

    this.uiContainer = new Container();
    this.uiContainer.addChild(this.pointText);
    this.app.stage.addChild(this.uiContainer);

    window.addEventListener("resize", this.resize.bind(this));
    window.addEventListener("mousemove", this.onMouseMove.bind(this));

    this.render();
  }

  /**
   * 敵を生成する
   */
  createBlock(enemyType: EnemyType, moveType: MoveType) {
    const enemy = new Enemy(
      this.app.screen.width / 2,
      this.app.screen.height / 2,
      enemyType,
      moveType
    );
    this.container.addChild(enemy.sprite);
    this.enemyList.push(enemy);
  }

  /**
   * スプライトごとの当たり判定
   */
  hitTest(r1: Sprite, r2: Sprite) {
    const r1HalfWidth = r1.width / 2;
    const r1HalfHeight = r1.height / 2;
    const r2HalfWidth = r2.width / 2;
    const r2HalfHeight = r2.height / 2;

    const vx = r1.x - r2.x;
    const vy = r1.y - r2.y;

    const combinedHalfWidths = r1HalfWidth + r2HalfWidth;
    const combinedHalfHeights = r1HalfHeight + r2HalfHeight;

    if (Math.abs(vx) < combinedHalfWidths) {
      if (Math.abs(vy) < combinedHalfHeights) {
        return true;
      }
    }
    return false;
  }

  /**
   * 最小値、最大値を指定して乱数を作る関数
   * @param {number} min
   * @param {number} max
   * @returns ランダムな整数
   */
  random(min: number, max: number) {
    return Math.floor(Math.random() * (max + 1 - min)) + min;
  }

  /**
   * 描画
   */
  render() {
    this.app.ticker.add(() => {
      this.time += 1;

      this.player.sprite.position.x = this.mousePoint.x;
      this.player.sprite.position.y = this.mousePoint.y;

      if (this.point > 5000) {
        this.app.destroy();
        alert("clear!!");
        return;
      }

      for (let i = 0; i < this.enemyList.length; i++) {
        const enemy = this.enemyList[i];

        // 敵の描画更新
        enemy.update();

        if (enemy.sprite.width > this.player.hitSizeMax) {
          enemy.sprite.zIndex = 30;
        }

        // 画面外に消えてたら削除
        if (
          enemy.sprite.x <= 0 ||
          enemy.sprite.y <= 0 ||
          enemy.sprite.x >= this.app.screen.width ||
          enemy.sprite.y >= this.app.screen.height
        ) {
          enemy.sprite.destroy();
          this.enemyList.splice(i, 1);
          continue;
        }

        // 当たり判定
        if (
          enemy.sprite.width > this.player.hitSizeMin &&
          enemy.sprite.width < this.player.hitSizeMax
        ) {
          if (this.hitTest(this.player.sprite, enemy.sprite)) {
            enemy.sprite.destroy();
            this.enemyList.splice(i, 1);
            if (enemy.enemyType === 1) {
              this.app.destroy();
              setTimeout(() => {
                alert("game over");
              }, 200);
              return;
            }
            if (enemy.enemyType === 2) {
              this.point += 100;
              this.pointText.text = `POINT : ${this.point}`;
            }
            continue;
          }
        }
      }

      // 定期的に敵を生成
      const limit = this.time > 1000 ? 10 : 75;
      if (this.time % limit === 0) {
        const enemyType = this.random(1, 2) as EnemyType;
        const moveType = this.random(1, 4) as MoveType;
        this.createBlock(enemyType, moveType);
      }
    });
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.app.renderer.resize(window.innerWidth, window.innerHeight);

    this.container.removeChildren(0, this.container.children.length);
  }

  onMouseMove(e: MouseEvent) {
    this.mousePoint.x = e.offsetX;
    this.mousePoint.y = e.offsetY;
  }
}

new Sketch();
