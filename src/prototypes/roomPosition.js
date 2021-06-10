RoomPosition.prototype.getNearbyPositions = function getNearbyPositions(range){
	var positions = [];

	let startX = this.x - range || 1;
	let startY = this.y - range || 1;

	for (x = startX; x <= this.x + range && x < 49; x++){
		for (y = startY; y <= this.y + range && y < 49; y++){
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