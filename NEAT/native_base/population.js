// This is the main population object that is interfaced with, think of it as the NEAT object
function Population(){
    this.init = function(config){
        // Call this function intialise the population object. Also act as setting up the object
        // Here config is an object. For specs look at neat.md
        // Setting up population configs
        this.total_pop = config.total_pop;
        this.global_innovation_number = 1;
        this.global_node_number = 1;
        this.global_connection_history_list = [];
        this.global_node_history_list = [];
        this.global_add_node_mutation_list = [];
        this.population = [];
        this.all_species_list = [];
        this.species_total_fitness = 0;
        this.mating_pool = [];
        this.crossover_population = [];
        this.population = [];
        this.generation = 1;
        // NEAT configs
        this.mutation_rates = config.mutation_rates;
        this.weight_shift_coeff = config.weight_shift_coeff;
        this.c1 = config.c1;
        this.c2 = config.c2;
        this.compatibility_threshold = config.compatibility_threshold;
        this.prune_percentage = config.prune_percentage;
        // Genome configs
        this.input_nodes = config.input_nodes;
        this.output_nodes = config.output_nodes;
    };
    this.initPopulation = function(){
        // Getting the number of input and output nodes from config file
        let input_nodes = this.input_nodes,
        output_nodes = this.output_nodes;
        // Generating input and output nodes history below
        // Does this once as all of the players in gen 1 have the same number of nodes
        let node_history_list = [];
        let input_nodes_list = [],
        output_nodes_list = [];
        for(let i=0; i<input_nodes; i++){
            let node = new NodeHistory();
            node.init(this.global_node_number, 'input', 0);
            input_nodes_list.push(node);
            node_history_list.push(node);
            this.global_node_number++;
        }
        for(let i=0; i<output_nodes; i++){
            let node = new NodeHistory();
            node.init(this.global_node_number, 'output', -1);
            output_nodes_list.push(node);
            node_history_list.push(node);
            this.global_node_number++;
        }
        // Update global list
        this.global_node_history_list = node_history_list;
        // Generate population here
        let population = [];
        for(let i=0; i<this.total_pop; i++){
            let new_nodes_history_list = this.cloneGlobalNodeHistory(),
            new_connections_history_list = [];
            // For every input node, map it to an output node, until a fully connected layer is formed
            for(let input_node of input_nodes_list){
                for(let output_node of output_nodes_list){
                    // Connection history is generated here
                    let new_connection = this.generateConnection(input_node.node_number, output_node.node_number);
                    new_connections_history_list.push(new_connection);
                }
            }
            // Now create the player, passing in the node_history and connection_history
            let player = new Player();
            player.init(new_nodes_history_list, new_connections_history_list, this.mutation_rates, this.weight_shift_coeff);
            population.push(player);
        }
        // Set current population as the population generated here
        this.population = population;
    };
    this.getNewPopulation = function(){
        this.generateSpecies();
        this.sortSpeciesPlayers();
        this.prunePopulation();
        this.calculateSpecificFitness();
        this.calculateSpeciesFitness();
        this.generateMatingPool();
        this.crossoverPopulation();
        this.mutatePopulation();
    };
    // Main functions
    // Function called to generate a connection_history based on nodes and previously generated connections
    this.generateConnection = function(in_node, out_node){
        // Here in_node and out_node are the node number, not index
        // Generating the first connection if it does not exist
        if(this.global_connection_history_list.length < 1){
            // Generate connection
            let first_connection = new ConnectionHistory();
            let weight = randomNumber(-2, 2);
            first_connection.init(in_node, out_node, weight, this.global_innovation_number);
            // Check if the connection is for inputs
            if(in_node < this.input_nodes){
                first_connection.is_intput_connection = true;
            }
            // Update global connection history
            this.global_connection_history_list.push(first_connection);
            this.global_innovation_number++;
            return first_connection.clone();
        }
        // If there are already other connections
        else{
            // Checking through all connections to see if the connection has been made before
            let is_new = true, old_connection;
            for(let connection of this.global_connection_history_list){
                if(connection.in_node === in_node && connection.out_node === out_node){
                    is_new = false;
                    old_connection = connection.clone();
                    let new_weight = randomNumber(-2, 2);
                    old_connection.weight = new_weight;
                }
            }
            // If the connection is new generate the new one
            if(is_new){
                // Gen
                let new_connection = new ConnectionHistory();
                let weight = randomNumber(-2, 2);
                new_connection.init(in_node, out_node, weight, this.global_innovation_number);
                if(in_node < this.input_nodes){
                    new_connection.is_intput_connection = true;
                }
                // Update
                this.global_connection_history_list.push(new_connection);
                this.global_innovation_number++;
                // console.log(new_connection);
                return new_connection.clone();
            }
            // If the connection has been made before, return it
            else{
                return old_connection;
            }
        }
    };
    // Generate the species based off distance
    this.generateSpecies = function(){
        let all_species_list = [];
        for(let player of this.population){
            if(all_species_list.length < 1){
                let first_species = new Species();
                first_species.init(player);
                all_species_list.push(first_species);
            }
            else{
                let shortest_species = all_species_list[0],
                shortest_distance = this.getDistance(shortest_species.represent, player);
                for(let species of all_species_list){
                    if(this.getDistance(species.represent, player) < shortest_distance){
                        shortest_species = species;
                        shortest_distance = this.getDistance(shortest_species.represent, player);
                    }
                }
                if(shortest_distance > this.compatibility_threshold){
                    let new_species = new Species();
                    new_species.init(player);
                    all_species_list.push(new_species);
                }
                else{
                    shortest_species.addPlayer(player);
                }
            }
        }
        this.all_species_list = all_species_list;
    };
    // Sorts the players in each species by their fitness
    this.sortSpeciesPlayers = function(){
        for(let species of this.all_species_list){
            species.population.sort((player_a, player_b) => {
                return player_a.original_fitness - player_b.original_fitness;
            });
        }
    };
    // Prunes the last n% of players
    this.prunePopulation = function(){
        for(let i=0; i<this.all_species_list.length; i++){
            let species = this.all_species_list[i];
            let prune_number = Math.floor(species.population.length * this.prune_percentage);
            if(prune_number < species.population.length){
                species.population.splice(0, prune_number);
            }
        }
    };
    // Calculates the specific fitness for each player in each species
    this.calculateSpecificFitness = function(){
        for(let species of this.all_species_list){
            let species_total_pop = species.population.length;
            for(let player of species.population){
                player.adjusted_fitness = player.original_fitness / species_total_pop;
            }
        }
    };
    // Calculates the fitness for each species
    this.calculateSpeciesFitness = function(){
        let species_total_fitness = 0;
        for(let species of this.all_species_list){
            species.calculateSpeciesFitness();
            species_total_fitness += species.species_fitness;
        }
        this.species_total_fitness = species_total_fitness;
    };
    this.generateMatingPool= function(){
        let mating_pool = [];
        let highest_score = 0;
        for(let species of this.all_species_list){
            if(species.population[species.population.length - 1].adjusted_fitness > highest_score){
                highest_score = species.population[species.population.length - 1].adjusted_fitness;
            }
        }
        for(let species of this.all_species_list){
            for(let player of species.population){
                let mating_score = Math.floor(map(player.adjusted_fitness, 0, highest_score, 0, 100));
                for(let i=0; i<mating_score; i++){
                    mating_pool.push(player);
                }
            }
        }
        this.mating_pool = mating_pool;
    };
    this.crossoverPopulation = function(){
        let crossover_population = [];
        for(let i=0; i<this.total_pop; i++){
            let selected_players = this.selectFromSameSpecies();
            let player_a = selected_players[0],
            player_b = selected_players[1];
            let child_player;
            if(player_a.adjusted_fitness > player_b.adjusted_fitness){
                child_player = player_a.breed(player_b);
            }
            else{
                child_player = player_b.breed(player_a);
            }
            crossover_population.push(child_player);
        }
        this.crossover_population = crossover_population;
    };
    this.mutatePopulation = function(){
        for(let child of this.crossover_population){
            child.firstMutation(this.global_connection_history_list, this.global_node_history_list, this.global_add_node_mutation_list);
            child.secondMutation(this.global_connection_history_list, this.global_node_history_list, this.cloneGlobalNodeHistory());
        }
        this.updateGlobalNodeAndInnovation();
        console.log(`Generation: ${this.generation}`);
        this.generation++;
        this.population = this.crossover_population;

        this.all_species_list = [];
        this.species_total_fitness = 0;
        this.mating_pool = [];
        this.crossover_population = [];
        // console.log(this.global_node_history_list);
        // console.log(this.global_connection_history_list);
        // console.log(this.population);
        console.log('\n');
    };
    // Utility functions
    this.cloneGlobalNodeHistory = function(){
        let cloned_list = [];
        for(let node_history of this.global_node_history_list){
            cloned_list.push(node_history.clone());
        }
        return cloned_list;
    };
    this.getDistance = function(player_a, player_b){
        let different_connections = 0,
        total_w_diff = 0;
        let a_index = 0,
        b_index = 0;
        let a_connections = player_a.brain.connections_history_list,
        b_connections = player_b.brain.connections_history_list;
        let a_connection_len = a_connections.length,
        b_connection_len = b_connections.length;
        let same_connections_number = 0;
        while(true){
            if(a_index === a_connection_len && b_index === b_connection_len){
                break;
            }
            else if(a_index === a_connection_len){
                if(a_connections[a_index - 1].innovation_number === b_connections[b_index].innovation_number){
                    total_w_diff = Math.abs(a_connections[a_index - 1].weight - b_connections[b_index].weight);
                    b_index++;
                    same_connections_number++;
                }
                else{
                    different_connections++;
                    b_index++;
                }
            }
            else if(b_index === b_connection_len){
                if(a_connections[a_index].innovation_number === b_connections[b_index - 1].innovation_number){
                    total_w_diff = Math.abs(a_connections[a_index].weight - b_connections[b_index - 1].weight);
                    a_index++;
                    same_connections_number++;
                }
                else{
                    different_connections++;
                    a_index++;
                }
            }
            if(a_index !== a_connection_len && b_index !== b_connection_len){
                if(a_connections[a_index].innovation_number === b_connections[b_index].innovation_number){
                    total_w_diff = Math.abs(a_connections[a_index].weight - b_connections[b_index].weight);
                    a_index++;
                    b_index++;
                    same_connections_number++;
                }
                else if(a_connections[a_index].innovation_number < b_connections[b_index].innovation_number){
                    different_connections++;
                    a_index++;
                }
                else if(a_connections[a_index].innovation_number > b_connections[b_index].innovation_number){
                    different_connections++;
                    b_index++;
                }
            }
        }
        let N = 1;
        if(a_connection_len >= 20 || b_connection_len >= 20){
            if(a_connection_len >= b_connection_len){
                N = a_connection_len;
            }
            else{
                N = b_connection_len;
            }
        }
        let distance = (((this.c1 * different_connections) / N) + (this.c2 * (total_w_diff / same_connections_number)));
        return distance;
    };
    this.updateGlobalNodeAndInnovation = function(){
        this.global_innovation_number = this.global_connection_history_list[this.global_connection_history_list.length - 1].innovation_number + 1;
        this.global_node_number = this.global_node_history_list[this.global_node_history_list.length - 1].node_number + 1;
    };
    this.selectFromSameSpecies = function(){
        let player_a = this.mating_pool[Math.floor(random(this.mating_pool.length))],
        player_b = this.mating_pool[Math.floor(random(this.mating_pool.length))];
        while(true){
            let a_spec_index = 0,
            b_spec_index = 0;
            for(let i=0; i<this.all_species_list.length; i++){
                let species = this.all_species_list[i];
                for(let bird of species.population){
                    if(bird === player_a){
                        a_spec_index = i;
                    }
                    if(bird === player_b){
                        b_spec_index = i;
                    }
                }
            }
            if(a_spec_index === b_spec_index){
                return [player_a, player_b];     
            }
            player_a = this.mating_pool[Math.floor(random(this.mating_pool.length))];
            player_b = this.mating_pool[Math.floor(random(this.mating_pool.length))];
        }
    };
    this.getBestPlayer = function(){
        let best_player = this.population[0];
        for(let player of this.population){
            if(player.original_fitness > best_player.original_fitness){
                best_player = player;
            }
        }
        return best_player;
    };
    /* -------------------------------------------------------------------------------------------- */
}