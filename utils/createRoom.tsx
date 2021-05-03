export function createRoom(roomName: string, userName: string) {
  console.log(roomName, userName)

  return Promise.resolve({
    roomId: 'room-1',
    adminId: 'user-1',
  })
}
