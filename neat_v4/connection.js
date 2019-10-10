function Connection(){
    this.init = function(in_node, out_node, weight, innovation_number){
        this.in_node = in_node;
        this.out_node = out_node;
        this.weight = weight;
        this.innovation_number = innovation_number;
        this.enabled = true
    };
    this.clone = function(){
        let new_connection = new Connection();
        new_connection.init(this.in_node, this.out_node, this.weight, this.innovation_number);
        new_connection.enabled = this.enabled;
        return new_connection;
    };
}