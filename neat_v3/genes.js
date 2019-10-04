function Connection(){
    this.init = function(in_node_num, out_node_num, weight, enabled){
        this.in_node = in_node_num;
        this.out_node = out_node_num;
        this.weight = weight; 
        this.enabled = enabled;
    };
    this.setInnovationNumber = function(innovation_number){
        this.innovation_number = innovation_number;
    };
    this.fwdFeed = function(node_input){
        return node_input * this.weight;
    };
}

function Node(){
    this.init = function(node_number, type, layer_num){
        this.node_number = node_number;
        this.type = type;
        this.layer_num = layer_num;
        this.input_sum = 0;
        this.output_connections = [];
        this.output_nodes = [];
    };
    this.clearNode = function(){
        this.input_sum = 0;
        this.output_connections = [];
        this.output_nodes = [];
    };
    this.addInput = function(input){
        this.input_sum += input;
    };
    this.addConnection = function(connection){
        if(connection.enabled){
            this.output_connections.push(connection);
            this.output_nodes.push(connection.out_node);
        }
    };
    this.getOutput = function(){
        let outputs = [];
        if(this.layer_num === 0){
            for(let connection of this.output_connections){
                let output = this.input_sum * connection.weight;
                outputs.push(output);
            }
        }
        else{
            for(let connection of output_connections){
                let output = this.input_sum * connection.weight;
                output = Activations.sigmoid(output);
                outputs.push(output);
            }
        }
        return {
            outputs: outputs,
            output_nodes: this.output_nodes,
        };
    };
    this.getPureOutput = function(){
        return Activations.sigmoid(this.input_sum);
    };
}

