function Bird(gravity, lift, air_res){
    this.gravity = gravity;
    this.lift = lift;
    this.air_res = air_res;
    this.x = 50;
    this.y = height/2;
    this.rad = 50;
    this.vel = 0;

    this.player = null;

    this.init = function(player){
        this.player = player;
    };

    this.think = function(bottom_pipe, top_pipe, pipe_x){
        // let x = sigmoidActivation(this.x),
        // y = sigmoidActivation(this.y),
        // vel = sigmoidActivation(this.vel),
        // new_bottom = sigmoidActivation(bottom_pipe),
        // new_top = sigmoidActivation(top_pipe),
        // new_pipe_x = sigmoidActivation(pipe_x);

        let x = this.x / 100,
        y = this.y / 100,
        vel = this.vel / 100,
        new_bottom = bottom_pipe/ 100,
        new_top = top_pipe / 100,
        new_pipe_x = pipe_x / 100;
        let output = this.player.play([x, y, vel, new_bottom, new_top, new_pipe_x, 1]);
        if(output > 0.5){
            this.birdJump();
        }
    };

    this.drawBird = function(){
        fill(255);
        ellipse(this.x, this.y, this.rad);
    };
    this.updateBird = function(){
        this.vel += this.gravity;
        this.vel *= this.air_res;
        this.y += this.vel;
    };
    this.checkCollision = function(){
        if(0 < this.y && this.y < height){
            return true;
        }
        else{
            return false;
        } 
    };
    this.birdJump = function(){
        this.vel += this.lift;
    };
}