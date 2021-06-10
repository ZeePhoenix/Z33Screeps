let creepLogic = require('./creeps');
let roomLogic = require('./room');
let prototypes = require('./prototypes');

module.exports.loop = function () {
	console.log('---------------- $(Game.time) ---------------------'.replace('$(Game.time)', Game.time));
    // make a list of all of our rooms
    Game.myRooms = _.filter(Game.rooms, r => r.controller && r.controller.level > 0 && r.controller.my);

    // run spwan logic for each room in our empire run only every X ticks
	if (Game.time % 8 == 0) {
		_.forEach(Game.myRooms, r => roomLogic.spawning(r));
	}

	if (Game.time % 100 == 0) {
		console.log('Finding Room Sources')
		_.forEach(Game.myRooms, r => roomLogic.identifySources(r));
	}
    
    // run each creep role see /creeps/index.js
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];

        let role = creep.memory.role;
        if (creepLogic[role]) {
            creepLogic[role].run(creep);
        }
    }

    // free up memory if creep no longer exists
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
}