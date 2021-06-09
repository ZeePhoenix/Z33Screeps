var harvester = {

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
				return (struct.structureType == STRUCTURE_CONTAINER || struct.structureType == STRUCTURE_EXTENSION || struct.structureType == STRUCTURE_SPAWN || struct.structureType == STRUCTURE_TOWER) && struct.store.getFreeCapacity(RESOURCE_ENERGY) > 0; });
			// We have somewhere to go
			if(targets.length){
				// Find closest target to creep
				let target = creep.pos.findClosestByRange(targets);
				// Transfer energy if we're there, else move to it
				if(creep.pos.isNearTo(target)){
					creep.transfer(target, RESOURCE_ENERGY);
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
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester' && creep.room.name == room.name);
        console.log('Harvesters: ' + harvesters.length, room.name);

        if (harvesters.length < 4) {
            return true;
        }
    },
    // returns an object with the data to spawn a new creep
    spawnData: function(room) {
            let name = 'Harvester' + Game.time;
            let body = [WORK, CARRY, MOVE, MOVE];
            let memory = {role: 'harvester'};
        
            return {name, body, memory};
    }
};

module.exports = harvester;