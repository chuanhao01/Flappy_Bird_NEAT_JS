function Genome(){
    this.init = function(nodes_history_list, connections_history_list, mutation_rate){
        this.weight_shift_coeff = 0.01;
        this.nodes_history_list = nodes_history_list;
        this.connections_history_list = connections_history_list;
        this.mutation_rate = mutation_rate;
        this.nodes_genes_list = [];
        this.connections_genes_list = [];
        this.sortConnectionsHistory();
        this.generateNodeGenes();
        this.generateConnectionGenes();
    };
    this.sortConnectionsHistory = function(){
        this.connections_history_list.sort((connection_a, connection_b) => {
            return connection_a.innovation_number - connection_b.innovation_number;
        });
    };
    this.generateNodeGenes = function(){
        let new_node_genes_list = [];
        for(let node of this.nodes_history_list){
            let node_gene = new NodeGene();
            node_gene.init(node.node_number, node.type, node.layer_number);
            new_node_genes_list.push(node_gene);
        }
        this.nodes_genes_list = new_node_genes_list;
    };
    this.generateConnectionGenes = function(){
        let new_connections_genes_list = [];
        for(let connection of this.connections_history_list){
            let connection_gene = new ConnectionGene();
            connection_gene.init(this.getNode(connection.in_node), this.getNode(connection.out_node), connection.weight, connection.innovation_number);
            new_connections_genes_list.push(connection_gene);
        }
        this.connections_genes_list = new_connections_genes_list;
    };
    this.getNode = function(node_number){
        return this.nodes_genes_list[node_number - 1];
    };
    this.clearNodes = function(){
        for(let node_gene of this.nodes_genes_list){
            node_gene.clearNode();
        }
    };
    this.getMaxLayer = function(nodes_genes_list){
        let max_layer = 0;
        for(let node_gene of nodes_genes_list){
            if(node_gene.layer_number > max_layer){
                max_layer = node_gene.layer_number;
            }
        }
        return max_layer;
    };
    this.feedForward = function(inputs){
        this.clearNodes();
        // console.log(this.nodes_genes_list)
        // console.log(inputs);
        for(let i=0; i<inputs.length; i++){
            this.nodes_genes_list[i].input_sum = inputs[i];
        }
        let nodes_needed = [];
        for(let connection_gene of this.connections_genes_list){
            if(connection_gene.enabled){
                let in_node = connection_gene.in_node,
                out_node = connection_gene.out_node; 
                in_node.output_connections.push(connection_gene);
                if(nodes_needed.length < 1){
                    nodes_needed.push(in_node);
                    nodes_needed.push(out_node);
                }
                else{
                    let add_in = true,
                    add_out = true;
                    for(let node_gene of nodes_needed){
                        if(node_gene.node_number === in_node.node_number){
                            add_in = false;
                        }
                        if(node_gene.node_number === out_node.node_number){
                            add_out = false;
                        }
                    }
                    if(add_in){
                        nodes_needed.push(in_node);
                    }
                    if(add_out){
                        nodes_needed.push(out_node);
                    }
                }
            }
        }
        let max_layer = this.getMaxLayer(nodes_needed);
        for(let i=0; i<=max_layer; i++){
            for(let node_gene of nodes_needed){
                if(node_gene.layer_number === i){
                    node_gene.feedForward();
                }
            }
        }
    };
    // Getting the output of output nodes in an array of [output_1, output_2, ...]
    this.getOutput = function(){
        let outputs = [];
        for(let node_gene of this.nodes_genes_list){
            if(node_gene.type === 'output'){
                outputs.push(node_gene.getOutput());
            }
        }
        return outputs;
    };
    this.crossover = function(genome_a){
        genome_a.sortConnectionsHistory();
        this.sortConnectionsHistory();
        let a_index = 0,
        b_index = 0;
        let a_connections = genome_a.connections_history_list; 
        b_connections = this.connections_history_list;
        let a_connection_len = a_connections.length,
        b_connection_len = b_connections.length;
        let final_connections = [];
        while(true){
            if(a_index === a_connection_len || b_index === b_connection_len){
                if(b_index === b_connection_len){
                    break;
                }
                else if(a_index === a_connection_len){
                    final_connections.push(b_connections[b_index].clone());
                    b_index++;
                }
            }
            else if(b_index !== b_connection_len){
                if(a_connections[a_index].innovation_number === b_connections[b_index].innovation_number){
                    final_connections.push(b_connections[b_index].clone());
                    a_index++;
                    b_index++;
                }
                else if(a_connections[a_index].innovation_number < b_connections[b_index].innovation_number){
                    final_connections.push(a_connections[a_index].clone());
                    a_index++;
                }
                else if(a_connections[a_index].innovation_number > b_connections[b_index].innovation_number){
                    final_connections.push(b_connections[b_index].clone());
                    b_index++;
                }
            }
        }
        // Making new child brain
        // Still need to update connections and nodes at the end after mutation
        let child = new Genome();
        child.init(this.nodes_history_list, final_connections, this.mutation_rate);
        return child;
    };
    this.generateConnection = function(in_node, out_node, global_connection_history_list){
        let is_new = true,
        old_connection;
        for(let connection_history of global_connection_history_list){
            if(connection_history.in_node === in_node && connection_history.out_node === out_node){
                is_new = false;
                old_connection = connection_history.clone();
                let new_weight = random(-2, 2);
                old_connection.weight = new_weight;
            }
        }
        if(is_new){
            let new_connection_history = new ConnectionHistory();
            let weight = random(-2, 2);
            new_connection_history.init(in_node, out_node, weight, global_connection_history_list[global_connection_history_list.length - 1].innovation_number + 1);
            global_connection_history_list.push(new_connection_history);
            return new_connection_history.clone();
        }
        else{
            return old_connection;
        }
    }
    // Here the global are passed from the population and the generate connection function is also passed down.
    // We make adjustments directly on these variables by reference
    // Remeber to update Innovation number and node number at the end
    this.mutateAddNode = function(global_connection_history_list, global_node_history_list, global_add_node_mutation_list){
        for(let connection_history of this.connections_history_list){
            if(connection_history.enabled){
                if (Math.random() < 0.01) {
                    if (global_add_node_mutation_list.length < 1) {
                        let new_add_node_mutation = new AddNodeMutation();
                        // grabbing nodes from global list
                        let global_in_node_history = global_node_history_list[connection_history.in_node - 1],
                            global_out_node_history = global_node_history_list[connection_history.out_node - 1];
                        // generating new node
                        let new_node_history = new NodeHistory();
                        new_node_history.init(global_node_history_list[global_node_history_list.length - 1].node_number + 1, 'hidden', global_in_node_history.layer_number + 1);
                        // generating new in and out connections
                        let new_in_connection_history = this.generateConnection(global_in_node_history.node_number, new_node_history.node_number, global_connection_history_list),
                            new_out_connection_history = this.generateConnection(new_node_history.node_number, global_out_node_history.node_number, global_connection_history_list);
                        // Pushing new node into global list
                        // console.log('im adding a new node')
                        global_node_history_list.push(new_node_history);
                        // Making the mutation obj
                        new_add_node_mutation.init(connection_history.clone(), new_in_connection_history, new_out_connection_history);
                        global_add_node_mutation_list.push(new_add_node_mutation);
                        // Updating the genome attributes
                        new_in_connection_history = new_add_node_mutation.new_in_connection_history.clone();
                        new_out_connection_history = new_add_node_mutation.new_out_connection_history.clone();
                        new_in_connection_history.weight = 1;
                        new_out_connection_history.weight = connection_history.weight;
                        this.connections_history_list.push(new_in_connection_history);
                        this.connections_history_list.push(new_out_connection_history);
                        connection_history.enabled = false;
                        connection_history.cannot_come_back = true;
                    }
                    else {
                        let is_new = true;
                        for (let add_node_mutation of global_add_node_mutation_list) {
                            if (connection_history.in_node === add_node_mutation.original_connection_history.in_node && connection_history.out_node === add_node_mutation.original_connection_history.out_node) {
                                is_new = false;
                                let new_in_connection_history = add_node_mutation.new_in_connection_history.clone(),
                                    new_out_connection_history = add_node_mutation.new_out_connection_history.clone();
                                new_in_connection_history.weight = 1;
                                new_out_connection_history.weight = connection_history.weight;
                                this.connections_history_list.push(new_in_connection_history);
                                this.connections_history_list.push(new_out_connection_history);
                                connection_history.enabled = false;
                            }
                        }
                        if (is_new) {
                            let new_add_node_mutation = new AddNodeMutation();
                            // Grabbing nodes from global list
                            let global_in_node_history = global_node_history_list[connection_history.in_node - 1],
                                global_out_node_history = global_node_history_list[connection_history.out_node - 1];
                            // generating new node
                            let new_node_history = new NodeHistory();
                            new_node_history.init(global_node_history_list[global_node_history_list.length - 1].node_number + 1, 'hidden', global_in_node_history.layer_number + 1);
                            // generating the new connections
                            let new_in_connection_history = this.generateConnection(global_in_node_history.node_number, new_node_history.node_number, global_connection_history_list),
                                new_out_connection_history = this.generateConnection(new_node_history.node_number, global_out_node_history.node_number, global_connection_history_list);
                            // Making the mutation obj
                            new_add_node_mutation.init(connection_history.clone(), new_in_connection_history, new_out_connection_history);
                            global_add_node_mutation_list.push(new_add_node_mutation);
                            if (global_out_node_history.type === 'output') {
                                new_in_connection_history = new_add_node_mutation.new_in_connection_history.clone();
                                new_out_connection_history = new_add_node_mutation.new_out_connection_history.clone();
                                new_in_connection_history.weight = 1;
                                new_out_connection_history.weight = connection_history.weight;
                                this.connections_history_list.push(new_in_connection_history);
                                this.connections_history_list.push(new_out_connection_history);
                                connection_history.cannot_come_back = true;
                                connection_history.enabled = false;
                            }
                            else {
                                for (let node_history of global_node_history_list) {
                                    if (node_history.layer_number >= global_out_node_history.layer_number) {
                                        // console.log(node_history.clone(), connection_history.clone());
                                        node_history.layer_number += 1;
                                    }
                                }
                                global_out_node_history.layer_number += 1;
                                new_in_connection_history = new_add_node_mutation.new_in_connection_history.clone();
                                new_out_connection_history = new_add_node_mutation.new_out_connection_history.clone();
                                new_in_connection_history.weight = 1;
                                new_out_connection_history.weight = connection_history.weight;
                                this.connections_history_list.push(new_in_connection_history);
                                this.connections_history_list.push(new_out_connection_history);
                                connection_history.enabled = false;
                                connection_history.cannot_come_back = true;
                            }
                            // pushing node into global list
                            // console.log('im also adding a node');
                            global_node_history_list.push(new_node_history);
                        }
                    }
                }
            }
        }
    };
    this.updateNodesHistoryList = function(global_node_history_list){
        this.nodes_history_list = global_node_history_list;
    };
    this.generateNodeToAddConnections = function(){
        let possible_nodes_history = [];
        for(let connection_history of this.connections_history_list){
            let in_node = this.nodes_history_list[connection_history.in_node - 1].clone(),
            out_node = this.nodes_history_list[connection_history.out_node - 1].clone();
            if(possible_nodes_history.length < 1){
                possible_nodes_history.push(in_node);
                possible_nodes_history.push(out_node);
            }
            else{
                let add_in = true,
                add_out = true;
                for(let nodes_history of possible_nodes_history){
                    if(nodes_history.node_number === in_node.node_number){
                        add_in = false;
                    }
                    if(nodes_history.node_number === out_node.node_number){
                        add_out = false
                    }
                }
                if(add_in){
                    possible_nodes_history.push(in_node);
                }
                if(add_out){
                    possible_nodes_history.push(out_node);
                }
            }
        }
        return possible_nodes_history;
    };
    this.checkConnectionIsNew = function(in_node, out_node){
        for(let connection_history of this.connections_history_list){
            if(connection_history.in_node === in_node && connection_history.out_node === out_node){
                return false;
            }
        }
        return true;
    };
    this.mutateAddConnection = function(global_connection_history_list, global_node_history_list){
        let possible_nodes_history = this.generateNodeToAddConnections();
        for(let i=0; i<possible_nodes_history.length; i++){
            if(Math.random() < 0.05){
                let node_history_a = possible_nodes_history[Math.floor(Math.random() * possible_nodes_history.length)],
                node_history_b = possible_nodes_history[Math.floor(Math.random() * possible_nodes_history.length)];
                while(node_history_a.layer_number === node_history_b.layer_number){
                    node_history_a = possible_nodes_history[Math.floor(Math.random() * possible_nodes_history.length)];
                    node_history_b = possible_nodes_history[Math.floor(Math.random() * possible_nodes_history.length)];
                }
                if(node_history_a.type === 'output'){
                    let temp_node_history = node_history_b;
                    node_history_b = node_history_a;
                    node_history_a = temp_node_history;
                }
                else{
                    if(node_history_a.layer_number > node_history_b.layer_number && node_history_b.layer_number !== -1){
                        let temp_node_history = node_history_b;
                        node_history_b = node_history_a;
                        node_history_a = temp_node_history;
                    }
                }
                if(this.checkConnectionIsNew(node_history_a.node_number, node_history_b.node_number)){
                    let new_connection_history = this.generateConnection(node_history_a.node_number, node_history_b.node_number, global_connection_history_list);
                    this.connections_history_list.push(new_connection_history);
                }
            }
        }
    };
    this.mutateWeights = function(){
        for(let connection_history of this.connections_history_list){
            if(connection_history.enabled){
                if(Math.random() < 0.15){
                    connection_history.weight += this.weight_shift_coeff * random(-2, 2);
                }
                // Need double for completely randomise
                if(Math.random() < 0.1){
                    let new_weight = random(-2, 2);
                    connection_history.weight = new_weight;
                }
                // Taking out the weight limits
                // if(connection_history.weight < -2){
                //     connection_history.weight = -2;
                // }
                // else if(connection_history.weight > 2){
                //     connection_history.weight = 2;
                // }
            }
        }
    };
    this.mutateEnableConnection = function(){
        for(let connection_history of this.connections_history_list){
            if(Math.random() < 0.2){
                if(!connection_history.cannot_come_back){
                    connection_history.enabled = !connection_history.enabled;
                }
            }
        }
    };
    this.setup = function(){
        // console.log(this.connections_history_list);
        // console.log(this.nodes_genes_list);
        this.sortConnectionsHistory();
        this.generateNodeGenes();
        this.generateConnectionGenes()
    };
}