function Bird(gravity, lift, air_res){
    this.gravity = gravity;
    this.lift = lift;
    this.air_res = air_res;
    this.x = 50;
    this.y = height/2;
    this.rad = 50;
    this.vel = 0;
    this.game_score = 0;
    this.enabled = true;
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
    }
}

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
        return (this.x < - this.width);
    };
    this.checkCollision = (bird) => {
        // Generating a list of the two points
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

const Game = {
    init(){
        // For the bird
        this.gravity = 0.6;
        this.lift = -20;
        this.air_res = 0.9;
        // For the pipe
        this.gap_size = 200;
        this.w = 40;
        this.speed = 3.7;
        this.pipes = [];
        this.game_done = false;
        this.time = 0;
        this.birds = [];
    },
    generateBirdsMapping(population){
        let birds = [];
        for(let genome of population){
            birds.push(new Bird(this.gravity, this.lift, this.air_res));
        }
        this.birds = birds;
    },
    setUpGame(population){
        this.generateBirdsMapping(population);
    },
    updateFrame(){
        if(!this.game_done){
            this.time++;
            if(frameCount % 45 === 0){
                let pipe = new Pipe(this.gap_size, this.w, this.speed);
                pipe.createPipe();
                this.pipes.push(pipe);
            }
            for(let i = this.pipes.length - 1; i >= 0; i--){
                if(this.pipes[i].pipeOffScreen()){
                    this.pipes.splice(i, 1);
                }
                else{
                    for(let j=this.birds.length - 1; j>=0; j--){
                        if(this.birds[j].enabled){
                            if(this.pipes[i].checkCollision(this.birds[j]) === false){
                                this.birds[j].game_score = this.time;
                                this.birds[j].enabled = false;
                            }
                            if(this.birds[j].checkCollision()){
                                this.birds[j].updateBird();
                            }
                            else{
                                this.birds[j].game_score = this.time;
                                this.birds[j].enabled = false;
                            }
                        }
                    }
                }
                this.pipes[i].drawPipe();
            }
            let game_done = true;
            for(let bird of this.birds){
                if(bird.enabled){
                    bird.drawBird();
                    game_done = false;
                }
            }
            this.game_done = game_done;
        }
    }
}

