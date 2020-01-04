function Game(){
    this.init = function(){
        // For the pipe
        this.gap_size = 180;
        this.w = 50;
        this.speed = 3.2;
        this.pipes = [];
        this.game_done = false;
        this.time = 0;
        this.birds = [];
        let pipe = new Pipe(this.gap_size, this.w, this.speed);
        pipe.createPipe();
        this.pipes.push(pipe);
        this.score_show = 0;
    };
    this.setUpBirds = function(birds){
        this.birds = birds;
    };
    this.resetGame = function(){
        this.pipes = [];
        this.birds = [];
        this.game_done = false;
        this.time = 0;
        this.score_show = 0;
        let pipe = new Pipe(this.gap_size, this.w, this.speed);
        pipe.createPipe();
        this.pipes.push(pipe);
    };
    this.updateFrame = function(img1, img2, img3, img4, img5){
        if(!this.game_done){
            this.time++;
            if(this.pipes[this.pipes.length - 1].x < width - 400){
                let pipe = new Pipe(this.gap_size, this.w, this.speed);
                pipe.createPipe();
                this.pipes.push(pipe);
            }
            if(this.pipes.length > 0){
                for(let i=this.pipes.length - 1; i>=0; i--){
                    if(this.pipes[i].pipeOffScreen()){
                        this.pipes.splice(i, 1);
                        this.score_show++;
                    }
                    for(let j=0; j<this.birds.length; j++){
                        if(this.birds[j].player.enabled){
                            if(this.pipes[i].checkCollision(this.birds[j]) === false){
                                // console.log('Bird', this.birds[j].x, this.birds[j].y);
                                // console.log('Pipe', this.pipes)
                                this.birds[j].player.setScore(this.time);
                                // this.birds[j].enabled = false;
                            }
                        }
                    }
                    this.pipes[i].updatePipe();
                    this.pipes[i].drawPipe(img4, img5);
                }
            }
            let is_done = true;
            for(let i=0; i<this.birds.length; i++){
                if(this.birds[i].player.enabled){
                    is_done = false;
                    if(this.birds[i].checkCollision()){
                        this.birds[i].think(this.pipes[0].top, this.pipes[0].bottom, this.pipes[0].x);
                        this.birds[i].updateBird();
                        this.birds[i].drawBird(img1, img2, img3);
                    }
                    else{
                        this.birds[i].player.setScore(this.time);
                    }
                }
            }
            this.game_done = is_done;
            return false;
        }
        else{
            return true;
        }
    };
}