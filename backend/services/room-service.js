const RoomModel = require('../models/room-model');
class RoomService {
    async create(payload) {
        const { topic, roomType, ownerId } = payload;
        const room = await RoomModel.create({
            topic,
            roomType,
            ownerId,
            speakers: [ownerId],
        });
        return room;
    }

    async getAllRooms(types) {
        const rooms = await RoomModel.find({ roomType: { $in: types } })
            .populate('speakers')
            .populate('ownerId')
            .exec();
        return rooms;
    }

    async getRoom(roomId) {
        const room = await RoomModel.findOne({ _id: roomId });
        return room;
    }
    async deletRoom(roomId){
        // when we want to delete a room then we have send the room id to this backend service 
        const room =await RoomModel.deleteOne({_id:roomId})
    }

}
module.exports = new RoomService();
