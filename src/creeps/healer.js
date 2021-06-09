var roleHealer = {

    /** @param {Creep} creep **/
    run: function(creep){
		if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0){
			creep.memory.working = false;
			if (creep.speaking()) { creep.say('Done Work'); }
		}
		if(!creep.memory.working && creep.store.getFreeCapacity() == 0){
			creep.memory.working = true;
			if (creep.speaking()) { creep.say('Time to Work'); }
		}

		if (creep.memory.working){
			var targets = creep.room.find(FIND_MY_STRUCTURES);
			// Only deliver energy to these structures if they need energy
			targets = _.filter(targets, function(struct){
				return (struct.hits < struct.hitsMax); });
			// We have somewhere to go
			if(targets.length){
				// Find closest target to creep
				let target = creep.pos.findClosestByRange(targets);
				// Transfer energy if we're there, else move to it
				if(creep.pos.isNearTo(target)){
					creep.repair(target);
				} else {
					creep.moveZ(target, true);
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
        var extensions = _.filter(Game.structures, (struct) => struct.structureType == STRUCTURE_EXTENSION && struct.room.name == room.name);
		console.log('Healers: ' + healers.length, room.name);
		switch (extensions){
			case 5:
			case 4:
			case 3:
			case 2: return true;
			default: return false;
		}
    },
    // returns an object with the data to spawn a new creep
    spawnData: function(room) {
            let name = 'Healer' + Game.time;
            let body = [WORK, WORK, CARRY, MOVE, MOVE, MOVE];
            let memory = {role: 'healer'};
        
            return {name, body, memory};
    }
};

module.exports = roleHealer;