import { RoomList } from "../components/roomList";

export function CreateRoom() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto px-4 py-8 max-w-4xl">
        <div className="grid grid-cols-2 items-start gap-8">
          <div />
          <RoomList />
        </div>
      </div>
    </div>
  );
}
