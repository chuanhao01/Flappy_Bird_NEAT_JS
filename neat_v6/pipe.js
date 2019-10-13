function Pipe(gap_size, w, speed){
    this.gap_size = gap_size;
    this.w = w
    this.speed = speed;
    this.top = null;
    this.bottom = null;
    this.x = width;
    this.highlight = false;
    this.createPipe = () => {
        remaining_length = height - this.gap_size;
        this.top = random(remaining_length);
        this.bottom = this.top + this.gap_size; 
    };
    this.drawPipe = () => {
        fill(255);
        if(this.highlight){
            fill(255, 0, 0);
        }
        // Top rect
        rect(this.x, 0, this.w, this.top);
        // Bottom
        rect(this.x, this.bottom, this.w, height - this.bottom);
    };
    this.updatePipe = () => {
        this.x -= this.speed;
    };
    this.pipeOffScreen = () => {
        return (this.x < -this.w);
    };
    this.checkCollision = (bird) => {
        // Generating a list of the two points
        // console.log('Inside the bird', bird.x, bird.y)
        let bird_x = bird.x,
        bird_y = bird.y,
        bird_rad = bird.rad;
        let collide_points = []
        for(let i = -1; i<2; i += 2){
            let check_point = {};
            check_point.x = bird_x + (i * bird_rad/2);
            check_point.y = bird_y;
            collide_points.push(check_point);
        }
        for(let i = -1; i<2; i += 2){
            let check_point = {};
            check_point.y = bird_y + (i * bird_rad/2);
            check_point.x = bird_x;
            collide_points.push(check_point);
        }
        for(let i=0; i<collide_points.length; i++){
            let check_point = collide_points[i]
            if((check_point.x > this.x && check_point.y < this.top) || (check_point.x > this.x && check_point.y > this.bottom)){
                this.highlight = true;
                return false;
            }
        }
        this.highlight = false;
        return true;
    };
}