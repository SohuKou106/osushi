phina.define('Enemy',{
    superClass: 'Sprite',
    
    endFlag : false,

    init(options){
        const defaults = {
            image: "",
            width: 0,
            height: 0,
            x: 0, 
            y: 0,
            HP: 1000,
        };

        const opt = Object.assign(defaults, options)
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

    setHP(value){
        if(value <= 0) this.HP = 0;
        else if (value >= 1000) this.HP = 100;
        else this.HP = value;
    },

    getHP(){
        return this.HP;
    },
    
    gameOverMove(){
        this.endFlag = true;
    }

})