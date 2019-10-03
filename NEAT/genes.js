function Connection(){
    this.init = function(in_node_num, out_node_num, weight, enabled){
        this.in_num = in_node_num;
        this.out_num = out_node_num;
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
        this.output_nodes = [];
    };
    this.addInput = function(input){
        this.input_sum += input;
    };
    this.addOutput = function(output_node){
        this.output_nodes.push(output_node);
    };
    this.getOutput = function(){
        return Activations.sigmoid(this.input_sum);
    };
}

