phina.define('Enemy',{
    superClass: 'Sprite',
    
    init(options){
        const defaults = {
            image: "",
            width: 40,
            height: 40,
            x: 480, 
            y: 280,
            HP: 1000,
        };

        const opt = Object.assign(defaults, options)
        this.superInit(opt.image);

    }
})