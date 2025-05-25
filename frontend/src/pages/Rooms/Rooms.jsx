import React, { useEffect, useState } from 'react';
import AddRoomModal from '../../components/AddRoomModal/AddRoomModal';
import RoomCard from '../../components/RoomCard/RoomCard';
import styles from './Rooms.module.css';
import { getAllRooms, deleteRoom } from '../../http';

const Rooms = () => {
    const [showModal, setShowModal] = useState(false);
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        const fetchRooms = async () => {
            const { data } = await getAllRooms();
            setRooms(data);
        };
        fetchRooms();
    }, []);

    const deleteroom = async (roomId) => {
        try {
            // Call the deleteRoom function from your API
            const { data } = await deleteRoom({roomId:roomId});
            console.log(data);

            // Update the rooms state to remove the deleted room
            setRooms((prevRooms) => prevRooms.filter((room) => room.id !== roomId));
        } catch (err) {
            console.log(err.message);
        }
        console.log(roomId)
    };

    const openModal = () => {
        setShowModal(true);
    };

    return (
        <>
            <div className={styles.container}>
                <div className={styles.roomsHeader}>
                    <div className={styles.left}>
                        <span className={styles.heading}>All voice rooms</span>
                        <div className={styles.searchBox}>
                            <img src="/images/search-icon.png" alt="search" />
                            <input type="text" className={styles.searchInput} />
                        </div>
                    </div>
                    <div className={styles.right}>
                        <button
                            onClick={openModal}
                            className={styles.startRoomButton}
                        >
                            <img
                                src="/images/add-room-icon.png"
                                alt="add-room"
                            />
                            <span>Start a room</span>
                        </button>
                    </div>
                </div>

                <div className={styles.roomList}>
                    {rooms?.map((room) => (
                        <RoomCard
                            key={room.id}
                            room={room}
                            Delete={deleteroom} // Pass deleteroom function as prop
                        />
                    ))}
                </div>
            </div>
            {showModal && <AddRoomModal onClose={() => setShowModal(false)} />}
        </>
    );
};

export default Rooms;