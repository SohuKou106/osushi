var SPEED = 4;
var WINDOW_WIDTH = 640;
var WINDOW_HEIGHT = 960;
var BLOCK_WIDTH = 40 * 2;
var BLOCK_HEIGHT = 60 / 2;
var MOVE_FRAME = 6;
const COUNTDOWN = 60;
const HPBAR_WIDTH = 20;
const HPBAR_HEIGHT = 200;

//githubで公開したレポジトリは自動的にjsdelivrで配布?される
//ので，ユーザー名とレポジトリ名を適切に指定すれば画像が参照できる！
var mainImg = {
    image : {
        'ika' : 'https://cdn.jsdelivr.net/gh/SohuKou106/osushi/images/ika_pink.png',
        'background' : 'https://cdn.jsdelivr.net/gh/SohuKou106/osushi/images/background.png',
        'lane' : 'https://cdn.jsdelivr.net/gh/SohuKou106/osushi/images/lane_gray.png',
        'steak' : 'https://cdn.jsdelivr.net/gh/SohuKou106/osushi/images/steak.png',
        'pasta' : 'https://cdn.jsdelivr.net/gh/SohuKou106/osushi/images/pasta.png',
        'pizza' : 'https://cdn.jsdelivr.net/gh/SohuKou106/osushi/images/pizza.png',
    },
};

// MainScene クラスを定義
phina.define('GameScene', {
    superClass: 'DisplayScene',

    freezeFlame : 0,    //被弾時の硬直
    movingFrame : 0,    //左右に移動している最中の操作非受付時間
    playerNum : 0,      //自機が何番目のお皿にいるか
    beginFrame : 0,     //ゲーム開始時のフレーム
    playing : false,    //自機が操作可能な状態か（カウントダウン，ゲームオーバーなどでないか）

    init: function() {
        this.superInit(param);

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

        //体力バー
        const hpBar = new HPBar({
            x: WINDOW_WIDTH - 40,
            y: this.gridY.center(-1),
            color : 'lightgreen',
            maxHP : 100,
        }).addChildTo(this);
        this.hpBar = hpBar;

        var boss_image = 'steak'
        switch(param.stageNum){
            case 1: 
                boss_image = 'steak'
                break;
            case 2: 
                boss_image = 'pasta'
                break;
            case 3: 
                boss_image = 'pizza'
                break;

        }
        //敵機
        const e_steak = new Enemy({
            image: boss_image,
            width: 528 * 0.8,
            height: 352 * 0.8,
            x: this.gridX.center(),
            y: this.gridY.center(-5),
        });
        e_steak.addChildTo(this);
        this.e_steak = e_steak;

        //敵の体力バー
        const e_hpBar = new HPBar({
            x: WINDOW_WIDTH - 20,
            y: this.gridY.center(-1),
            color : 'red',
            maxHP : 1000,
        }).addChildTo(this);
        this.e_hpBar = e_hpBar;

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

        //メッセージラベル
        var centerLabel = new Label({
            text: '',
            x : this.gridX.center(),
            y : this.gridY.center(),
            fontSize : 64,
            fill : 'white',
        }).addChildTo(this);
        this.centerLabel = centerLabel
        centerLabel.hide()

        //サブメッセージラベル
        var centerLabel2 = new Label({
            text: 'Press Return Key',
            x : this.gridX.center(),
            y : this.gridY.center(1),
            fontSize : 32,
            fill : 'white',
        }).addChildTo(this);
        this.centerLabel2 = centerLabel2
        centerLabel2.hide()
        
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
            player,
            hpBar,
            centerLabel,
            centerLabel2,
            stage,
            e_stage,

            //グループ
            blockGroup,
            shotGroup,
        } = this;
       
        //**************************************
        //カウントダウン処理
        //**************************************
        if(this.beginFrame <= 0) {
            this.beginFrame = frame;
            this.centerLabel.text = 'Ready...';
            this.centerLabel.show();
        }

        if(!this.playing){
            this.centerLabel.fill = 'rgba(255,' + ((COUNTDOWN - (frame - this.beginFrame))/ COUNTDOWN * 255).toString() + ',' + ((COUNTDOWN - (frame - this.beginFrame))/ COUNTDOWN * 255).toString() +',1)'
            if(frame >= this.beginFrame + COUNTDOWN){
                this.centerLabel.hide();
                this.playing = true;
            }
        }

        //**************************************
        //ゲーム中処理
        //**************************************
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
                this.player.setHP(this.player.getHP() - 50)
                this.hpBar.setHP(this.player.HP);
                this.freezeFlame = 25;
            }

            //画面外に完全に出たら皿を消去
            if(this.blockGroup.children.first.x > WINDOW_WIDTH + 64){
                this.playerNum--;
                this.blockGroup.children.first.remove();
            }
        }
        
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

        //皿の位置によってイベント発生
        if(!this.player.gameOver && this.playing && this.blockGroup.children[this.playerNum].stageID > 0){
            switch(this.blockGroup.children[this.playerNum].stageID){
                case 1:
                    console.log("red!");
                    break;
                case 2:
                    this.player.setHP(this.player.getHP() + 20)
                    this.hpBar.setHP(this.player.HP);
                    break;
                case 3:
                    console.log("blue!");
                    break;
                default:
                    break;
            
            }
            this.blockGroup.children[this.playerNum].fill = 'white'
            this.blockGroup.children[this.playerNum].stroke = 'yellow'
            this.blockGroup.children[this.playerNum].stageID = 0
        }

        //**************************************
        //弾に関する処理
        //**************************************
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

        this.hitTestShotToEnemy();

        //デバッグ用　自滅
        if(keyboard.getKey('7') && !this.player.gameOver && this.playing){
            this.player.setHP(0)
            this.hpBar.setHP(this.player.HP);
        }

        //**************************************
        //ゲームクリア処理
        //**************************************
        if(this.e_steak.HP <= 0 && !this.e_steak.endFlag){
            this.e_steak.gameOverMove();
        }

        if(this.e_steak.endFlag){
            this.e_steak.remove()
            this.centerLabel.text = 'GAME CLEAR!!!'
            this.centerLabel.fill = 'white'
            this.centerLabel.show();
            this.centerLabel2.show();
            if(keyboard.getKeyUp('return')){
                this.exit();
            }
        }
        
        //**************************************
        //ゲームオーヴァー処理
        //**************************************
        if(this.player.HP <= 0 && !this.player.endFlag){
            this.player.gameOverMove();
        }

        if(this.player.endFlag){
            this.centerLabel.text = 'GAME OVER'
            this.centerLabel.fill = 'white'
            this.centerLabel.show();
            this.centerLabel2.show();
            if(keyboard.getKeyUp('return')){
                this.exit();
            }
        }
    },

    //動ける状態か（各フラグやフレームをチェックする）
    canMove(){
        if(this.freezeFlame < 0 && !this.player.gameOver && this.playing){

        }
    },

    hitTestShotToEnemy(){
        var self = this;
        self.shotGroup.children.each(function(shot){
            var r1 = shot.collider.getAbsoluteRect();
            var r2 = self.e_steak.collider.getAbsoluteRect();

            if(Collision.testRectRect(r1, r2)){
                self.e_steak.setHP(self.e_steak.getHP() - 200);
                self.e_hpBar.setHP(self.e_steak.getHP());
                shot.remove();
            }
        });
    }
});
