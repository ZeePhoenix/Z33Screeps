const creepLogic = require("../../dist/main");
const { miner } = require("../../dist/main");

var roleMiner = {

    /** @param {Creep} creep **/
    run: function(creep){
		// Creep has just spawned, where is it going to live?
		if (!creep.memory.destination && !creep.memory.source){
			var containers = _.filter(creep.room.find(FIND_STRUCTURES), (s) => s.structureType == STRUCTURE_CONTAINER);
			//let miners = _.filter(Game.creeps, (c) => c.memory.role == 'miner' && c.my);
			//let sources = creep.room.find(FIND_SOURCES);
			//console.log(JSON.stringify(sources));
			_.forEach(containers, function(c){
				if (!c.pos.lookFor(LOOK_CREEPS).length){
					creep.memory.destination = c.id;
					creep.memory.source = c.pos.findClosestByRange(FIND_SOURCES).id;
				}
			});
		}
		if (!creep.memory.working){
			creep.zMove(creep.memory.destination, 0);
		}
		// Sit on our container, and mine
		if (creep.memory.working == true){
			// If we are full or about to die, deposit resources
			if (creep.store.getFreeCapacity() == 0 || creep.ticksToLive < 2){
				console.log(creep.transfer(Game.getObjectById(creep.memory.destination), RESOURCE_ENERGY));
			} else {
				creep.harvest(Game.getObjectById(creep.memory.source));
			}
		}
		
	},
    // checks if the room needs to spawn a creep
    spawn: function(room) {
        var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner' && creep.room.name == room.name);
		var containers = _.filter(room.find(FIND_STRUCTURES), (s) => s.structureType == STRUCTURE_CONTAINER);
		console.log(containers);
        console.log('Miner: ' + miners.length, room.name);
		console.log('Containers: '+ containers.length, room.name);

        if (miners.length < containers.length) {
			console.log('Need Miner');
            return true;
        }
    },
    // returns an object with the data to spawn a new creep
    spawnData: function(room) {
            let name = 'Miner' + Game.time;
            var bodySegment = [WORK];
			var body = this.getBody(bodySegment, room);
			if (body == 0) { return;}
            let memory = {role: 'miner', working: false, destination: false, source: false};
            return {name, body, memory};
    },
	// Returns the body for the creep based on the energy we have
	getBody: function(segment, room){
		var body = [];
		let segmentCost = _.sum(segment, s => BODYPART_COST[s]);
		let miners = _.filter(room.creeps, (c) => c.my && c.memory.role == 'miner');
		body.push(CARRY);
		body.push(MOVE);
		let maxSegments = Math.floor((room.energyAvailable - 100) / segmentCost);
		if (miners.length >= 1){
			maxSegments = Math.floor((room.energyCapacityAvailable - 100)/segmentCost);
		}
		if (maxSegments < 1) {return 0;}
		_.times(maxSegments, function(){
			_.forEach(segment, s => body.push(s));
		});
		return body;
	}
}

module.exports = roleMiner;