const creepLogic = require("../creeps");
const { spawning } = require("../room");

Creep.prototype.debug = true;

// Move to our stored destination, and if in range, do the job
Creep.prototype.zMove = function zMove(t, r){
	let storedDest = Game.getObjectById(t);
	if (storedDest) {
		if(this.pos.inRangeTo(storedDest, r)){
			this.doJob(storedDest);
		} else {
			if (this.debug) {
				this.moveTo(storedDest, {visualizePathStyle: {stroke: '#ffaa00'}});
			} else {
				this.moveTo(storedDest);
			}
		}
	}
}

// Has the creep do the defined job action
Creep.prototype.doJob = function doJob(t){
	switch(this.memory.role){
		case 'harvester': this.transfer(t, RESOURCE_ENERGY); break;
		case 'builder': this.build(t); break;
		case 'upgrader': this.upgradeController(t); break;
		case 'healer': this.repair(t); break;
		case 'miner': console.log(this.name, ' has reached the intended location.'); this.memory.working = true; break;
	}
}

// Gets energy for the creep
Creep.prototype.getEnergy = function getEnergy(){
	let gameObj;
	switch(this.memory.role) {
		case 'harvester':
			//Set our memory source if we need
			if (this.memory.source == false) {
				this.findEnergySource();
			}
			// Get our memory source and Go
			gameObj = Game.getObjectById(this.memory.source);
			if (this.pos.isNearTo(gameObj)){
				this.harvest(gameObj);
			} else {
				this.moveTo(gameObj);
			}
			break;
		default: 
			//Set our memory source if we need
			if (this.memory.source == false) {
				this.findEnergyStructure();
				break;
			}
			gameObj = Game.getObjectById(this.memory.source);
			// Make sure we can get energy from here
			if (gameObj.energyCapacityAvaliable < this.store.getFreeCapacity([RESOURCE_ENERGY])){
				this.findEnergyStructure();
				break;
			}
			// Go get our energy
			if (this.pos.isNearTo(gameObj)){
				if (gameObj.structureType != undefined){
					this.withdraw(gameObj, RESOURCE_ENERGY);
				} else {
					this.harvest(gameObj);
				}
			} else {
				this.moveTo(gameObj);
			}
			break;
	}
}

// Find us an energy source
Creep.prototype.findEnergySource = function findEnergySource(){
	let sources = this.room.find(FIND_SOURCES_ACTIVE);
	if (sources.length){
		let source = _.find(sources, function(s){
			return s.pos.getOpenPositions(1).length > 0;
		});
		if (source) {
			this.memory.source = source.id;
		}
	}
}

// Find a structure to get energy from
Creep.prototype.findEnergyStructure = function findEnergyStructure(){
	var sources = this.room.find(FIND_STRUCTURES);
	sources = _.filter(sources, (struct) => struct.structureType == STRUCTURE_STORAGE || struct.structureType == STRUCTURE_CONTAINER)
	if (sources.length > 0){
		let source = _.find(sources, (s) => s.store.getUsedCapacity([RESOURCE_ENERGY]) >= this.store.getCapacity([RESOURCE_ENERGY]));
		if (source != undefined ){
			this.memory.source = source.id;
		} else {
			this.findEnergySource();
		}
	} else {
		this.findEnergySource();
	}
}

// Returns a possible target location based on a list of priorities
Creep.prototype.findPriority = function(list, queue){
	// Iterate through the queue
	// Check each one in order
	// If we find one, return the priority
	let prio = undefined;
	for(let i = 0; i < queue.length; i++){
		prio = _.find(list, (l) => l.structureType == queue[i]);
		if (prio != undefined){ return prio.id; }
	}
	return prio;
}