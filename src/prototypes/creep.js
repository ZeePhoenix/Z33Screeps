Creep.prototype.debug = true;

// Allows for drawing of move path based on debug
Creep.prototype.zMove = function zMove(t){
	if(this.pos.isNearTo(t)){
		this.doJob(t);
	} else {
		if (this.debug) {
			this.moveTo(t, {visualizePathStyle: {stroke: '#ffaa00'}});
		} else {
			this.moveTo(t);
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
	}
}

// Gets energy for the creep
Creep.prototype.getEnergy = function getEnergy(){
	let storedSource = Game.getObjectById(this.memory.source);
	if (this.memory.role == 'harvester' && (!storedSource || (!storedSource.pos.getOpenPositions().length && !this.pos.isNearTo(storedSource)))){
		delete this.memory.source;
		storedSource = this.findEnergySource();
	} else if (!storedSource || (!storedSource.pos.getOpenPositions().length && !this.pos.isNearTo(storedSource))){
		delete this.memory.source;
		storedSource = this.findEnergyStructure();
	}
	if (storedSource && storedSource.hits == null){
		if (this.pos.isNearTo(storedSource)){
			this.harvest(storedSource);
		} else {
			this.moveTo(storedSource);
		}
	} else if (storedSource && storedSource.hits != null){
		if (this.pos.isNearTo(storedSource)){
			this.withdraw(storedSource, RESOURCE_ENERGY);
		} else {
			this.moveTo(storedSource);
		}
	}
}

// Find us an energy source
Creep.prototype.findEnergySource = function findEnergySource(){
	let sources = this.room.find(FIND_SOURCES_ACTIVE);
	if (sources.length){
		let source = _.find(sources, function(s){
			return s.pos.getOpenPositions().length > 0;
		});
		if (source) {
			this.memory.source = source.id;
			return source;
		}
	}
}

// Find a structure to get energy from
Creep.prototype.findEnergyStructure = function findEnergyStructure(){
	let sources = this.room.find(FIND_MY_STRUCTURES);
	if (_.filter(sources, (struct) => struct.structureType == STRUCTURE_STORAGE).length == 0) {
		return this.findEnergySource()
	}
	if (sources.length){
		let source = _.find(sources, function(s){
			return (s.pos.getOpenPositions().length > 0 && s.structureType == STRUCTURE_STORAGE);
		});
		if (source) {
			this.memory.source = source.id;
			return source;
		}
	}
}