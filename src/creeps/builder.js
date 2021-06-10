var roleBuilder = {
	num: 2,

	/**@param {Creep} creep */
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
			let targets = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
			let prioTargets = _.filter(targets, (t) => t.structureType != STRUCTURE_ROAD);
			let attempt = _.find(prioTargets, (t) => t.progress > 0);
			if (attempt != undefined){
				creep.memory.destination = attempt.id;
			} else {
				let bAttempt = _.find(prioTargets, (t) => t.progress == 0);
				if (bAttempt != undefined) {
					creep.memory.destination = bAttempt.id;
				}else {
					let roadTargets = _.filter(targets, (t) => t.structureType != STRUCTURE_ROAD);
					let rAttempt = _.find(roadTargets, (t) => t.progress > 0);
					if (rAttempt != undefined) {
						creep.memory.destination = rAttempt.id;
					} else {
						creep.memory.destination = _.find(targets, (t) => t.progress == 0).id;
					}
				}
			}
			console.log(creep.memory.destination);
		}
		// We must need energy
		if (creep.memory.working && creep.memory.destination != false){
			// Make sure our destination needs work
			let workSite = Game.getObjectById(creep.memory.destination);
			if (workSite.progress == workSite.progressTotal){
				creep.memory.destination = false;
			} else {
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
            let bodySegment = [WORK, CARRY, MOVE];
			var body = this.getBody(bodySegment, room);
            let memory = {role: 'builder', working: false, destination: false};
        
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