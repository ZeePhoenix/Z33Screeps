Creep.prototype.moveZ = function moveZ(t, display){
	if (display) {
		this.moveTo(t, {visualizePathStyle: {stroke: '#fff'}});
	} else {
		this.moveTo(t);
	}
}

Creep.prototype.getEnergy = function getEnergy(){
	let source = Game.getObjectById(this.memory.source) || this.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
	this.memory.source = source.id;
	if(this.harvest(source) == ERR_NOT_IN_RANGE) {
		this.moveZ(source, true);
	}
}

Creep.prototype.speaking = function speaking(){
	return false;
}