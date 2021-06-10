var harvester = {
	num: 3,

    /** @param {Creep} creep **/
    run: function(creep){
		// If we are dropping off Energy and empty, go Mine
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
			let targets = creep.room.find(FIND_STRUCTURES);
			let prioTargets = _.filter(targets, (t) => (t.structureType == STRUCTURE_SPAWN || t.structureType == STRUCTURE_EXTENSION));
			let attempt = _.find(prioTargets, (t) => t.store.getFreeCapacity([RESOURCE_ENERGY]) > 0);
			if (attempt != undefined){
				creep.memory.destination = attempt.id;
			} else {
				let secTargets = _.filter(targets, (t) => (t.structureType == STRUCTURE_CONTAINER || t.structureType == STRUCTURE_STORAGE));
				let bAttempt = _.find(secTargets, (t) => t.store.getFreeCapacity([RESOURCE_ENERGY]) > 0);
				if (bAttempt != undefined) {
					creep.memory.destination = bAttempt.id;
				}
			}
		}
		// Ensure our workSite is accurate, and then get to it
		if (creep.memory.working && creep.memory.destination != false){
			let workSite = Game.getObjectById(creep.memory.destination);
			if (workSite.store.getFreeCapacity([RESOURCE_ENERGY]) == 0){
				creep.memory.destination = false;
			} else {
				creep.zMove(workSite.id, 1);
			}
		} 
		// Otherwise, fill up that gass
		else {
			creep.getEnergy();
		}
	},
    // checks if the room needs to spawn a creep
    spawn: function(room) {
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester' && creep.room.name == room.name);
        console.log('Harvesters: ' + harvesters.length, room.name);

        if (harvesters.length < this.num) {
            return true;
        }
    },
    // returns an object with the data to spawn a new creep
    spawnData: function(room) {
            let name = 'Harvester' + Game.time;
            var bodySegment = [WORK, CARRY, MOVE];
			var body = this.getBody(bodySegment, room);
            let memory = {role: 'harvester', source: false, destination: false};
            return {name, body, memory};
    },

	getBody: function(segment, room){
		var body = [];
		let segmentCost = _.sum(segment, s => BODYPART_COST[s]);
		let maxSegments = Math.floor(room.energyAvailable / segmentCost);
		_.times(maxSegments, function(){
			_.forEach(segment, s => body.push(s));
		});
		return body;
	}
}

module.exports = harvester;