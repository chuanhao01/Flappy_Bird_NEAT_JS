function Species(){
    this.init = function(first_bird){
        this.represent = first_bird;
        this.population = [first_bird];
    };
    this.addBird = function(bird){
        this.population.push(bird);
    };
}