var rectWidth = 100;
var rectHeight = 60;
var moveState = 0;  //0:left 1:up 2:right 3:down
var SPEED = 4;
var WINDOW_WIDTH = 640;
var WINDOW_HEIGHT = 960;
var BLOCK_WIDTH = 40 * 2;
var BLOCK_HEIGHT = 60 / 2;

var mainImg = {
    image : {
        'ika' : 'file:///Users/hirano/Desktop/phina/images/ika.png'
    },
};

// MainScene クラスを定義
phina.define('MainScene', {
    superClass: 'DisplayScene',

    init: function() {
        this.superInit();
        // 背景色を指定
        this.backgroundColor = '#444';
        // ラベルを生成
        this.label = Label('SUSHI-CHAN').addChildTo(this);
        this.label.x = this.gridX.center(-4); // x 座標
        this.label.y = 20; // y 座標
        this.label.fill = 'white'; // 塗りつぶし色

        // ブロックグループ
        this.blockGroup = DisplayElement().addChildTo(this);
        var self = this;

        //ブロック配列
        var stages = [];
        this.stages = stages;
        var e_stages = [];
        this.e_stages = e_stages;

        var stage = new Stage({
            width: 64,
            height: 64,
            velocityX: SPEED * -1,
            velocityY: 0,
            x: 640 + 8 * 8,
            y: 860,
            boundaryLeft: 40,
            boundaryTop: 680,
        }).addChildTo(self.blockGroup);
        this.stage = stage
        this.stages.push(this.stage)
        
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
        this.e_stage = e_stage
        e_stages.push(this.e_stage)*/
    },

    update({keyboard, frame,}) 
    {
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //ここで宣言してるstageと次のif文中のstageが同じだけど大丈夫？
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        var {
            stage,
            e_stage,
            stages,
            e_stages,
            blockGroup,
        } = this;

        this.blockGroup = blockGroup;

        if(stage.next()){
            var stage = new Stage({
                width: 64,
                height: 64,
                velocityX: SPEED * -1,
                velocityY: 0,
                x: 640 + 8 * 8,
                y: 860,
                boundaryLeft: 40,
                boundaryTop: 680,
            }).addChildTo(this.blockGroup);
            this.stage = stage
            this.stages.push(this.stage)
        }

        if(this.blockGroup.children.length >= 16){
            this.blockGroup.children.first.remove();
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
            this.e_stages.push(this.e_stage)
        }*/
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
