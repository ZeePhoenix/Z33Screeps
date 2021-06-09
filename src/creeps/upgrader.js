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

        if (upgraders.length < 4 && (_.filter(Game.creeps, (creep) => creep.memory.role == 'harvester' && creep.room.name == room.name).length > 0)) {
            return true;
        }
    },
    // returns an object with the data to spawn a new creep
    spawnData: function(room) {
            let name = 'Upgrader' + Game.time;
            let body = [WORK, CARRY, MOVE, MOVE];
            let memory = {role: 'upgrader'};
        
            return {name, body, memory};
    }
};

module.exports = roleUpgrader;