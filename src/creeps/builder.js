var roleBuilder = {
	/**@param {Creep} creep */
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
			var targets = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
			if (targets.length){
				var workDone = 0;
				var target;
				for (var name in targets){
					if (targets[name].progress >= workDone) {
						workDone = targets[name].progress;
						target = targets[name];
					}
				}
				if (creep.build(target) == ERR_NOT_IN_RANGE){
					creep.moveZ(target, true);
				}
			}
		} else {
			creep.getEnergy();
		}
	},
    // checks if the room needs to spawn a creep
    spawn: function(room) {
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder' && creep.room.name == room.name);
        console.log('Builder: ' + upgraders.length, room.name);

        if (upgraders.length < 4 && (_.filter(Game.creeps, (creep) => creep.memory.role == 'harvester' && creep.room.name == room.name).length > 0)) {
            return true;
        }
    },
    // returns an object with the data to spawn a new creep
    spawnData: function(room) {
            let name = 'Builder' + Game.time;
            let body = [WORK, WORK, CARRY, MOVE];
            let memory = {role: 'builder'};
        
            return {name, body, memory};
    }
};

module.exports = roleBuilder;