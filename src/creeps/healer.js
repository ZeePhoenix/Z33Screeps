var roleHealer = {

    /** @param {Creep} creep **/
    run: function(creep){
		if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0){
			creep.memory.working = false;
		}
		if(!creep.memory.working && creep.store.getFreeCapacity() == 0){
			creep.memory.working = true;
		}

		if (creep.memory.working){
			var targets = creep.room.find(FIND_MY_STRUCTURES);
			
			let pTargets = _.filter(targets, function(struct){
				return (struct.hits < struct.hitsMax && struct.structureType != STRUCTURE_WALL); 
			});
			// We have a priority target to go to
			if(pTargets.length){
				// Find closest target to creep
				let target = creep.pos.findClosestByRange(targets);
				// Transfer energy if we're there, else move to it
				if(creep.pos.isNearTo(target)){
					creep.repair(target);
				} else {
					creep.moveZ(target, true);
				}
			} else {
				targets = creep.room.find(FIND_STRUCTURES);
				let wTargets = _.filter(targets, function(struct){ return (struct.structureType == STRUCTURE_WALL); });
				var targetWall = undefined;
				for (let p = 0.00001; p <= 1; p += .00001){
					for (let wall in wTargets){
						if (wall.hits / wall.hitsMax < p) { targetWall = wall; break; }
					}
				}
				console.log(targetWall);
				if (targetWall != undefined){
					if(creep.repair(targetWall) == ERR_NOT_IN_RANGE){
						creep.moveZ(targetWall, true);
					} 
				}
			}
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
			default: if (healers.length < 1 && creeps.length < 10) { return true; } break;
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