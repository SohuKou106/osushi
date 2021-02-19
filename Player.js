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
        };

        //this.superInit(opt);
        this.superInit('ika');
        //optionsの引数をdefaultsに割り当てる？
        //const opt = Object.assign(defaults, options)
        //this.superInit(opt);
    },

    moveLeft(){
        console.log("left!")
    }
});