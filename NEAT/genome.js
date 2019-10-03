function Genome(){
    this.init = function(mutation_rate, node_list, connections_list){
        this.mutation_rate = mutation_rate;
        this.node_list = node_list;
        this.connections_list = connections_list;
        this.max_layer = this.findMaxLayer();
    };
    this.findMaxLayer = function(){
        let max_layer = this.node_list[0].layer_num;
        for(let i=1; i<this.node_list.length; i++){
            if(max_layer < this.node_list[i].layer_num){
                max_layer = this.node_list[i].layer_num;
            }
        }
        return max_layer;
    };
    this.addOutput = function(node){
        for(let i=0; i<this.connections_list.length; i++){
            let connection = this.connections_list[i];
            if(connection.enabled){
                if(connection.in_num === node.node_number){
                    node.addOutput(connection.out_num);
                }
            }
        }
    };
    // Returns the index of the node number
    this.getNode = function(node_number){
        for(let i=0; i<this.node_list.length; i++){
            if(this.node_list[i].node_number === node_number){
                return i;
            }
        }
    };
    this.getConnection = function(in_num, out_num, node){
        for(let i=0; i<this.connections_list.length; i++){
            let connection = this.connections_list[i];
            if(connection.in_num === in_num && connection.out_num === out_num){
                node.input_sum = connection.fwdFeed(node.input_sum);
                return node.getOutput();
            }
        }
    }
    this.feedForward = function(inputs){
        for(let i=0; i<inputs.length; i++){
            this.node_list[i].addInput(inputs[i]);
        }
        for(let i=0; i<this.node_list.length; i++){
            let node = this.node_list[i];
            if(node.layer_num !== -1){
                this.addOutput(this.node_list[i]);
            }
        }
        for(let i=0; i<this.max_layer + 1; i++){
            let curr_layer = [];
            for(let j=0; j<this.node_list.length; j++){
                if(this.node_list[j].layer_num === i){
                    curr_layer.push(this.node_list[j]);
                }
            }
            for(let j=0; j<curr_layer.length; j++){
                let node = curr_layer[j];
                for(let k=0; k<node.output_nodes.length; k++){
                    let output_node_number = node.output_nodes[k];
                    let output_node_index = this.getNode(output_node_number);
                    let output_to_next = this.getConnection(node.node_number,output_node_number, node);
                    this.node_list[output_node_index].addInput(output_to_next);
                }
            }
        }
    };
}