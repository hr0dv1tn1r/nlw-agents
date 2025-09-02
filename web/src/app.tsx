import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CreateRoom } from "./pages/createRoom";
import { Room } from "./pages/room";
import { RecordRoomAudio } from "./pages/recordRoomAudio";

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<CreateRoom />} index />
          <Route element={<Room />} path="/room/:roomId" />
          <Route element={<RecordRoomAudio />} path="/room/:roomId/audio" />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
