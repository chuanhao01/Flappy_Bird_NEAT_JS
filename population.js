function Population(){
    this.init = function(total_pop, mutation_rate){
        this.total_pop = total_pop;
        this.mutation_rate = mutation_rate;
        this.global_innovation_number = 1;
        this.global_node_number = 1;
        this.global_connection_history_list = [];
        this.global_node_history_list = [];
        this.global_add_node_mutation_list = [];
        this.population = [];
        this.all_species_list = [];
        this.mating_pool = [];
        this.crossover_population = [];
        this.c1 = 1;
        this.c2 = 0.5;
        this.compatibility_threshold = 2.5;
        this.prune_percentage = 0.5;
        this.generation = 1;
        // For the bird and game
        this.gravity = 0.7;
        this.lift = -5;
        this.air_res = 0.9;
    };
    this.cloneGlobalNodeHistory = function(){
        let cloned_list = [];
        for(let node_history of this.global_node_history_list){
            cloned_list.push(node_history.clone());
        }
        return cloned_list;
    };
    this.initPopualtion = function(input_nodes, output_nodes){
        let node_history_list = [],
        connection_history_list = [];
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
        this.global_node_history_list = node_history_list;
        let population = [];
        for(let i=0; i<this.total_pop; i++){
            let new_nodes_history_list = this.cloneGlobalNodeHistory(),
            new_connections_history_list = [];
            for(let input_node of input_nodes_list){
                for(let output_node of output_nodes_list){
                    let new_connection = this.generateConnection(input_node.node_number, output_node.node_number);
                    new_connections_history_list.push(new_connection);
                }
            }
            let bird = new Bird(this.gravity, this.lift, this.air_res);
            bird.init(new_nodes_history_list, new_connections_history_list, this.mutation_rate);
            population.push(bird);
        }
        this.population = population;
    };
    this.generateConnection = function(in_node, out_node){
        // Generating the first connection if it does not exist
        if(this.global_connection_history_list.length < 1){
            let first_connection = new ConnectionHistory();
            let weight = random(-2, 2);
            first_connection.init(in_node, out_node, weight, this.global_innovation_number);
            this.global_connection_history_list.push(first_connection);
            this.global_innovation_number++;
            // console.log(first_connection);
            return first_connection.clone();
        }
        // If there are already other connections
        else{
            // Checking through all connections to see if the connection has been made before
            let is_new = true,
            old_connection;
            for(let connection of this.global_connection_history_list){
                if(connection.in_node === in_node && connection.out_node === out_node){
                    is_new = false;
                    old_connection = connection.clone();
                    let new_weight = random(-2, 2);
                    old_connection.weight = new_weight;
                }
            }
            // If the connection is new generate the new one
            if(is_new){
                let new_connection = new ConnectionHistory();
                let weight = random(-2, 2);
                new_connection.init(in_node, out_node, weight, this.global_innovation_number);
                this.global_connection_history_list.push(new_connection);
                this.global_innovation_number++;
                // console.log(new_connection);
                return new_connection.clone();
            }
            else{
                // console.log(old_connection);
                return old_connection;
            }
        }
    };
    this.getDistance = function(bird_a, bird_b){
        let different_connections = 0,
        total_w_diff = 0;
        let a_index = 0,
        b_index = 0;
        let a_connections = bird_a.brain.connections_history_list,
        b_connections = bird_b.brain.connections_history_list;
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
    this.generateSpecies = function(){
        let all_species_list = [];
        for(let bird of this.population){
            if(all_species_list.length < 1){
                let first_species = new Species();
                first_species.init(bird);
                all_species_list.push(first_species);
            }
            else{
                let shortest_species = all_species_list[0],
                shortest_distance = this.getDistance(shortest_species.represent, bird);
                for(let species of all_species_list){
                    if(this.getDistance(species.represent, bird) < shortest_distance){
                        shortest_species = species;
                        shortest_distance = this.getDistance(shortest_species.represent, bird);
                    }
                }
                if(shortest_distance > this.compatibility_threshold){
                    let new_species = new Species();
                    new_species.init(bird);
                    all_species_list.push(new_species);
                }
                else{
                    shortest_species.addBird(bird);
                }
            }
        }
        this.all_species_list = all_species_list;
    };
    this.sortSpecies = function(){
        for(let species of this.all_species_list){
            species.population.sort((bird_a, bird_b) => {
                return bird_a.game_score - bird_b.game_score;
            })
        }
    };
    this.prunePopulation = function(){
        for(let i=0; i<this.all_species_list.length; i++){
            let species = this.all_species_list[i];
            let prune_number = Math.floor(species.population.length * this.prune_percentage);
            if(prune_number < species.population.length){
                species.population.splice(0, prune_number);
            }
        }
    };
    this.calculateSpecificFitness = function(){
        for(let species of this.all_species_list){
            let species_total_pop = species.population.length;
            for(let bird of species.population){
                bird.adjusted_score = bird.game_score / species_total_pop;
            }
        }
    };
    this.generateMatingPool = function(){
        let mating_pool = [];
        let highest_score = 0;
        for(let species of this.all_species_list){
            if(species.population[species.population.length - 1].adjusted_score > highest_score){
                highest_score = species.population[species.population.length - 1].adjusted_score;
            }
        }
        for(let species of this.all_species_list){
            for(let bird of species.population){
                let mating_score = Math.floor(map(bird.adjusted_score, 0, highest_score, 0, 100));
                for(let i=0; i<mating_score; i++){
                    mating_pool.push(bird);
                }
            }
        }
        this.mating_pool = mating_pool;
    };
    this.selectFromSameSpecies = function(){
        let bird_a = this.mating_pool[Math.floor(random(this.mating_pool.length))],
        bird_b = this.mating_pool[Math.floor(random(this.mating_pool.length))];
        while(true){
            let a_spec_index = 0,
            b_spec_index = 0;
            for(let i=0; i<this.all_species_list.length; i++){
                let species = this.all_species_list[i]
                for(let bird of species.population){
                    if(bird === bird_a){
                        a_spec_index = i;
                    }
                    if(bird === bird_b){
                        b_spec_index = i;
                    }
                }
            }
            if(a_spec_index === b_spec_index){
                return [bird_a, bird_b];     
            }
            bird_a = this.mating_pool[Math.floor(random(this.mating_pool.length))];
            bird_b = this.mating_pool[Math.floor(random(this.mating_pool.length))];
        }
    };
    this.crossoverPopulation = function(){
        let crossover_population = [];
        for(let i=0; i<this.total_pop; i++){
            let selected_birds = this.selectFromSameSpecies();
            let bird_a = selected_birds[0],
            bird_b = selected_birds[1];
            let child_bird;
            if(bird_a.adjusted_score > bird_b.adjusted_score){
                child_bird = bird_a.crossover(bird_b);
            }
            else{
                child_bird = bird_b.crossover(bird_a);
            }
            crossover_population.push(child_bird);
        }
        this.crossover_population = crossover_population;
    };
    this.mutateCrossoverPopulation = function(){
        for(let child_bird of this.crossover_population){
            child_bird.mutateAddNode(this.global_connection_history_list, this.global_node_history_list, this.global_add_node_mutation_list);
            child_bird.updateBrainNodesHistoryList(this.cloneGlobalNodeHistory());
            child_bird.mutateAddConnection(this.global_connection_history_list, this.global_node_history_list);
            child_bird.mutateWeights();
            child_bird.mutateEnableConnection();
            child_bird.setup();
        }
        this.updateGlobalNodeAndInnovation();
        console.log(`Generation: ${this.generation}`);
        console.log(this.global_node_history_list);
        console.log(this.global_connection_history_list)
        console.log(this.all_species_list);
        console.log('One example', this.population);
        this.generation++;
        this.population = this.crossover_population;
    };
    this.updateGlobalNodeAndInnovation = function(){
        this.global_innovation_number = this.global_connection_history_list[this.global_connection_history_list.length - 1].innovation_number + 1;
        this.global_node_number = this.global_node_history_list[this.global_node_history_list.length - 1].node_number + 1;
    }
}