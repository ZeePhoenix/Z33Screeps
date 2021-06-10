var roleHealer = {
	num: 1,

    /** @param {Creep} creep **/
    run: function(creep){
		if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0){
			creep.memory.working = false;
		}
		if(!creep.memory.working && creep.store.getFreeCapacity() == 0){
			creep.memory.working = true;
		}

		if (creep.memory.working && !creep.memory.destination){
			var targets = creep.room.find(FIND_STRUCTURES);
			let priorities = _.filter(targets, (s) => s.structureType != STRUCTURE_WALL && s.hits < s.hitsMax);
			if (priorities.length){
				creep.zMove(creep.pos.findClosestByRange(priorities), 1);
			} else {
				
				let walls = _.filter(targets, (s) => s.structureType == STRUCTURE_WALL && s.hits < s.hitsMax);
				for (let p = 0.00001; p <= 1; p += .00001){
					for (let wall of walls){
						if (wall.hits / wall.hitsMax < p) { creep.zMove(wall, 1); break; }
					}
				}
			}
		} else if (creep.memory.working && creep.memory.destination) {
			creep.zMove(Game.getObjectById(creep.memory.destination), 2);
		}
		else {
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