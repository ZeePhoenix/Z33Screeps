var roleHealer = {
	num: 1,
	range: 2,

    /** @param {Creep} creep **/
    run: function(creep){
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
			let targets = creep.room.find(FIND_STRUCTURES);
			let prioTargets = _.filter(targets, (t) => t.structureType != STRUCTURE_WALL);
			let attempt = _.find(prioTargets, (t) => t.hits < t.hitsMax);
			if (attempt != undefined){
				creep.memory.destination = attempt.id;
			} else {
				let secTargets = _.filter(targets, (t) => t.structureType == STRUCTURE_WALL);
				for(let p = .00001; p < 1; p += .00001){
					// Get a wall at our current percentage
					creep.memory.destination = _.find(secTargets, (w) => w.hits/w.hitsMax < p).id;
					// If there is one, break out of the loop
					if (creep.memory.destination != undefined || creep.memory.destination != false) { break; }
				}
			}
		}
		// We must need energy
		if (creep.memory.working && creep.memory.destination != false){
			let workSite = Game.getObjectById(creep.memory.destination);
			if (workSite.hits == workSite.hitsMax){
				creep.memory.destination = false;
			} else {
				creep.zMove(workSite.id, 1);
			}
		} else {
			creep.getEnergy();
		}
	},
    // checks if the room needs to spawn a creep
    spawn: function(room) {
        var healers = _.filter(Game.creeps, (creep) => creep.memory.role == 'healer' && creep.room.name == room.name);
		let creeps = _.filter(Game.creeps, (creep) => creep.room.name == room.name);
        var extensions = _.filter(Game.structures, (struct) => struct.structureType == STRUCTURE_EXTENSION && struct.room.name == room.name);
		console.log('Healers: ' + healers.length, room.name);
		switch (extensions.length){
			case 0: case 1: return false; break;
			default: if (healers.length < this.num ) { return true; } break;
		}
    },
    // returns an object with the data to spawn a new creep
    spawnData: function(room) {
            let name = 'Healer' + Game.time;
            let bodySegment = [WORK, CARRY, MOVE, MOVE];
			var body = this.getBody(bodySegment, room);
            let memory = {role: 'healer'};
        
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

module.exports = roleHealer;