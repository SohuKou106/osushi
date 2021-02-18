var WINDOW_WIDTH = 640;
var WINDOW_HEIGHT = 960;
var SPEED_X = 4;
var SPEED_Y = 4;

phina.define('Stage', {

    superClass: 'RectangleShape',

    init(options){
        const defaults = {
            width: 64,
            height: 64,

            velocityX: 0,
            velocityY: 0,
            moveState: 0,

            boundaryLeft: 40,
            boundaryTop: 680,
        };

        const opt = Object.assign(defaults, options)
        this.superInit(opt);

        //物理的な速度を与える
        this.physical.velocity.x = opt.velocityX;
        this.physical.velocity.y = opt.velocityY;
    
        //挙動の設定
        this.boundaryLeft = opt.boundaryLeft;
        this.boundaryTop = opt.boundaryTop;
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
            if(this.left - this.boundaryLeft <= 45){
                this.rotation = 90 - (this.left - this.boundaryLeft) * 2
                this.physical.velocity.y = -2;
                if(this.left <= this.boundaryLeft){
                    this.rotation = 90;
                    this.physical.velocity.x = 0;
                    this.physical.velocity.y = SPEED_Y * -1;
                    this.moveState++;
                }
            }
        }
        else if(this.moveState == 1){
            if(this.top - this.boundaryTop <= 45){
                this.rotation = 180 - (this.top - this.boundaryTop) * 2
                this.physical.velocity.x = 2;
                if(this.top < this.boundaryTop){
                    this.rotation = 180;
                    this.physical.velocity.x = SPEED_X;
                    this.physical.velocity.y = 0;
                    this.moveState++;
                }
            }
        }
    },

    next(){
        if(this.right <= WINDOW_WIDTH){
            return true;
        }
        else{
            return false;
        }
    }
});