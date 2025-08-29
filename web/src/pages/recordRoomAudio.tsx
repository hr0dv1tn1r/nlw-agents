import { useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useState } from "react";

const isRecordingSupported =
  !!navigator.mediaDevices &&
  typeof navigator.mediaDevices.getUserMedia === "function" &&
  typeof window.MediaRecorder === "function";

type RoomParams = {
  roomId: string;
};

export function RecordRoomAudio() {
  const params = useParams<RoomParams>();
  const [isRecording, setIsRecording] = useState();
  const recorder = useRef<MediaRecorder | null>(null);

  function stopRecording() {}

  // function uploadAudio(audio: Blob) {}

  function startRecording() {
    if (!isRecordingSupported) {
      alert("O seu navegador não suporta gravação.");
      return;
    }

    setIsRecording(true);

    const audio = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44_100,
      },
    });
  }

  if (!params.roomId) {
    return <Navigate replace to="/" />;
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-3">
      {isRecording ? (
        <Button onClick={stopRecording}>Pausar Gravação</Button>
      ) : (
        <Button onClick={startRecording}>Gravar Audio</Button>
      )}
      {isRecording ? <p>Gravando ...</p> : <p>Pausado</p>}
    </div>
  );
}
