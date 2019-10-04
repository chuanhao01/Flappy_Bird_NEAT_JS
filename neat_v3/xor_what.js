function xor(){
    this.init = function(){
        this.inputs = [[0, 0], [0, 1], [1, 0], [1, 1]];
        this.expected_outputs = [0, 1, 0, 1];
        this.score = 0;
    };
    this.generateBrain = function(first_gen, brain){
        if(first_gen){
            this.brain = new Genome();
            this.brain.init(brain.mutation_rate, brain.nodes_list, brain.connections_list);
        }
        else{
            this.brain = brain;
        }
    };
    this.loss = function(y, y_hat){
        return 
    }
    this.think = function(){
        for(let i=0; this.inputs.length; i++){
            this.brain.feedForward(this.inputs[i]);

        }
        for(let input of this.inputs){
            this.brain.feedForward(input);

        }
    }
}