var shuttle = {
	// TODO: this should be programatically decided
	num: 2,

    /** @param {Creep} creep **/
    run: function(creep){
		// If we are dropping off Energy and empty, go Mine
		if (creep.memory.working && creep.store.getUsedCapacity([RESOURCE_ENERGY]) == 0){
			//creep.memory.working = false;
			creep.memory.source = false;
		}
		// If we are Filling up on Energy and full, go work
		if (!creep.memory.working && creep.store.getFreeCapacity({RESOURCE_ENERGY}) == 0){
			creep.memory.working = true;
			creep.memory.destination = false;
		}

		if (creep.memory.working && !creep.memory.destination) {
			let targets = creep.room.find(FIND_STRUCTURES);
			let prioTargets = _.filter(targets, (t) => (t.structureType == STRUCTURE_SPAWN || t.structureType == STRUCTURE_EXTENSION || t.structureType == STRUCTURE_TOWER));
			let attempt = _.find(prioTargets, (t) => t.store.getFreeCapacity([RESOURCE_ENERGY]) > 0);
			console.log(attempt);
			if (attempt != undefined){
				creep.memory.destination = attempt.id;
			} else {
				return;
			}
		}
		// Ensure our workSite is accurate, and then get to it
		if (creep.memory.working && creep.memory.destination != false){
			let workSite = Game.getObjectById(creep.memory.destination);
			if (workSite == null || workSite.store.getFreeCapacity([RESOURCE_ENERGY]) == 0){
				creep.memory.destination = false;
			} else {
				creep.zMove(workSite.id, 1);
			}
			return;
		} 
		// Otherwise, fill up that gass
		else {
			creep.getEnergy();
			return;
		}
	},
    // checks if the room needs to spawn a creep
    spawn: function(room) {
        var shuttles = _.filter(Game.creeps, (creep) => creep.memory.role == 'shuttle' && creep.room.name == room.name);
		let miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner' && creep.room.name == room.name);
        console.log('Shuttles: ' + shuttles.length, room.name);

        if (shuttles.length < this.num && miners.length > 0) {
            return true;
        }
    },
    // returns an object with the data to spawn a new creep
    spawnData: function(room) {
            let name = 'Shuttle' + Game.time;
            var bodySegment = [CARRY, MOVE];
			var body = this.getBody(bodySegment, room);
            let memory = {role: 'shuttle', working: true, destination: false, source: false};
            return {name, body, memory};
    },

	getBody: function(segment, room){
		var body = [];
		let segmentCost = _.sum(segment, s => BODYPART_COST[s]);
		let shuttles = _.filter(room.creeps, (c) => c.my && c.memory.role == 'shuttle');
		let maxSegments = Math.floor(room.energyAvailable / segmentCost);
		if (shuttles.length >= 1){
			maxSegments = Math.floor(room.energyCapacityAvailable/segmentCost);
		}
		_.times(maxSegments, function(){
			_.forEach(segment, s => body.push(s));
		});
		console.log(JSON.stringify(body));
		return body;
	}
}

module.exports = shuttle;