Creep.prototype.moveZ = function moveZ(t){
	if (this.debug) {
		this.moveTo(t, {visualizePathStyle: {stroke: '#ffaa00'}});
	} else {
		this.moveTo(t);
	}
}

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
			this.moveZ(storedSource);
		}
	} else if (storedSource && storedSource.hits != null){
		if (this.pos.isNearTo(storedSource)){
			this.withdraw(storedSource, RESOURCE_ENERGY);
		} else {
			this.moveZ(storedSource);
		}
	}
}

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

Creep.prototype.debug = true;