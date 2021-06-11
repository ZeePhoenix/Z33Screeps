var roleBuilder = {
	num: 2,

	/**@param {Creep} creep */
	run: function(creep){
		if (!creep.memory.working && creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0){
			creep.getEnergy();
			return;
		}

		// If we are BUILDING and empty, go Mine
		if (creep.memory.working && creep.store.getUsedCapacity([RESOURCE_ENERGY]) == 0){
			creep.memory.working = false;
			creep.memory.source = false;
		}
		// If we are Filling up on Energy and full, go work
		if (!creep.memory.working && creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0){
			creep.memory.working = true;
			creep.memory.destination = false;
		}

		if (creep.memory.working && !creep.memory.destination) {
			// Get our valid targets
			let targets = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
			let priorityList = [STRUCTURE_EXTENSION, STRUCTURE_CONTAINER, STRUCTURE_WALL, STRUCTURE_RAMPART, STRUCTURE_ROAD];
			let possible = creep.findPriority(targets, priorityList);
			creep.memory.destination = possible;
			return;
		}
		// Let's get to work
		if (creep.memory.working && creep.memory.destination != false){
			// Make sure our destination needs work
			let workSite = Game.getObjectById(creep.memory.destination);
			if (workSite == null || workSite.progress == workSite.progreSssTotal){
				creep.memory.destination = false;
			} else if (workSite){
				creep.zMove(workSite.id, 2);
			}
		} else {
			creep.getEnergy();
		}

	},
    // checks if the room needs to spawn a creep
    spawn: function(room) {
        let upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder' && creep.room.name == room.name);
		let constructions = _.filter(Game.constructionSites, (site) => site.room.name == room.name);
        console.log('Builder: ' + upgraders.length, room.name);

        if (upgraders.length < this.num && constructions.length > 0) {
            return true;
        }
    },
    // returns an object with the data to spawn a new creep
    spawnData: function(room) {
            let name = 'Builder' + Game.time;
            let bodySegment = [WORK, CARRY, MOVE, MOVE];
			var body = this.getBody(bodySegment, room);
            let memory = {role: 'builder', working: false, destination: false, source: false};
        
            return {name, body, memory};
    },
	// Gets the larges body we can
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

module.exports = roleBuilder;