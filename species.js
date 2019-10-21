function Species(){
    this.init = function(first_bird){
        this.represent = first_bird;
        this.population = [first_bird];
        this.species_score = 0;
    };
    this.addBird = function(bird){
        this.population.push(bird);
    };
    this.calcuateSpecies = function(){
        for(let bird of this.population){
            this.species_score += bird.game_score;
        }
        this.species_score /= this.population.length;
    };
}