phina.define('Shot', {
    superClass: 'CircleShape',

    init(options){
        const defaults = {
            radius: 5,
            
            velocityX: 0,
            velocityY: 0,
        };

        const opt = Object.assign(defaults, options);
        this.superInit(opt)

        this.fill = 'white';
        this.stroke = 'black';
        this.strokeWidth = 2;

        this.physical.velocity.y = opt.velocityY;

        this.collider = Collider({
            width: this.radius - 1,
            height: this.radius - 1,
        }).addChildTo(this)
    },
})