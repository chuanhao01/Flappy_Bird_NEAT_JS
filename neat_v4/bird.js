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
    // Method to init the first gen of birds
    this.init = function(nodes_list, connections_list){
        this.brain = new Genome();
        this.brain.init(nodes_list, connections_list);
    };
    this.think = function(){
        this.brain.feedForward([1, 2, 3, 4]);
    };
}