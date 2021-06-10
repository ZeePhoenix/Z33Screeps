var roleUpgrader = {
	num: 2,

    /** @param {Creep} creep **/
    run: function(creep) {
		// If we are BUILDING and empty, go Mine
		if (creep.memory.working && creep.store.getUsedCapacity([RESOURCE_ENERGY]) == 0){
			creep.memory.working = false;
			//creep.memory.destination = false;
		}
		// If we are Filling up on Energy and full, go work
		if (!creep.memory.working && (creep.store.getUsedCapacity([RESOURCE_ENERGY]) == creep.store.getCapacity([RESOURCE_ENERGY]))){
			creep.memory.working = true;
			creep.memory.destination = false;
		}

		if (creep.memory.working && !creep.memory.destination) {
			creep.memory.destination = creep.room.controller.id;
		}
		// We must need energy
		if (creep.memory.working && creep.memory.destination != false){
			creep.zMove(creep.memory.destination, 2);
		} else {
			creep.getEnergy();
		}
    },
    // checks if the room needs to spawn a creep
    spawn: function(room) {
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader' && creep.room.name == room.name);
        console.log('Upgraders: ' + upgraders.length, room.name);

        if (upgraders.length < this.num ) {
            return true;
        }
    },
    // returns an object with the data to spawn a new creep
    spawnData: function(room) {
            let name = 'Upgrader' + Game.time;
            let bodySegment = [WORK, CARRY, MOVE];
			var body = this.getBody(bodySegment, room);
            let memory = {role: 'upgrader', working: false, destination: false, source: undefined};
        
            return {name, body, memory};
    },

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

module.exports = roleUpgrader;