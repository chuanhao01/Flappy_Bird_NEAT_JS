// An object that holds the template to make the connection gene
function ConnectionHistory(){
    this.init = function(in_node, out_node, weight, innovation_number){
        this.in_node = in_node;
        this.out_node = out_node;
        this.weight = weight;
        this.innovation_number = innovation_number;
        this.enabled = true
    };
    this.clone = function(){
        let new_connection_history = new ConnectionHistory();
        new_connection_history.init(this.in_node, this.out_node, this.weight, this.innovation_number);
        new_connection_history.enabled = this.enabled;
        return new_connection_history;
    }
}