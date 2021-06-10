var roleTemplate = {
	num: 2,

	/**@param {Creep} creep */
	run: function(creep){
		
	},
    // checks if the room needs to spawn a creep
    spawn: function(room) {
        let templates = _.filter(Game.creeps, (creep) => creep.memory.role == 'template' && creep.room.name == room.name);
        console.log('template: ' + upgraders.length, room.name);

        if (templates.length < this.num && constructions.length > 0) {
            return true;
        }
    },
    // returns an object with the data to spawn a new creep
    spawnData: function(room) {
            let name = 'template' + Game.time;
            let bodySegment = [WORK, CARRY, MOVE];
			var body = this.getBody(bodySegment, room);
            let memory = {role: 'template'};
        
            return {name, body, memory};
    },
	// Gets the larges body we can
	getBody: function(segment, room){
		var body = [];
		let segmentCost = _.sum(segment, s => BODYPART_COST[s]);
		let energyAvailable = room.energyAvailable;
		let maxSegments = Math.floor(energyAvailable / segmentCost);
		_.times(maxSegments, function(){
			_.forEach(segment, s => body.push(s));
		});
		return body;
	}
};

module.exports = template;