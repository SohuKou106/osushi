phina.define('StageSelect', {
    superClass: 'DisplayScene',

    selectNum: 1,
    bossNum: 3,

    init(){
        this.superInit();

        this.backgroundColor = '#444';
        // ラベルを生成
        this.label = Label('Stage Select').addChildTo(this);
        this.label.x = this.gridX.center(); // x 座標
        this.label.y = this.gridY.center(-7); // y 座標
        this.label.fontSize = 64;
        this.label.fill = 'white'; // 塗りつぶし色

        this.label_boss1 = Label('Steak').addChildTo(this);
        this.label_boss1.x = this.gridX.center(); // x 座標
        this.label_boss1.y = this.gridY.center(-4); // y 座標
        this.label_boss1.fontSize = 32;
        this.label_boss1.fill = 'white'; // 塗りつぶし色

        this.label_boss2 = Label('Pasta').addChildTo(this);
        this.label_boss2.x = this.gridX.center(); // x 座標
        this.label_boss2.y = this.gridY.center(-1); // y 座標
        this.label_boss2.fontSize = 32;
        this.label_boss2.fill = 'white'; // 塗りつぶし色

        this.label_boss3 = Label('Pizza').addChildTo(this);
        this.label_boss3.x = this.gridX.center(); // x 座標
        this.label_boss3.y = this.gridY.center(2); // y 座標
        this.label_boss3.fontSize = 32;
        this.label_boss3.fill = 'white'; // 塗りつぶし色

        this.cursor = Label('▲').addChildTo(this);
        this.cursor.rotation = 90;
        this.cursor.x = this.gridX.center(-5);
        this.cursor.y = this.gridY.center(-4);
        this.cursor.fontSize = 32;
        this.cursor.fill = 'white';
    },
    
    update({keyboard, frame}){
        if(keyboard.getKeyUp('up') && this.selectNum > 1){
            this.selectNum--;
            this.cursor.y = this.gridY.center(-7 + 3 * this.selectNum)
            console.log(this.selectNum)
        }
        if(keyboard.getKeyUp('down') && this.selectNum < this.bossNum){
            this.selectNum++;
            this.cursor.y = this.gridY.center(-7 + 3 * this.selectNum)
            console.log(this.selectNum)
        }
        if(keyboard.getKeyUp('return')){
            this.exit({
                stageNum: this.selectNum,
            });
        }
    },
})