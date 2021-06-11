var roleHealer = {
	num: 2,
	range: 2,

    /** @param {Creep} creep **/
    run: function(creep){
		// If we are BUILDING and empty, go Mine
		if (creep.memory.working && creep.store.getUsedCapacity([RESOURCE_ENERGY]) == 0){
			creep.memory.working = false;
			creep.memory.source = false;
		}
		// If we are Filling up on Energy and full, go work
		if (!creep.memory.working && (creep.store.getUsedCapacity([RESOURCE_ENERGY]) == creep.store.getCapacity([RESOURCE_ENERGY]))){
			creep.memory.working = true;
			creep.memory.destination = false;
		}

		if (creep.memory.working && !creep.memory.destination) {
			let targets = creep.room.find(FIND_STRUCTURES);
			let priorityList = [STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_CONTAINER, STRUCTURE_ROAD];
			let l = _.filter(targets, (t) => t.hits < t.hitsMax);
			let priority = creep.findPriority(l, priorityList);
			// If we have one of our priority targets
			if (priority != undefined){
				//console.log(JSON.stringify(Game.getObjectById(priority)));
				creep.memory.destination = priority;
			} else {
				//let secTargets = _.filter(targets, (t) => t.structureType == STRUCTURE_WALL);
				let wall = undefined;
				for(let p = .00001; p < 1; p += .00001){
					//console.log(p);
					// Get a wall at our current percentage
					wall = _.find(l, (w) => w.hits/w.hitsMax < p && w.structureType == STRUCTURE_WALL);
					// If there is one, break out of the loop
					if (wall != undefined) { creep.memory.destination = wall.id; break; }
				}
			}
		}
		// We must need energy
		if (creep.memory.working && creep.memory.destination != false){
			let workSite = Game.getObjectById(creep.memory.destination);
			if (workSite.hits == workSite.hitsMax){
				creep.memory.destination = false;
			} else {
				creep.zMove(creep.memory.destination, this.range);
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
            let memory = {role: 'healer', working: false, destination: false, source: false};
        
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