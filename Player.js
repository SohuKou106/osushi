const boundaryLeft = 40;
const speedX = 4;

phina.define('Player', {

    superClass: 'Sprite',
    dX: 0,
    dY: 0,
    vY: 0,
    gameOver : false,   //ゲームオーバーのフラグ
    endFlag : false,    //ゲームオーバー後の動きも終わってキー入力待ちのフラグ

    init(options){//options){
        const defaults = {
            image: "",
            width: 40,
            height: 40,
            x: 480, 
            y: 280,
            HP: 100,
            movingFrame : 10,
            startFrame: 0,
        };

        const opt = Object.assign(defaults, options);    //optionsの引数をdefaultsに割り当てる？
        this.superInit(opt.image);
        this.x = opt.x;
        this.y = opt.y;
        this.width = opt.width;
        this.height = opt.height;
        this.HP = opt.HP;

        this.collider = Collider({
            width: this.width - 10, 
            height: this.height - 10,
        }).addChildTo(this);
    },

    update(){
        //通常時　皿から皿への移動中
        if(this.movingFrame > 0 && !this.gameOver){
            this.movingFrame--;
            this.x += this.dX;
            this.y += this.dY;
        }

        //ゲームオーバー時は自由落下
        else if(this.gameOver){
            this.y += this.dY + this.vY;
            //一定の高さに到達したら落下を止めてGAME OVERにする
            if(this.y >= 2500) {
                this.vY = 0;
                this.dY = 0;
                this.endFlag = true;
            }
            //加速度2
            else this.vY += 2;
        }

    },

    //**************************************
    //自機の移動処理
    //**************************************
    move(x, y){
        this.x = x;
        this.y = y;
    },

    moveDish(beforeX, beforeY, afterX, afterY, speedX, speedY, movingFrame){
        this.dX = (afterX - beforeX) / movingFrame + speedX;
        this.dY = (afterY - beforeY) / movingFrame + speedY;
        this.movingFrame = movingFrame
    },

    //**************************************
    //HP関連の処理
    //**************************************
    setHP(value){
        if(value <= 0) this.HP = 0;
        else if (value >= 100) this.HP = 100;
        else this.HP = value;
    },

    getHP(){
        return this.HP;
    },

    gameOverMove(){
        this.gameOver = true;
        this.dX = 0;
        this.dY = -20;
    }
});