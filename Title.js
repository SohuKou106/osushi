phina.define('TitleScene', {
    superClass: 'DisplayScene',

    init(){
        this.superInit();

        this.backgroundColor = '#444';
        // ラベルを生成
        this.label = Label('SUSHI-CHAN').addChildTo(this);
        this.label.x = this.gridX.center(); // x 座標
        this.label.y = this.gridY.center(); // y 座標
        this.label.fontSize = 64;
        this.label.fill = 'white'; // 塗りつぶし色

        this.label2 = Label('Press Return Key').addChildTo(this);
        this.label2.x = this.gridX.center(); // x 座標
        this.label2.y = this.gridY.center(2); // y 座標
        this.label2.fontSize = 32;
        this.label2.fill = 'white'; // 塗りつぶし色
    },
    
    update({keyboard, frame,}){
        if(keyboard.getKeyUp('return')){
            this.exit();
        }
    },
})