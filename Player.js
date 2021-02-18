/*var mainImg = {
    image : {
        'ika' : 'https://cdn.jsdelivr.net/gh/SohuKou106/osushi/images/ika.png'
    },
};*/

phina.define('Player', {

    //superClass: 'Sprite',
    superClass: 'RectangleShape',

    init(options){//options){
        const defaults = {
            image: "",
            width: 40,
            height: 40,
        },

        //optionsの引数をdefaultsに割り当てる？
        const opt = Object.assign(defaults, options)
        this.superInit(opt);
        //this.superInit('ika');
        this.fill = "rgba(255, 255, 255, 1)";
        this.stroke = "rgba(255, 255, 255, 1)";
        this.strokeWidth = 10;
    },

    moveLeft(){
        console.log("left!")
    }
});