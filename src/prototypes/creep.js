Creep.prototype.sayHello = function sayHello() {
    this.say("Hello", true);
}

Creep.prototype.moveZ = function moveZ(t, display){
	if (display) {
		this.moveTo(t, {visualizePathStyle: {stroke: '#fff'}});
	} else {
		this.moveTo(t);
	}
}