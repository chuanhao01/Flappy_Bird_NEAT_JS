function Species(){
    this.init = function(first_bird){
        this.represent = first_bird;
        this.population = [first_bird];
        this.species_fitness = 0;
    };
    this.addPlayer= function(bird){
        this.population.push(bird);
    };
    this.calculateSpeciesFitness = function(){
        for(let player of this.population){
            this.species_fitness += player.adjusted_fitness;
        }
    };
    // Function that returns 2 randomly selected players based on fitness
    this.getParents = function(){
        while(true){
            let parent_a = this.randomlyPickPlayer(),
            parent_b = this.randomlyPickPlayer();
            if(parent_a !== parent_b){
                return [parent_a, parent_b];
            }
        }
    };
    this.randomlyPickPlayer = function(){
        let gen_prob = randomNumber(0 ,1),
        count_prob = 0;
        for(let player of this.population){
            count_prob += player.adjusted_fitness / this.species_fitness;
            if(count_prob >= gen_prob){
                return player;
            }
        }
    };
}