function Population(){
    this.init = function(total_pop, mutation_rate){
        // For the population
        this.total_pop = total_pop
        this.mutation_rate = mutation_rate;
        this.global_innovation_number = 1;
        this.global_node_number = 1;
        this.global_connections_list = [];
        this.global_nodes_list = [];
        this.global_mutations = [];
        this.population = [];
        this.mating_pool = [];
        this.c1 = 1;
        this.c2 = 1;
        this.compatibility_threshold = 2;
        this.prune_percentage = 0.15;
        this.generation = 1;
        // For the bird and game
        this.gravity = 0.6;
        this.lift = -20;
        this.air_res = 0.9;
    };
    this.initPopulation = function(input_nodes, output_nodes){
        // Generating the input and output nodes for gen 1
        let input_nodes_list = [],
        output_nodes_list = [];
        for(let i=0; i<input_nodes; i++){
            let new_node = new Node();
            new_node.init(this.global_node_number, 'input', 0);
            this.global_nodes_list.push(new_node);
            this.global_node_number++;
            input_nodes_list.push(new_node);
        }
        for(let i=0; i<output_nodes; i++){
            let new_node = new Node();
            new_node.init(this.global_node_number, 'output', -1);
            this.global_nodes_list.push(new_node);
            this.global_node_number++;
            output_nodes_list.push(new_node);
        }
        // Generating new population
        let population = [];
        for(let i=0; i<this.total_pop; i++){
            let nodes_list = this.cloneGlobalNodesList();
            let connections_list = [];
            for(let input_node of input_nodes_list){
                for(let output_node of output_nodes_list){
                    let new_connection = this.generateConnection(input_node.node_number, output_node.node_number);
                    connections_list.push(new_connection);
                }
            }
            let bird = new Bird(this.gravity, this.lift, this.air_res);
            bird.init(nodes_list, connections_list);
            population.push(bird);
        }
        this.population = population;
    };
    this.cloneGlobalNodesList = function(){
        let new_nodes_list = [];
        for(let node of this.global_nodes_list){
            new_nodes_list.push(node.clone());
        }
        return new_nodes_list;
    };
    this.generateConnection = function(in_node, out_node){
        // Generating the first connection if it does not exist
        if(this.global_connections_list.length < 1){
            let first_connection = new Connection();
            let weight = random(-2, 2);
            first_connection.init(in_node, out_node, weight, this.global_innovation_number);
            this.global_connections_list.push(first_connection);
            this.global_innovation_number++;
            // console.log(first_connection);
            return first_connection.clone();
        }
        // If there are already other connections
        else{
            // Checking through all connections to see if the connection has been made before
            let is_new = true,
            old_connection;
            for(let connection of this.global_connections_list){
                if(connection.in_node === in_node && connection.out_node === out_node){
                    is_new = false;
                    old_connection = connection.clone();
                }
            }
            // If the connection is new generate the new one
            if(is_new){
                let new_connection = new Connection();
                let weight = random(-2, 2);
                new_connection.init(in_node, out_node, weight, this.global_innovation_number);
                this.global_connections_list.push(new_connection);
                this.global_innovation_number++;
                // console.log(new_connection);
                return new_connection.clone();
            }
            else{
                // console.log(old_connection);
                return old_connection;
            }
        }
    }
}