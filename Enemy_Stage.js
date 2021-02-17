var WINDOW_WIDTH = 640;
var WINDOW_HEIGHT = 960;
var SPEED_X = 4;
var SPEED_Y = 4;

phina.define('EnemyStage', {

    superClass: 'RectangleShape',

    init: function(options){
        const defaults = {
            width: 64,
            height: 64,

            velocityX: 0,
            velocityY: 0,
            moveState: 0,

            boundaryRight: 600,
            boundaryBottom: 280,
        };

        const opt = Object.assign(defaults, options)
        this.superInit(opt);

        //物理的な速度を与える
        this.physical.velocity.x = opt.velocityX;
        this.physical.velocity.y = opt.velocityY;
    
        //挙動の設定
        this.boundaryRight = opt.boundaryRight;
        this.boundaryBottom = opt.boundaryBottom;
        this.moveState = opt.moveState;

        //形状の設定
        var r = Math.floor(Math.random() * 255)
        var g = Math.floor(Math.random() * 255)
        var b = Math.floor(Math.random() * 255)
        this.fill = 'rgba(' + r.toString() + ',' + g.toString() + ',' + b.toString() + ', 1)';
        this.stroke = "rgba(255, 255, 255, 1)";
        this.strokeWidth = 10;
    },

    update(){
        if(this.moveState == 0) {
            if(this.boundaryRight - this.right <= 45){
                this.rotation = 90 - (this.boundaryRight - this.right) * 2
                this.physical.velocity.y = 2;
                if(this.right >= this.boundaryRight){
                    this.rotation = 90;
                    this.physical.velocity.x = 0;
                    this.physical.velocity.y = SPEED_Y;
                    this.moveState++;
                }
            }
        }
        else if(this.moveState == 1){
            if(this.boundaryBottom - this.bottom <= 45){
                this.rotation = 180 - (this.boundaryBottom - this.bottom) * 2
                this.physical.velocity.x = -2;
                if(this.bottom > this.boundaryBottom){
                    this.rotation = 180;
                    this.physical.velocity.x = SPEED_X * -1;
                    this.physical.velocity.y = 0;
                    this.moveState++;
                }
            }
        }
    },

    next(){
        if(this.left >= 0){
            return true;
        }
        else{
            return false;
        }
    }
});