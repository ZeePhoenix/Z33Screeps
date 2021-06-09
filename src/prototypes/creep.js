Creep.prototype.moveZ = function moveZ(t){
	if (this.debug) {
		this.moveTo(t, {visualizePathStyle: {stroke: '#ffaa00'}});
	} else {
		this.moveTo(t);
	}
}

Creep.prototype.getEnergy = function getEnergy(){
	let storedSource = Game.getObjectById(this.memory.source);

	if (!storedSource && (!storedSource.pos.getOpenPositions().length || !this.pos.isNearTo(storedSource))){
		delete this.memory.source;
		storedSource = this.findEnergySource();
	} 

	if (storedSource){
		if (this.pos.isNearTo(storedSource)){
			this.harvest(storedSource);
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

Creep.prototype.debug = true;