var roleTemplate = {
	num: 2,

	/**@param {Creep} creep The creep object to run*/
	// What one tick means to the creep
	run: function(creep){ },
    // checks if the room needs to spawn a creep
    spawn: function(room) { },
    // returns an object with the data to spawn a new creep
    spawnData: function(room) {},
	// Gets the largest body we can
	getBody: function(segment, room){ }
};

module.exports = template;