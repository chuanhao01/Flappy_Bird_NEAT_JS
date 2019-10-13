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
    // Generating the first gen
    this.init = function(nodes_history_list, connections_history_list, mutation_rate){
        this.brain = new Genome();
        this.brain.init(nodes_history_list, connections_history_list, mutation_rate);
    };
    this.think = function(bottom_pipe, top_pipe, pipe_x){
        // console.log('bottom_pipe', bottom_pipe)
        if(this.enabled){
            this.brain.feedForward([this.x, this.y, this.vel, bottom_pipe, top_pipe, pipe_x, 1]);
            // console.log(this.brain.getOutput()[0]);
            if(this.brain.getOutput()[0] > 0.5){
                this.birdJump();
            }
        }

    };
    this.crossover = function(bird_a){
        let child_brain = this.brain.crossover(bird_a.brain);
        // Making child bird
        // See genome for notes
        let child = new Bird(this.gravity, this.lift, this.air_res);
        child.brain = child_brain;
        return child;
    };
    this.mutateAddNode = function(global_connection_history_list, global_node_history_list, global_add_node_mutation_list){
        this.brain.mutateAddNode(global_connection_history_list, global_node_history_list, global_add_node_mutation_list);
    };
    this.updateBrainNodesHistoryList = function(nodes_history_list){
        this.brain.updateNodesHistoryList(nodes_history_list);
    }
    this.mutateAddConnection = function(global_connection_history_list, global_node_history_list){
        this.brain.mutateAddConnection(global_connection_history_list, global_node_history_list);
    };
    this.mutateWeights = function(){
        this.brain.mutateWeights();
    };
    this.mutateEnableConnection = function(){
        this.brain.mutateEnableConnection();
    };
    this.setup = function(){
        this.brain.setup();
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