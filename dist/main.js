/* This header is placed at the beginning of the output file and defines the
	special `__require`, `__getFilename`, and `__getDirname` functions.
*/
(function() {
	/* __modules is an Array of functions; each function is a module added
		to the project */
var __modules = {},
	/* __modulesCache is an Array of cached modules, much like
		`require.cache`.  Once a module is executed, it is cached. */
	__modulesCache = {},
	/* __moduleIsCached - an Array of booleans, `true` if module is cached. */
	__moduleIsCached = {};
/* If the module with the specified `uid` is cached, return it;
	otherwise, execute and cache it first. */
function __require(uid, parentUid) {
	if(!__moduleIsCached[uid]) {
		// Populate the cache initially with an empty `exports` Object
		__modulesCache[uid] = {"exports": {}, "loaded": false};
		__moduleIsCached[uid] = true;
		if(uid === 0 && typeof require === "function") {
			require.main = __modulesCache[0];
		} else {
			__modulesCache[uid].parent = __modulesCache[parentUid];
		}
		/* Note: if this module requires itself, or if its depenedencies
			require it, they will only see an empty Object for now */
		// Now load the module
		__modules[uid].call(this, __modulesCache[uid], __modulesCache[uid].exports);
		__modulesCache[uid].loaded = true;
	}
	return __modulesCache[uid].exports;
}
/* This function is the replacement for all `__filename` references within a
	project file.  The idea is to return the correct `__filename` as if the
	file was not concatenated at all.  Therefore, we should return the
	filename relative to the output file's path.

	`path` is the path relative to the output file's path at the time the
	project file was concatenated and added to the output file.
*/
function __getFilename(path) {
	return require("path").resolve(__dirname + "/" + path);
}
/* Same deal as __getFilename.
	`path` is the path relative to the output file's path at the time the
	project file was concatenated and added to the output file.
*/
function __getDirname(path) {
	return require("path").resolve(__dirname + "/" + path + "/../");
}
/********** End of header **********/
/********** Start module 0: D:\git\Z33Screeps\src\main.js **********/
__modules[0] = function(module, exports) {
let creepLogic = __require(1,0);
let roomLogic = __require(2,0);
let prototypes = __require(3,0);

module.exports.loop = function () {
	console.log('---------------- $(Game.time) ---------------------'.replace('$(Game.time)', Game.time));
    Game.myRooms = _.filter(Game.rooms, r => r.controller && r.controller.level > 0 && r.controller.my);
	if (Game.time % 12 == 0) {
		_.forEach(Game.myRooms, r => roomLogic.spawning(r));
	}

	if (Game.time % 50 == 0) {
		console.log('Finding Room Sources')
		_.forEach(Game.myRooms, r => roomLogic.identifySources(r));
	}
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];

        let role = creep.memory.role;
        if (creepLogic[role]) {
            creepLogic[role].run(creep);
        }
    }
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
}
return module.exports;
}
/********** End of module 0: D:\git\Z33Screeps\src\main.js **********/
/********** Start module 1: D:\git\Z33Screeps\src\creeps\index.js **********/
__modules[1] = function(module, exports) {
let creepLogic = {
    harvester:     	__require(4,1),
    miner:			__require(5,1),
	shuttle:		__require(6,1),
	upgrader:      	__require(7,1),
	builder:      	__require(8,1),
	healer:			__require(9,1),
}

module.exports = creepLogic;
return module.exports;
}
/********** End of module 1: D:\git\Z33Screeps\src\creeps\index.js **********/
/********** Start module 2: D:\git\Z33Screeps\src\room\index.js **********/
__modules[2] = function(module, exports) {
let roomLogic = {
    spawning:     __require(10,2),

	identifySources: function(room){
		if (!room.memory.resources){
			room.memory.resources = {};
		}
		if (!room.memory.resources[room.name]){
			let sources = room.find(FIND_SOURCES);
	
			_.forEach(sources, function(source){
				let data = _.get(room.memory, ['resources', room.name, 'energy', source.id]);
				if (data == undefined) {
					_.set(room.memory, ['resources', room.name, 'energy', source.id], {});
					console.log(room.memory);
				}
			});
		}
		
	},

	
}

module.exports = roomLogic;
return module.exports;
}
/********** End of module 2: D:\git\Z33Screeps\src\room\index.js **********/
/********** Start module 3: D:\git\Z33Screeps\src\prototypes\index.js **********/
__modules[3] = function(module, exports) {
let files = {
    creep: 	__require(11,3),
	roomPosition:	__require(12,3),
}
return module.exports;
}
/********** End of module 3: D:\git\Z33Screeps\src\prototypes\index.js **********/
/********** Start module 4: D:\git\Z33Screeps\src\creeps\harvester.js **********/
__modules[4] = function(module, exports) {
var harvester = {
	num: 2,

    /** @param {Creep} creep **/
    run: function(creep){
		if (creep.memory.working && creep.store.getUsedCapacity([RESOURCE_ENERGY]) == 0){
			creep.memory.working = false;
			creep.memory.source = false;
		}
		if (!creep.memory.working && (creep.store.getUsedCapacity([RESOURCE_ENERGY]) == creep.store.getCapacity([RESOURCE_ENERGY]))){
			creep.memory.working = true;
			creep.memory.destination = false;
		}

		if (creep.memory.working && !creep.memory.destination) {
			let targets = creep.room.find(FIND_STRUCTURES);
			let prioTargets = _.filter(targets, (t) => (t.structureType == STRUCTURE_SPAWN || t.structureType == STRUCTURE_EXTENSION));
			let attempt = _.find(prioTargets, (t) => t.store.getFreeCapacity([RESOURCE_ENERGY]) > 0);
			if (attempt != undefined){
				creep.memory.destination = attempt.id;
			} else {
				let secTargets = _.filter(targets, (t) => (t.structureType == STRUCTURE_CONTAINER || t.structureType == STRUCTURE_STORAGE));
				let bAttempt = _.find(secTargets, (t) => t.store.getFreeCapacity([RESOURCE_ENERGY]) > 0);
				if (bAttempt != undefined) {
					creep.memory.destination = bAttempt.id;
				}
			}
		}
		if (creep.memory.working && creep.memory.destination != false){
			let workSite = Game.getObjectById(creep.memory.destination);
			if (workSite == null || workSite.store.getFreeCapacity([RESOURCE_ENERGY]) == 0){
				creep.memory.destination = false;
			} else {
				creep.zMove(workSite.id, 1);
			}
		} 
		else {
			creep.getEnergy();
		}
	},
    spawn: function(room) {
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester' && creep.room.name == room.name);
		let miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner' && creep.room.name == room.name);
        console.log('Harvesters: ' + harvesters.length, room.name);

        if (harvesters.length < this.num && miners.length == 0 ) {
            return true;
        }
    },
    spawnData: function(room) {
            let name = 'Harvester' + Game.time;
            var bodySegment = [WORK, CARRY, MOVE];
			var body = this.getBody(bodySegment, room);
            let memory = {role: 'harvester', working: false, destination: false, source: false};
            return {name, body, memory};
    },

	getBody: function(segment, room){
		var body = [];
		let segmentCost = _.sum(segment, s => BODYPART_COST[s]);
		let harvesters = _.filter(room.creeps, (c) => c.my && c.memory.role == 'harvester');
		let maxSegments = Math.floor(room.energyAvailable / segmentCost);
		if (harvesters.length >= 1){
			maxSegments = Math.floor(room.energyCapacityAvailable/segmentCost);
		}
		_.times(maxSegments, function(){
			_.forEach(segment, s => body.push(s));
		});
		console.log(JSON.stringify(body));
		return body;
	}
}

module.exports = harvester;
return module.exports;
}
/********** End of module 4: D:\git\Z33Screeps\src\creeps\harvester.js **********/
/********** Start module 5: D:\git\Z33Screeps\src\creeps\miner.js **********/
__modules[5] = function(module, exports) {
const creepLogic = __require(13,5);
const { miner } = __require(13,5);

var roleMiner = {

    /** @param {Creep} creep **/
    run: function(creep){
		if (!creep.memory.destination && !creep.memory.source){
			var containers = _.filter(creep.room.find(FIND_STRUCTURES), (s) => s.structureType == STRUCTURE_CONTAINER);
			let miners = _.filter(Game.creeps, (c) => c.memory.role == 'miner' && c.my);
			let sources = creep.room.find(FIND_SOURCES);
			_.forEach(containers, function(c){
				if (!c.pos.lookFor(LOOK_CREEPS)){
					creep.memory.destination = c.id;
					creep.memory.source = c.pos.findClosestByRange(FIND_SOURCES).id;
				}
			});
		}
		if (!creep.memory.working){
			creep.zMove(creep.memory.destination, 0);
		}
		if (creep.memory.working == true){
			if (creep.store.getFreeCapacity() == 0 || creep.ticksToLive < 2){
				console.log(creep.transfer(Game.getObjectById(creep.memory.destination), RESOURCE_ENERGY));
			} else {
				creep.harvest(Game.getObjectById(creep.memory.source));
			}
		}
		
	},
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
    spawnData: function(room) {
            let name = 'Miner' + Game.time;
            var bodySegment = [WORK];
			var body = this.getBody(bodySegment, room);
			if (body == 0) { return;}
            let memory = {role: 'miner', working: false, destination: false, source: false};
            return {name, body, memory};
    },
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
return module.exports;
}
/********** End of module 5: D:\git\Z33Screeps\src\creeps\miner.js **********/
/********** Start module 6: D:\git\Z33Screeps\src\creeps\shuttle.js **********/
__modules[6] = function(module, exports) {
var shuttle = {
	num: 2,

    /** @param {Creep} creep **/
    run: function(creep){
		if (!creep.memory.working && creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0){
			let sources = _.filter(creep.room.find(FIND_STRUCTURES), (s) => s.structureType == STRUCTURE_CONTAINER && s.store.getUsedCapacity(RESOURCE_ENERGY) >= 50);
			console.log(JSON.stringify(sources));
			if (sources.length == 1){
				creep.memory.source = sources[0].id;
			} else if (sources.length == 0){
			} else {
				let largest = 0;
				let amt = -1;
				_.forEach(sources, function(s){
					if (s.store.getUsedCapacity([RESOURCE_ENERGY]) > amt){
						largest = sources.findIndex(s);
						amt = s.store.getUsedCapacity([RESOURCE_ENERGY]);
					}	
				});
				creep.memory.source = sources[largest].id;
			}
		}
		if (creep.memory.working && creep.store.getUsedCapacity([RESOURCE_ENERGY]) == 0){
			creep.memory.working = false;
			creep.memory.source = false;
		}
		if (!creep.memory.working && creep.store.getFreeCapacity([RESOURCE_ENERGY]) < 50){
			creep.memory.working = true;
			creep.memory.destination = false;
		}

		if (creep.memory.working && !creep.memory.destination) {
			let targets = creep.room.find(FIND_STRUCTURES);
			let prioTargets = _.filter(targets, (t) => (t.structureType == STRUCTURE_SPAWN || t.structureType == STRUCTURE_EXTENSION || t.structureType == STRUCTURE_TOWER));
			let attempt = _.find(prioTargets, (t) => t.store.getFreeCapacity([RESOURCE_ENERGY]) > 0);
			console.log(attempt);
			if (attempt != undefined){
				creep.memory.destination = attempt.id;
			} else {
				return;
			}
		}
		if (creep.memory.working && creep.memory.destination != false){
			let workSite = Game.getObjectById(creep.memory.destination);
			if (workSite == null || workSite.store.getFreeCapacity([RESOURCE_ENERGY]) == 0){
				creep.memory.destination = false;
			} else {
				creep.zMove(workSite.id, 1);
			}
			return;
		} 
		else {
			creep.getEnergy();
			return;
		}
	},
    spawn: function(room) {
        var shuttles = _.filter(Game.creeps, (creep) => creep.memory.role == 'shuttle' && creep.room.name == room.name);
		let miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner' && creep.room.name == room.name);
        console.log('Shuttles: ' + shuttles.length, room.name);

        if (shuttles.length < this.num && miners.length > 0) {
            return true;
        }
    },
    spawnData: function(room) {
            let name = 'Shuttle' + Game.time;
            var bodySegment = [CARRY, MOVE];
			var body = this.getBody(bodySegment, room);
            let memory = {role: 'shuttle', working: true, destination: false, source: false};
            return {name, body, memory};
    },

	getBody: function(segment, room){
		var body = [];
		let segmentCost = _.sum(segment, s => BODYPART_COST[s]);
		let shuttles = _.filter(room.creeps, (c) => c.my && c.memory.role == 'shuttle');
		let maxSegments = Math.floor(room.energyAvailable / segmentCost);
		if (shuttles.length >= 1){
			maxSegments = Math.floor(room.energyCapacityAvailable/segmentCost);
		}
		_.times(maxSegments, function(){
			_.forEach(segment, s => body.push(s));
		});
		console.log(JSON.stringify(body));
		return body;
	}
}

module.exports = shuttle;
return module.exports;
}
/********** End of module 6: D:\git\Z33Screeps\src\creeps\shuttle.js **********/
/********** Start module 7: D:\git\Z33Screeps\src\creeps\upgrader.js **********/
__modules[7] = function(module, exports) {
var roleUpgrader = {
	num: 2,

    /** @param {Creep} creep **/
    run: function(creep) {
		if (creep.memory.working && creep.store.getUsedCapacity([RESOURCE_ENERGY]) == 0){
			creep.memory.working = false;
			creep.memory.source = false;
		}
		if (!creep.memory.working && (creep.store.getUsedCapacity([RESOURCE_ENERGY]) == creep.store.getCapacity([RESOURCE_ENERGY]))){
			creep.memory.working = true;
			creep.memory.destination = false;
		}

		if (creep.memory.working && !creep.memory.destination) {
			creep.memory.destination = creep.room.controller.id;
		}
		if (creep.memory.working && creep.memory.destination != false){
			creep.zMove(creep.memory.destination, 2);
		} else {
			creep.getEnergy();
		}
    },
    spawn: function(room) {
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader' && creep.room.name == room.name);
        console.log('Upgraders: ' + upgraders.length, room.name);

        if (upgraders.length < this.num ) {
            return true;
        }
    },
    spawnData: function(room) {
            let name = 'Upgrader' + Game.time;
            let bodySegment = [WORK, CARRY, MOVE];
			var body = this.getBody(bodySegment, room);
            let memory = {role: 'upgrader', working: false, destination: false, source: false};
        
            return {name, body, memory};
    },

	getBody: function(segment, room){
		var body = [];
		let segmentCost = _.sum(segment, s => BODYPART_COST[s]);
		let upgraders = _.filter(room.creeps, (c) => c.my && c.memory.role == 'upgrader');
		let maxSegments = Math.floor(room.energyAvailable / segmentCost);
		if (upgraders.length >= 1){
			maxSegments = Math.floor(room.energyCapacityAvailable/segmentCost);
		}
		_.times(maxSegments, function(){
			_.forEach(segment, s => body.push(s));
		});
		console.log(JSON.stringify(body));
		return body;
	}
};

module.exports = roleUpgrader;
return module.exports;
}
/********** End of module 7: D:\git\Z33Screeps\src\creeps\upgrader.js **********/
/********** Start module 8: D:\git\Z33Screeps\src\creeps\builder.js **********/
__modules[8] = function(module, exports) {
var roleBuilder = {
	num: 2,

	/**@param {Creep} creep */
	run: function(creep){
		if (!creep.memory.working && creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0){
			creep.getEnergy();
			return;
		}
		if (creep.memory.working && creep.store.getUsedCapacity([RESOURCE_ENERGY]) == 0){
			creep.memory.working = false;
			creep.memory.source = false;
		}
		if (!creep.memory.working && creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0){
			creep.memory.working = true;
			creep.memory.destination = false;
		}

		if (creep.memory.working && !creep.memory.destination) {
			let targets = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
			let priorityList = [STRUCTURE_EXTENSION, STRUCTURE_CONTAINER, STRUCTURE_WALL, STRUCTURE_RAMPART, STRUCTURE_ROAD];
			let possible = creep.findPriority(targets, priorityList);
			creep.memory.destination = possible;
			return;
		}
		if (creep.memory.working && creep.memory.destination != false){
			let workSite = Game.getObjectById(creep.memory.destination);
			if (workSite == null || workSite.progress == workSite.progreSssTotal){
				creep.memory.destination = false;
			} else if (workSite){
				creep.zMove(workSite.id, 2);
			}
		} else {
			creep.getEnergy();
		}

	},
    spawn: function(room) {
        let upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder' && creep.room.name == room.name);
		let constructions = _.filter(Game.constructionSites, (site) => site.room.name == room.name);
        console.log('Builder: ' + upgraders.length, room.name);

        if (upgraders.length < this.num && constructions.length > 0) {
            return true;
        }
    },
    spawnData: function(room) {
            let name = 'Builder' + Game.time;
            let bodySegment = [WORK, CARRY, MOVE, MOVE];
			var body = this.getBody(bodySegment, room);
            let memory = {role: 'builder', working: false, destination: false, source: false};
        
            return {name, body, memory};
    },
	getBody: function(segment, room){
		var body = [];
		let segmentCost = _.sum(segment, s => BODYPART_COST[s]);
		let energyAvailable = room.energyAvailable;
		let maxSegments = Math.floor(energyAvailable / segmentCost);
		_.times(maxSegments, function(){
			_.forEach(segment, s => body.push(s));
		});
		return body;
	}
};

module.exports = roleBuilder;
return module.exports;
}
/********** End of module 8: D:\git\Z33Screeps\src\creeps\builder.js **********/
/********** Start module 9: D:\git\Z33Screeps\src\creeps\healer.js **********/
__modules[9] = function(module, exports) {
var roleHealer = {
	num: 2,
	range: 2,

    /** @param {Creep} creep **/
    run: function(creep){
		if (creep.memory.working && creep.store.getUsedCapacity([RESOURCE_ENERGY]) == 0){
			creep.memory.working = false;
			creep.memory.source = false;
		}
		if (!creep.memory.working && (creep.store.getUsedCapacity([RESOURCE_ENERGY]) == creep.store.getCapacity([RESOURCE_ENERGY]))){
			creep.memory.working = true;
			creep.memory.destination = false;
		}

		if (creep.memory.working && !creep.memory.destination) {
			let targets = creep.room.find(FIND_STRUCTURES);
			let priorityList = [STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_CONTAINER, STRUCTURE_ROAD];
			let l = _.filter(targets, (t) => t.hits < t.hitsMax);
			let priority = creep.findPriority(l, priorityList);
			if (priority != undefined){
				creep.memory.destination = priority;
			} else {
				let wall = undefined;
				for(let p = .00001; p < 1; p += .00001){
					wall = _.find(l, (w) => w.hits/w.hitsMax < p && w.structureType == STRUCTURE_WALL);
					if (wall != undefined) { creep.memory.destination = wall.id; break; }
				}
			}
		}
		if (creep.memory.working && creep.memory.destination != false){
			let workSite = Game.getObjectById(creep.memory.destination);
			if (workSite.hits == workSite.hitsMax){
				creep.memory.destination = false;
			} else {
				creep.zMove(creep.memory.destination, this.range);
			}
		} else {
			creep.getEnergy();
		}
	},
    spawn: function(room) {
        var healers = _.filter(Game.creeps, (creep) => creep.memory.role == 'healer' && creep.room.name == room.name);
		let creeps = _.filter(Game.creeps, (creep) => creep.room.name == room.name);
        var extensions = _.filter(Game.structures, (struct) => struct.structureType == STRUCTURE_EXTENSION && struct.room.name == room.name);
		console.log('Healers: ' + healers.length, room.name);
		switch (extensions.length){
			case 0: case 1: return false; break;
			default: if (healers.length < this.num ) { return true; } break;
		}
    },
    spawnData: function(room) {
            let name = 'Healer' + Game.time;
            let bodySegment = [WORK, CARRY, MOVE, MOVE];
			var body = this.getBody(bodySegment, room);
            let memory = {role: 'healer', working: false, destination: false, source: false};
        
            return {name, body, memory};
    },

	getBody: function(segment, room){
		var body = [];
		let segmentCost = _.sum(segment, s => BODYPART_COST[s]);
		let energyAvailable = room.energyAvailable;
		let maxSegments = Math.floor(energyAvailable / segmentCost);
		_.times(maxSegments, function(){
			_.forEach(segment, s => body.push(s));
		});
		return body;
	}
};

module.exports = roleHealer;
return module.exports;
}
/********** End of module 9: D:\git\Z33Screeps\src\creeps\healer.js **********/
/********** Start module 10: D:\git\Z33Screeps\src\room\spawning.js **********/
__modules[10] = function(module, exports) {
let creepLogic = __require(1,10);
let creepTypes = _.keys(creepLogic);

function spawnCreeps(room) {
    let creepTypeNeeded = _.find(creepTypes, function(type) {
        return creepLogic[type].spawn(room);
    });
    let creepSpawnData = creepLogic[creepTypeNeeded] && creepLogic[creepTypeNeeded].spawnData(room);

    if (creepSpawnData) {
        let spawn = room.find(FIND_MY_SPAWNS)[0];
		if (!spawn.spawning) {
        	let result = spawn.spawnCreep(creepSpawnData.body, creepSpawnData.name, {memory: creepSpawnData.memory});
        	console.log("Tried to Spawn:", creepTypeNeeded, result);
		}
    }
}

module.exports = spawnCreeps;
return module.exports;
}
/********** End of module 10: D:\git\Z33Screeps\src\room\spawning.js **********/
/********** Start module 11: D:\git\Z33Screeps\src\prototypes\creep.js **********/
__modules[11] = function(module, exports) {
const creepLogic = __require(1,11);
const { spawning } = __require(2,11);

Creep.prototype.debug = true;
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
Creep.prototype.doJob = function doJob(t){
	switch(this.memory.role){
		case 'harvester': this.transfer(t, RESOURCE_ENERGY); break;
		case 'shuttle': this.transfer(t, RESOURCE_ENERGY); break;
		case 'builder': this.build(t); break;
		case 'upgrader': this.upgradeController(t); break;
		case 'healer': this.repair(t); break;
		case 'miner': console.log(this.name, ' has reached the intended location.'); this.memory.working = true; break;
	}
}
Creep.prototype.getEnergy = function getEnergy(){
	let gameObj;
	switch(this.memory.role) {
		case 'harvester':
			if (this.memory.source == false) {
				this.findEnergySource();
			}
			gameObj = Game.getObjectById(this.memory.source);
			if (this.pos.isNearTo(gameObj)){
				this.harvest(gameObj);
			} else {
				this.moveTo(gameObj);
			}
			break;
		default: 
			if (this.memory.source == false || this.memory.source == null) {
				this.findEnergyStructure();
				break;
			}
			gameObj = Game.getObjectById(this.memory.source);
			if (gameObj.energyCapacity != null){ 
			}
			else if (gameObj.energyCapacityAvaliable < this.store.getFreeCapacity([RESOURCE_ENERGY])){
				this.findEnergyStructure();
				break;
			}
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
Creep.prototype.findEnergySource = function findEnergySource(){
	let sources = this.room.find(FIND_SOURCES_ACTIVE);
	let source = this.pos.findClosestByRange(sources);
	if (source == undefined) {
		source = _.find(sources, function(s){
			return s.pos.getOpenPositions(1).length > 0;
		});
		if (source != undefined) {
			this.memory.source = source.id;
		} else {
			return;
		}
	} else {
		this.memory.source = source.id
	}
}
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
Creep.prototype.findPriority = function(list, queue){
	let prio = undefined;
	for(let i = 0; i < queue.length; i++){
		prio = _.find(list, (l) => l.structureType == queue[i]);
		if (prio != undefined){ return prio.id; }
	}
	return prio;
}
return module.exports;
}
/********** End of module 11: D:\git\Z33Screeps\src\prototypes\creep.js **********/
/********** Start module 12: D:\git\Z33Screeps\src\prototypes\roomPosition.js **********/
__modules[12] = function(module, exports) {
RoomPosition.prototype.getNearbyPositions = function getNearbyPositions(range){
	var positions = [];

	let startX = this.x - range || 1;
	let startY = this.y - range || 1;

	for (let x = startX; x <= this.x + range && x < 49; x++){
		for (let y = startY; y <= this.y + range && y < 49; y++){
			if (x != this.x || y != this.y) {
				positions.push(new RoomPosition(x,y,this.roomName));
			}
		}
	}
	return positions;
}

RoomPosition.prototype.getOpenPositions = function getOpenPositions(range){
	let nearbyPositions = this.getNearbyPositions(range);

	let terrain = Game.map.getRoomTerrain(this.roomName);

	let walkablePositions = _.filter(nearbyPositions, function(pos){
		return terrain.get(pos.x, pos.y) != TERRAIN_MASK_WALL; });

	let freePositions = _.filter(walkablePositions, function(pos){
		return  !pos.lookFor(LOOK_CREEPS).length; });

	return freePositions;
}
return module.exports;
}
/********** End of module 12: D:\git\Z33Screeps\src\prototypes\roomPosition.js **********/
/********** Start module 13: D:\git\Z33Screeps\dist\main.js **********/
__modules[13] = function(module, exports) {

return module.exports;
}
/********** End of module 13: D:\git\Z33Screeps\dist\main.js **********/
/********** Footer **********/
if(typeof module === "object")
	module.exports = __require(0);
else
	return __require(0);
})();
/********** End of footer **********/
