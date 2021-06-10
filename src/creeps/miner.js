const creepLogic = require("../../dist/main");
const { miner } = require("../../dist/main");

var roleMiner = {

    /** @param {Creep} creep **/
    run: function(creep){
		// Creep has just spawned, where is it going to live?
		if (!creep.memory.destination && !creep.memory.source){
			let containers = _.filter(Game.structures, (s) => s.my && s.room.name == room.name && s.structureType == StructureContainer);
			let miners = _.filter(Memory.creeps, (creep) => creep.memory.role == 'miner');
			let currentRoom = creep.room.name;
			let sources = Memory.rooms[currentRoom].resources[currentRoom].energy;
			console.log(JSON.stringify(sources));
			_.forEach(miners, function(m){
				for(let c of containers){
					if (m.pos != c.pos){
						creep.memory.destination = c.id;
						creep.memory.source = c.pos.findClosestByRange(sources).id;
					}
				}
			});
		}
		if (!creep.memory.working){
			creep.zMove(creep.memory.destination, 0);
		}
		// Sit on our container, and mine
		if (creep.memory.working == true && (creep.store.getFreeCapacity([]) == 0 || creep.ticksToLive < 2)){
			creep.transfer(Game.getObjectById(creep.memory.destination));
		}
	},
    // checks if the room needs to spawn a creep
    spawn: function(room) {
        var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner' && creep.room.name == room.name);
		var containers = _.filter(Game.structures, (s) => s.my && s.room.name == room.name && s.structureType == StructureContainer);
        console.log('Miner: ' + miners.length, room.name);

        if (miners.length < containers.length) {
            return true;
        }
    },
    // returns an object with the data to spawn a new creep
    spawnData: function(room) {
            let name = 'Miner' + Game.time;
            var bodySegment = [WORK];
			var body = this.getBody(bodySegment, room);
			body.push(CARRY, MOVE);
            let memory = {role: 'miner', working: false, destination: false, source: false};
            return {name, body, memory};
    },
	// Returns the body for the creep based on the energy we have
	getBody: function(segment, room){
		var body = [];
		let segmentCost = _.sum(segment, s => BODYPART_COST[s]);
		let miners = _.filter(room.creeps, (c) => c.my && c.memory.role == 'miner');
		let maxSegments = Math.floor((room.energyAvailable - 100) / segmentCost);
		if (miners.length >= 1){
			maxSegments = Math.floor((room.energyCapacityAvailable - 100)/segmentCost);
		}
		_.times(maxSegments, function(){
			_.forEach(segment, s => body.push(s));
		});
		return body;
	}
}

module.exports = roleMiner;