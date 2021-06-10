var roleBuilder = {
	num: 2,

	/**@param {Creep} creep */
	run: function(creep){
		if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0){
			creep.memory.working = false;
		}
		if(!creep.memory.working && creep.store.getFreeCapacity() == 0){
			creep.memory.working = true;
		}

		if (creep.memory.working){
			var targets = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
			let pTargets = _.filter(targets, (t) => t.structureType != STRUCTURE_ROAD);
			if (pTargets.length){
				var workDone = 0;
				var target;
				for (var name in pTargets){
					if (pTargets[name].progress >= workDone) {
						workDone = pTargets[name].progress;
						target = pTargets[name];
					}
				}
				creep.zMove(target, 2);
			} else {
				let bTargets = _.filter(targets, (t) => t.structureType == STRUCTURE_ROAD);
				var workDone = 0;
				var target;
				for (var name in bTargets){
					if (targets[name].progress >= workDone) {
						workDone = targets[name].progress;
						target = targets[name];
					}
				}
				creep.zMove(target, 2);
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
            let memory = {role: 'builder'};
        
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