phina.define('HPBar', {
    superClass: 'RectangleShape',

    init(options){
        const defaults = {
            width : 30,
            height: 300,
            HP: 100,
        }

        const opt = Object.assign(defaults, options)
        this.superInit(opt)

        this.fill = 'green';

        this.HP = opt.HP;
    },

    update(){
        this.height = 300 * this.HP / 100;
        this.y = WINDOW_HEIGHT / 2 + 300 * (1 - this.HP / 100) / 2;
    },

    setHP(value){
        this.HP = value;
    }
})