let roomLogic = {
    spawning:     require('./spawning'),

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