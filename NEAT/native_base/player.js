function Player(){
    // Set player vars here
    // Original fitness is score given by the game, adjusted_fitness is score specific fitness sharing
    this.original_fitness = 0;
    this.adjusted_fitness = 0;
    // this var is to keep track if the player is still alive
    this.enabled = true;
    // Method call to generate the brain for the first generation
    // Usually called by from the population class
    this.init = function(nodes_history_list, connections_history_list, mutation_rates, weight_shift_coeff){
        this.brain = new Genome();
        this.brain.init(nodes_history_list, connections_history_list, mutation_rates, weight_shift_coeff);
    };
    /*------------------------------------------------------------------------------------*/
    // Function called to get the player to 'play'
    // In essence, this feeds in the input into the brain and gets an output which is returned
    this.play = function(inputs){
        if(this.enabled){
            // If the player can still play, send the output when called
            const outputs = this.brain.think(inputs);
            return outputs;
        }
    };
    this.breed = function(player){
        // Creating the child brain
        let child_brain = this.brain.crossover(player.brain);
        let child = new Player();
        child.brain = child_brain;
        return child;
    };
    this.firstMutation = function(global_connection_history_list, global_node_history_list, global_add_node_mutation_list){
        this.brain.mutateAddNode(global_connection_history_list, global_node_history_list, global_add_node_mutation_list);
    };
    this.secondMutation = function(global_connection_history_list, global_node_history_list, nodes_history_list){
        this.brain.updateNodesHistoryList(nodes_history_list);
        this.brain.mutateAddConnection(global_connection_history_list);
        this.brain.mutateWeights();
        this.brain.mutateEnableConnection();
        this.brain.setup();
    };
    // Utility function
    this.setScore = function(score){
        this.original_fitness = score;
        this.enabled = false;
    };
    this.clone = function(){
        let player = new Player();
        player.brain = this.brain;
        return player;
    };
    this.savePlayer = function(){
        const player = this.clone();
        let model = {
            'nodes_history_list': player.brain.nodes_history_list,
            'connections_history_list': player.brain.connections_history_list,
            'mutation_rate': player.brain.mutation_rates,
            'weight_shift_coeff': player.brain.weight_shift_coeff
        };
        return JSON.stringify(model);
    };
    this.loadPlayer = function(model){
        this.brain = new Genome();
        this.brain.loadBrain(model);
    };
}