var harvester = {
	num: 3,

    /** @param {Creep} creep **/
    run: function(creep){
		if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0){
			creep.memory.working = false;
		}
		if(!creep.memory.working && creep.store.getFreeCapacity([RESOURCE_ENERGY]) == 0){
			creep.memory.working = true;
		}

		if (creep.memory.working && !creep.memory.destination){
			var targets = creep.room.find(FIND_MY_STRUCTURES);
			// Only deliver energy to these structures if they need energy
			targets = _.filter(targets, function(struct){
				return (struct.structureType == STRUCTURE_STORAGE || struct.structureType == STRUCTURE_EXTENSION 
					|| struct.structureType == STRUCTURE_SPAWN || struct.structureType == STRUCTURE_CONTAINER)});
			// We have somewhere to go
			if(targets.length){
				var resources = 0;
				var target;
				for(let t of targets){
					if(t.store.getFreeCapacity([RESOURCE_ENERGY]) > resources ){
						target = t;
						resources = t.store.getFreeCapacity([RESOURCE_ENERGY]);
					}
				}
				// Get it done
				creep.zMove(target, 1);
			} else {
				creep.zMove(Game.getObjectById(creep.memory.destination), 1);
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

        if (harvesters.length < this.num) {
            return true;
        }
    },
    // returns an object with the data to spawn a new creep
    spawnData: function(room) {
            let name = 'Harvester' + Game.time;
            var bodySegment = [WORK, CARRY, MOVE];
			var body = this.getBody(bodySegment, room);
            let memory = {role: 'harvester'};
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