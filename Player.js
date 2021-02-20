var mainImg = {
    image : {
        'ika' : 'https://cdn.jsdelivr.net/gh/SohuKou106/osushi/images/ika_pink.png'
    },
};

phina.define('Player', {

    superClass: 'Sprite',

    init(options){//options){
        const defaults = {
            image: "",
            width: 40,
            height: 40,
            x: 480, 
            y: 280,
        };

        //this.superInit(opt);
        const opt = Object.assign(defaults, options)
        this.superInit('ika');
        this.x = opt.x;
        this.y = opt.y;
        //optionsの引数をdefaultsに割り当てる？
        
        //this.superInit(opt);
    },

    move(x, y){
        this.x = x;
        this.y = y;
        //console.log("left!")
    },
});