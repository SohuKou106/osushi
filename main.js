//テスト動作開始
//browser-sync start --server --files *

var rectWidth = 100;
var rectHeight = 60;
var moveState = 0;  //0:left 1:up 2:right 3:down
var SPEED = 4;
var WINDOW_WIDTH = 640;
var WINDOW_HEIGHT = 960;
var BLOCK_WIDTH = 40 * 2;
var BLOCK_HEIGHT = 60 / 2;

//githubで公開したレポジトリは自動的にjsdelivrで配布?される
//ので，ユーザー名とレポジトリ名を適切に指定すれば画像が参照できる！
var mainImg = {
    image : {
        'background' : 'https://cdn.jsdelivr.net/gh/SohuKou106/osushi/images/background.png'
    },
};

// MainScene クラスを定義
phina.define('MainScene', {
    superClass: 'DisplayScene',

    init: function() {
        this.superInit();
        // 背景を設定
        new Sprite('background').addChildTo(this);
        this.backgroundColor = '#444';
        // ラベルを生成
        this.label = Label('SUSHI-CHAN').addChildTo(this);
        this.label.x = this.gridX.center(-4); // x 座標
        this.label.y = 20; // y 座標
        this.label.fill = 'white'; // 塗りつぶし色

        // ブロックグループ
        this.blockGroup = DisplayElement().addChildTo(this);
        // 弾グループ
        this.shotGroup = DisplayElement().addChildTo(this);
        var self = this;

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
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //ここで宣言してるstageと次のif文中のstageが同じだけど大丈夫？
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        var {
            stage,
            e_stage,
            player,
            playerNum,

            //グループ
            blockGroup,
            shotGroup,
        } = this;

        this.blockGroup = blockGroup;
        this.shotGroup = shotGroup;
       
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
            if(this.playerNum == 0){
                this.playerNum = this.blockGroup.children.length - 1;
                player.move(this.blockGroup.children.last.x, this.blockGroup.children.last.y)
            }
            //画面外に完全に出たら皿を消去
            if(this.blockGroup.children.first.x > WINDOW_WIDTH + 64){
                this.playerNum--;
                this.blockGroup.children.first.remove();
            }
        }

        /*if(e_stage.next()){
            var e_stage = new EnemyStage({
                width: 64,
                height: 64,
                velocityX: SPEED,
                velocityY: 0,
                x: 0 - 8 * 8,
                y: 100,
                boundaryRight: 600,
                boundaryBottom: 280,
            }).addChildTo(this.blockGroup);
            this.e_stage = e_stage
        }*/

        player.move(this.blockGroup.children[this.playerNum].x, this.blockGroup.children[this.playerNum].y)

        console.log("Num: " + this.playerNum + "  len: " + this.blockGroup.children.length)
        //次の皿へ
        if(keyboard.getKeyDown('left')){
            if(player.y <= 800){
                if(this.playerNum + 1 < this.blockGroup.children.length) this.playerNum += 1;
            }
            else{
                if(this.playerNum > 0) this.playerNum -= 1;
            }
            player.move(this.blockGroup.children[this.playerNum].x, this.blockGroup.children[this.playerNum].y)
        }

        //前の皿へ
        if(keyboard.getKeyDown('right')){
            if(player.y <= 800){
                if(this.playerNum > 0) this.playerNum -= 1;
            }
            else {
                if(this.playerNum + 1 < this.blockGroup.children.length) this.playerNum += 1;
            }
            player.move(this.blockGroup.children[playerNum].x, this.blockGroup.children[playerNum].y)
        }

        //弾を発射
        if(keyboard.getKey('space')){

        }
    }
});

// メイン処理
phina.main(function() {
  // アプリケーション生成
  var app = GameApp({
    // メインシーンから開始する
    startLabel: 'main',
    //アセット
    assets: mainImg,
    //シーン管理
    //scenes:
  });
  // アプリケーション実行
  app.run();
});
