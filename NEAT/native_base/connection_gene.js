// Actual connection generated within the node itself
function ConnectionGene(){
    this.init = function(in_node, out_node, weight, innovation_number){
        this.in_node = in_node;
        this.out_node = out_node;
        this.weight = weight;
        this.innovation_number = innovation_number;
        this.enabled = true;
    };
}