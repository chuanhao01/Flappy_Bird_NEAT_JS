function Bird(gravity, lift, air_res){
    this.gravity = gravity;
    this.lift = lift;
    this.air_res = air_res;
    this.x = 50;
    this.y = height/2;
    this.rad = 50;
    this.vel = 0;
    this.game_score = 0;
    this.adjusted_score = 0;
    this.enabled = true;
    this.generateBrain = function(first_gen, brain){
        if(first_gen){
            this.brain = new Genome();
            this.brain.init(brain.mutation_rate, brain.nodes_list, brain.connections_list);
        }
        else{
            this.brain = brain;
        }
    };
    this.mutateFirstAddNode = function(){
        return this.brain.mutateFirstAddNode(); 
    };
    this.mutateSecondAddNode = function(final_add_connections, final_add_nodes){
        this.brain.mutateSecondAddNode(final_add_connections, final_add_nodes);
    };
    this.mutateFirstAddConnection = function(){
        return this.brain.mutateFirstAddConnection();
    };
    this.mutateSecondAddConnection = function(final_add_connections){
        this.brain.mutateSecondAddConnection(final_add_connections);
    };
    this.mutateRest = function(){
        this.brain.mutateRest();
    };
    this.crossover = function(brid_b){
        let child_brain = null;
        if(this.adjusted_score > brid_b.adjusted_score){
            child_brain = this.brain.crossover(brid_b.brain);
        }
        else{
            child_brain = brid_b.brain.crossover(this.brain);
        }
        let child_bird = new Bird(this.gravity, this.lift, this.air_res);
        child_bird.generateBrain(false, child_brain);
        return child_bird;
    };
    this.setAdjustedScore = function(adjusted_score){
        this.adjusted_score = adjusted_score; 
    };
    this.think = function(top_pipe, bottom_pipe, ){
        if(this.enabled){
            // console.log(top_pipe, bottom_pipe)
            this.brain.feedForward([this.y, this.vel, top_pipe, bottom_pipe]);
            // console.log(0 <= this.brain.getOutput() && this.brain.getOutput() <= 1);
            if(this.brain.getOutput() > 0.9){
                this.birdJump();
            }
            this.brain.clearNodes();
        }
    }
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
        let pipe = new Pipe(this.gap_size, this.w, this.speed);
        pipe.createPipe();
        this.pipes.push(pipe);
    },
    setUpBirds(population){
        this.birds = population;
    },
    resetGame(){
        this.pipes = [];
        this.birds = [];
        this.game_done = false;
        this.time = 0;
        let pipe = new Pipe(this.gap_size, this.w, this.speed);
        pipe.createPipe();
        this.pipes.push(pipe);
    },
    updateFrame(){
        if(!this.game_done){
            this.time++;
            // if(frameCount % 75 === 0){
            //     // console.log('It\'s a me, Mario');
            //     let pipe = new Pipe(this.gap_size, this.w, this.speed);
            //     pipe.createPipe();
            //     this.pipes.push(pipe);
            // }
            if(this.pipes[this.pipes.length - 1].x < width - 200){
                let pipe = new Pipe(this.gap_size, this.w, this.speed);
                pipe.createPipe();
                this.pipes.push(pipe);
            }
            if(this.pipes.length > 0){
                for(let i=this.pipes.length - 1; i>=0; i--){
                    if(this.pipes[i].pipeOffScreen()){
                        this.pipes.splice(i, 1);
                    }
                    for(let j=0; j<this.birds.length; j++){
                        if(this.birds[j].enabled){
                            if(this.pipes[i].checkCollision(this.birds[j]) === false){
                                this.birds[j].game_score = this.time;
                                this.birds[j].enabled = false;
                            }
                        }
                    }
                    this.pipes[i].updatePipe();
                    this.pipes[i].drawPipe();
                }
            }
            let is_done = true;
            for(let i=0; i<this.birds.length; i++){
                if(this.birds[i].enabled){
                    is_done = false;
                    if(this.birds[i].checkCollision()){
                        this.birds[i].think(this.pipes[0].top, this.pipes[0].bottom);
                        this.birds[i].updateBird();
                        this.birds[i].drawBird();
                    }
                    else{
                        this.birds[i].game_score = this.time;
                        this.birds[i].enabled = false;
                    }
                }
            }
            this.game_done = is_done;
            return false;
        }
        else{
            return true;
        }
    }
    // updateFrame(){
    //     if(!this.game_done){
    //         this.time++;
    //         if(frameCount % 20 === 0){
    //             console.log('what')
    //             let pipe = new Pipe(this.gap_size, this.w, this.speed);
    //             pipe.createPipe();
    //             this.pipes.push(pipe);
    //         }
    //         for(let i=0; i<this.birds.length; i++){
    //             this.birds[i].think();
    //             // console.log(this.birds[i].brain);
    //             if(this.birds[i].enabled){
    //                 if(this.birds[i].checkCollision()){
    //                     this.birds[i].updateBird();
    //                 }
    //                 else{
    //                     this.birds[i].game_score = this.time;
    //                     this.birds[i].enabled = false;
    //                 }
    //             }
    //         }
    //         for(let i = this.pipes.length - 1; i >= 0; i--){
    //             if(this.pipes[i].pipeOffScreen()){
    //                 this.pipes.splice(i, 1);
    //             }
    //             else{
    //                 for(let j=this.birds.length - 1; j>=0; j--){
    //                     if(this.birds[j].enabled){
    //                         if(this.pipes[i].checkCollision(this.birds[j]) === false){
    //                             this.birds[j].game_score = this.time;
    //                             this.birds[j].enabled = false;
    //                         }
    //                     }
    //                 }
    //             }
    //             this.pipes[i].drawPipe();
    //         }
    //         let game_done = true;
    //         for(let bird of this.birds){
    //             if(bird.enabled){
    //                 bird.drawBird();
    //                 game_done = false;
    //             }
    //         }
    //         console.log(game_done);
    //         this.game_done = game_done;
    //     }
    // }
}

