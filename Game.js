var SPEED = 4;
var WINDOW_WIDTH = 640;
var WINDOW_HEIGHT = 960;
var BLOCK_WIDTH = 40 * 2;
var BLOCK_HEIGHT = 60 / 2;
var MOVE_FRAME = 6;
const COUNTDOWN = 60;

//githubで公開したレポジトリは自動的にjsdelivrで配布?される
//ので，ユーザー名とレポジトリ名を適切に指定すれば画像が参照できる！
var mainImg = {
    image : {
        'ika' : 'https://cdn.jsdelivr.net/gh/SohuKou106/osushi/images/ika_pink.png',
        'background' : 'https://cdn.jsdelivr.net/gh/SohuKou106/osushi/images/background.png',
        'lane' : 'https://cdn.jsdelivr.net/gh/SohuKou106/osushi/images/lane_gray.png',
        'steak' : 'https://cdn.jsdelivr.net/gh/SohuKou106/osushi/images/steak.png',
    },
};

// MainScene クラスを定義
phina.define('GameScene', {
    superClass: 'DisplayScene',

    freezeFlame : 0,    //被弾時の硬直
    movingFrame : 0,    //左右に移動している最中の操作非受付時間
    beginFrame : 0,     //ゲーム開始時のフレーム
    playing : false,    //自機が操作可能な状態か（カウントダウン，ゲームオーバーなどでないか）

    init: function() {
        this.superInit();

        // 背景色を指定
        new Sprite('background').addChildTo(this).setPosition(this.gridX.center(), this.gridY.center());
        new Sprite('lane').addChildTo(this).setPosition(this.gridX.center(), this.gridY.center());
        

        // ブロックグループ
        this.blockGroup = DisplayElement().addChildTo(this);
        // 弾グループ
        this.shotGroup = DisplayElement().addChildTo(this);
        var self = this;

        //自機
        const player = new Player({
            image: 'ika',
            width: 40,
            height: 40,
            x: 320,
            y: 480,
        });
        player.addChildTo(this);
        this.player = player;

        var playerNum = 0;
        this.playerNum = playerNum;

        //体力バー（下地）
        new RectangleShape({
            width: 30,
            height: 300,
            x: WINDOW_WIDTH - 40,
            y: this.gridY.center(),
            fill: 'gray',
        }).addChildTo(this);

        //体力バー
        const hpBar = new HPBar({
            width: 30,
            height: 300,
            x: WINDOW_WIDTH - 40,
            y: this.gridY.center(),
        }).addChildTo(this);
        this.hpBar = hpBar;

        //体力バー（枠）
        new RectangleShape({
            width: 30,
            height: 300,
            x: WINDOW_WIDTH - 40,
            y: this.gridY.center(),
            fill: 'transparent',
            stroke: 'white',
            strokeWidth: 5,
        }).addChildTo(this);

        //敵機
        const e_steak = new Enemy({
            image: 'steak',
            width: 528,
            height: 352,
            x: this.gridX.center(),
            y: this.gridY.center(-2),
        });
        e_steak.addChildTo(this);
        this.e_steak = e_steak;

        //ステージ
        var stage = new Stage({
            width: 64,
            height: 64,
            velocityX: SPEED * -1,
            velocityY: 0,
            x: 640 + 64,
            y: 860,
            boundaryLeft: 40,
            boundaryTop: 680,
            stageID: 0,
        }).addChildTo(self.blockGroup);
        this.stage = stage

        //

        //ゲームオーバーメッセージ
        var gameOverLabel = new Label({
            text: 'GAME OVER',
            x : this.gridX.center(),
            y : this.gridY.center(),
            fontSize : 64,
            fill : 'white',
        }).addChildTo(this);
        this.gameOverLabel = gameOverLabel
        gameOverLabel.hide()

        var gameOverLabel2 = new Label({
            text: 'Press Return Key',
            x : this.gridX.center(),
            y : this.gridY.center(2),
            fontSize : 32,
            fill : 'white',
        }).addChildTo(this);
        this.gameOverLabel2 = gameOverLabel2
        gameOverLabel2.hide()
        
        /*var e_stage = new EnemyStage({
            width: 64,
            height: 64,
            velocityX: SPEED,
            velocityY: 0,
            x: 0 - 8 * 8,
            y: 100,
            boundaryRight: 600,
            boundaryBottom: 280,
        }).addChildTo(self.blockGroup);
        this.e_stage = e_stage*/
    },

    update({keyboard, frame,}) 
    {
        var {
            stage,
            e_stage,
            player,
            hpBar,
            playerNum,
            gameOverLabel,
            gameOverLabel2,

            //グループ
            blockGroup,
            shotGroup,
        } = this;
       
        //**************************************
        //カウントダウン処理
        //**************************************
        if(this.beginFrame <= 0) {
            this.beginFrame = frame;
            this.gameOverLabel.text = 'Ready...';
            this.gameOverLabel.show();
        }

        if(!this.playing){
            this.gameOverLabel.fill = 'rgba(255,' + ((COUNTDOWN - (frame - this.beginFrame))/ COUNTDOWN * 255).toString() + ',' + ((COUNTDOWN - (frame - this.beginFrame))/ COUNTDOWN * 255).toString() +',1)'
            if(frame >= this.beginFrame + COUNTDOWN){
                this.gameOverLabel.hide();
                this.playing = true;
            }
        }


        if(stage.next()){
            var stage = new Stage({
                width: 64,
                height: 64,
                velocityX: SPEED * -1,
                velocityY: 0,
                x: 640 + 64,
                y: 860,
                boundaryLeft: 40,
                boundaryTop: 680,
            }).addChildTo(this.blockGroup);
            this.stage = stage
        }

        //自分の乗っているブロックが画面外に出そうになったら一番最近出た皿に移動させて出た皿を消去
        //(移動させるのと皿の消去の処理のタイミングは少しずらす)
        if(this.blockGroup.children.length > 1 && this.blockGroup.children.first.x > WINDOW_WIDTH - 32){
            //画面外に半分出かけたら一番最近出た皿に移動させる
            if(this.playerNum == 0 && !this.player.gameOver){
                if(this.blockGroup.children.last.x <= 600) this.playerNum = this.blockGroup.children.length - 1;
                else this.playerNum = this.blockGroup.children.length - 2;
                player.move(this.blockGroup.children[this.playerNum].x, this.blockGroup.children[this.playerNum].y)
                player.setHP(player.getHP() - 30);
                this.freezeFlame = 25;
            }

            //画面外に完全に出たら皿を消去
            if(this.blockGroup.children.first.x > WINDOW_WIDTH + 64){
                this.playerNum--;
                this.blockGroup.children.first.remove();
            }
        }

        this.hpBar.setHP(this.player.HP);
        
        //硬直状態なら硬直時間を減らす
        if(this.freezeFlame > 0) {
            this.freezeFlame--;
        }

        if(this.movingFrame > 0){
            this.movingFrame--;
        }
        else {
            //皿の移動に伴う自機の移動
            //console.log("moving")
            if(!this.player.gameOver)
                player.move(this.blockGroup.children[this.playerNum].x, this.blockGroup.children[this.playerNum].y)
        }
        
        //皿を戻る
        if(keyboard.getKey('down') && frame % 3 == 0 && this.freezeFlame <= 0 && this.movingFrame <= 0 && !this.player.gameOver && this.playing){
            //末尾の皿より先に進まない + 移動先が端っこなら進まない
            if(this.playerNum + 1 < this.blockGroup.children.length && this.blockGroup.children[this.playerNum + 1].x <= 600){
                this.movingFrame = MOVE_FRAME;
                this.playerNum += 1;
                player.moveDish(this.blockGroup.children[this.playerNum - 1].x, this.blockGroup.children[this.playerNum - 1].y,
                    this.blockGroup.children[this.playerNum].x, this.blockGroup.children[this.playerNum].y, 
                    this.blockGroup.children[this.playerNum].physical.velocity.x, this.blockGroup.children[this.playerNum].physical.velocity.y, this.movingFrame);
            }
        }

        //皿を進む
        if(keyboard.getKey('up') && frame % 3 == 0 && this.freezeFlame <= 0 && this.movingFrame <= 0 && !this.player.gameOver && this.playing){
            //先端の皿より先に進まない + 移動先が端っこなら進まない
            if(this.playerNum > 0 && this.blockGroup.children[this.playerNum - 1].x <= 600) {
                this.movingFrame = MOVE_FRAME;
                this.playerNum -= 1;
                player.moveDish(this.blockGroup.children[this.playerNum + 1].x, this.blockGroup.children[this.playerNum + 1].y,
                    this.blockGroup.children[this.playerNum].x, this.blockGroup.children[this.playerNum].y,
                    this.blockGroup.children[this.playerNum].physical.velocity.x, this.blockGroup.children[this.playerNum].physical.velocity.y, this.movingFrame)
            }
        }

        //弾を発射
        if(keyboard.getKey('space') && this.freezeFlame <= 0 && !this.player.gameOver && this.playing){
            new Shot({
                x: player.x,
                y: player.y,
                radius: 5,
                velocityX: 0,
                velocityY: -30,
            }).addChildTo(this.shotGroup)
        }

        //画面外に出た弾を消去
        this.shotGroup.children.eraseIf(function(elem) {
            if (elem.y < -50) {
                return true;
            }
        });

        //デバッグ用　自滅
        if(keyboard.getKey('7') && !this.player.gameOver && this.playing){
            this.player.setHP(0)
            this.hpBar.setHP(this.player.HP);
        }
        
        //**************************************
        //ゲームオーヴァー処理
        //**************************************
        if(this.player.HP <= 0 && !this.player.endFlag){
            this.player.gameOverMove();
        }

        if(this.player.endFlag){
            this.gameOverLabel.text = 'GAME OVER'
            this.gameOverLabel.fill = 'white'
            this.gameOverLabel.show();
            this.gameOverLabel2.show();
            if(keyboard.getKeyUp('return')){
                this.exit();
            }
        }
    },

    //動ける状態か（各フラグやフレームをチェックする）
    canMove(){
        if(this.freezeFlame < 0 && !this.player.gameOver && this.playing){

        }
    }
});
