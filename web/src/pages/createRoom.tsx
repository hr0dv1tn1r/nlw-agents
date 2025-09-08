import { CreateRoomForm } from "../components/createRoomForm";
import { RoomList } from "../components/roomList";

export function CreateRoom() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto px-4 py-8 max-w-4xl">
        <div className="grid grid-cols-2 items-start gap-8">
          {/* Formulário de criação de sala à esquerda */}
          <CreateRoomForm />
          {/* Lista de salas recentes à direita */}
          <RoomList />
        </div>
      </div>
    </div>
  );
}
