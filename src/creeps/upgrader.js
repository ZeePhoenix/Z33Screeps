var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
		if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0){
			creep.memory.working = false;
		}
		if(!creep.memory.working && creep.store.getFreeCapacity() == 0){
			creep.memory.working = true;
		}

		if (creep.memory.working){
			if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveZ(creep.room.controller, true);
            }
		} else {
			creep.getEnergy();
		}
    },
    // checks if the room needs to spawn a creep
    spawn: function(room) {
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader' && creep.room.name == room.name);
        console.log('Upgraders: ' + upgraders.length, room.name);

        if (upgraders.length < 3 ) {
            return true;
        }
    },
    // returns an object with the data to spawn a new creep
    spawnData: function(room) {
            let name = 'Upgrader' + Game.time;
            let bodySegment = [WORK, CARRY, MOVE];
			var body = this.getBody(bodySegment, room);
            let memory = {role: 'upgrader'};
        
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