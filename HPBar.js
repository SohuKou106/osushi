phina.define('HPBar', {
    superClass: 'DisplayElement',

    origin_x : 0,
    origin_y : 0,
    bar : null,
    HP : 0,
    maxHP : 0,

    init({x, y, color, maxHP}){
        this.superInit()

        var self = this
        this.origin_x = x;
        this.origin_y = y;
        this.HP = maxHP;
        this.maxHP = maxHP;

        new RectangleShape({
            width: HPBAR_WIDTH,
            height: HPBAR_HEIGHT,
            fill: 'gray',
        }).addChildTo(self).setPosition(this.origin_x, this.origin_y);

        var bar = new RectangleShape({
            width: HPBAR_WIDTH,
            height: HPBAR_HEIGHT,
            fill: color,
        }).addChildTo(self).setPosition(this.origin_x, this.origin_y);
        this.bar = bar

        new RectangleShape({
            width: HPBAR_WIDTH,
            height: HPBAR_HEIGHT,
            fill: 'transparent',
            stroke: 'white',
            strokeWidth: 5,
        }).addChildTo(self).setPosition(this.origin_x, this.origin_y);
    },

    update(){
        this.bar.height = HPBAR_HEIGHT * this.HP / this.maxHP;
        this.bar.y = this.origin_y + HPBAR_HEIGHT * (1 - this.HP / this.maxHP) / 2;
    },

    setHP(value){
        this.HP = value;
    }
})
/*phina.define('HPBar', {
    //superClass: 'RectangleShape',
    superClass: 'DisplayElement',

    bar : null,
    HP : 0,

    init(options){
        const defaults = {
            x: 0,
            y: 0,
            width : HPBAR_WIDTH,
            height: HPBAR_HEIGHT,
            HP: 100,
        }

        const opt = Object.assign(defaults, options)
        this.superInit(opt)

        this.fill = 'transparent'
        this.stroke = 'transparent'

        this.x = opt.x;
        this.y = opt.y;
        this.width = opt.width;
        this.height = opt.height;

        this.HP = opt.HP;

        var self = this;

        new RectangleShape({
            width: HPBAR_WIDTH,
            height: HPBAR_HEIGHT,
            x: this.x,
            y: this.y,
            fill: 'gray',
        }).addChildTo(self);

        var bar = new RectangleShape({
            width: HPBAR_WIDTH,
            height: HPBAR_HEIGHT,
            x: this.x,
            y: this.y,
            fill: 'lightgreen',
        }).addChildTo(self);
        this.bar = bar

        new RectangleShape({
            width: HPBAR_WIDTH,
            height: HPBAR_HEIGHT,
            x: this.x,
            y: this.y,
            fill: 'transparent',
            stroke: 'white',
            strokeWidth: 5,
        }).addChildTo(self);
    },

    update(){
        this.bar.height = HPBAR_HEIGHT * this.HP / 100;
        console.log(this.bar.height)
        this.bar.y = WINDOW_HEIGHT / 2 + HPBAR_HEIGHT * (1 - this.HP / 100) / 2;
    },

    setHP(value){
        this.HP = value;
    }
})*/