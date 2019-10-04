function Genome(){
    this.init = function(mutation_rate, nodes_list, connections_list){
        this.mutation_rate = mutation_rate;
        this.nodes_list = nodes_list;
        this.connections_list = connections_list;
        this.max_layer = this.findMaxLayer();
        this.ori_score = 0;
    };
    this.findMaxLayer = function(){
        let max_layer = this.nodes_list[0].layer_num;
        for(let i=1; i<this.nodes_list.length; i++){
            if(max_layer < this.nodes_list[i].layer_num){
                max_layer = this.nodes_list[i].layer_num;
            }
        }
        return max_layer;
    };
    this.connectNodes = function(){
        for(let i=0; i<this.nodes_list.length; i++){
            let node = this.nodes_list[i];
            if(node.layer_num !== -1){
                for(let j=0; j<this.connections_list.length; j++){
                    let connection = this.connections_list[j];
                    if(connection.in_node === node.node_number){
                        this.nodes_list[i].addConnection(connection);
                    }
                }
            }
        }
    };
    // Returns the index of the node number
    this.getNode = function(node_number){
        for(let i=0; i<this.nodes_list.length; i++){
            if(this.nodes_list[i].node_number === node_number){
                return i;
            }
        }
    };
    this.feedForward = function(inputs){
        for(let i=0; i<inputs.length; i++){
            this.nodes_list[i].input_sum += inputs[i];
        }
        this.connectNodes();
        for(let layer=0; layer<this.max_layer + 1; layer++){
            for(let i=0; i<this.nodes_list.length; i++){
                let node = this.nodes_list[i];
                if(node.layer_num === layer){
                    let output_obj = node.getOutput();
                    for(let output_index=0; output_index<output_obj.outputs.length; output_index++){
                        let output_node_index = this.getNode(output_obj.output_nodes[output_index]);
                        this.nodes_list[output_node_index].input_sum += output_obj.outputs[output_index];
                    }
                }
            }
        }
        this.clearNodes();
    };
    this.clearNodes = function(){
        for(let i=0; i<this.nodes_list.length; i++){
            this.nodes_list[i].clearNode();
        }   
    };

    // this.feedForward = function(inputs){
    //     for(let i=0; i<inputs.length; i++){
    //         this.nodes_list[i].input_sum = inputs[i]
    //         // this.nodes_list[i].addInput(inputs[i]);
    //     }
    //     for(let i=0; i<this.nodes_list.length; i++){
    //         let node = this.nodes_list[i];
    //         if(node.layer_num !== -1){
    //             this.addOutput(this.nodes_list[i]);
    //         }
    //     }
    //     for(let i=0; i<this.max_layer + 1; i++){
    //         let curr_layer = [];
    //         for(let j=0; j<this.nodes_list.length; j++){
    //             if(this.nodes_list[j].layer_num === i){
    //                 curr_layer.push(this.nodes_list[j]);
    //             }
    //         }
    //         for(let j=0; j<curr_layer.length; j++){
    //             let node = curr_layer[j];
    //             for(let k=0; k<node.output_nodes.length; k++){
    //                 let output_node_number = node.output_nodes[k];
    //                 let output_node_index = this.getNode(output_node_number);
    //                 let output_to_next = this.getConnection(node.node_number,output_node_number, node);
    //                 this.nodes_list[output_node_index].addInput(output_to_next);
    //             }
    //         }
    //     }
    // };
    this.getOutput = function(){
        for(let node of this.nodes_list){
            if(node.type === 'output'){
                return node.getPureOutput();
            }
        }
    };
}