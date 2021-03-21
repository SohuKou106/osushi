phina.define('Collider', {
    superClass: 'RectangleShape',

    init(options){
        const defaults = {
            width: 0,
            height: 0,
        }

        const opt = Object.assign(defaults, options);
        this.superInit(opt);

        this.fill = null;
        this.stroke = 'transparent';
    },

    //絶対座標の矩形
    getAbsoluteRect(){
        var x = this.left + this.parent.x;
        var y = this.top + this.parent.y;
        return Rect(x, y, this.width, this.height);
    }
})