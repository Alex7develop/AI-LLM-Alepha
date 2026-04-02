import { useCallback, useRef, useState } from 'react';

function pickMimeType(): string {
  const candidates = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/ogg;codecs=opus',
  ];
  for (const t of candidates) {
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(t)) {
      return t;
    }
  }
  return '';
}

export function useVoiceRecording() {
  const [isRecording, setIsRecording] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const stopTracks = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const stopRecording = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const rec = recorderRef.current;
      if (!rec || rec.state === 'inactive') {
        stopTracks();
        setIsRecording(false);
        resolve(null);
        return;
      }
      rec.onstop = () => {
        stopTracks();
        recorderRef.current = null;
        setIsRecording(false);
        const mime = rec.mimeType || 'audio/webm';
        const blob =
          chunksRef.current.length > 0 ? new Blob(chunksRef.current, { type: mime }) : null;
        chunksRef.current = [];
        resolve(blob && blob.size > 0 ? blob : null);
      };
      if (rec.state === 'recording') {
        rec.requestData();
      }
      rec.stop();
    });
  }, [stopTracks]);

  const startRecording = useCallback(async (): Promise<void> => {
    if (typeof MediaRecorder === 'undefined') {
      throw new Error('Запись аудио не поддерживается в этом браузере');
    }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;
    chunksRef.current = [];
    const mimeType = pickMimeType();
    const recorder = mimeType
      ? new MediaRecorder(stream, { mimeType })
      : new MediaRecorder(stream);
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorderRef.current = recorder;
    recorder.start(100);
    setIsRecording(true);
  }, []);

  const cancelRecording = useCallback(() => {
    const rec = recorderRef.current;
    if (rec && rec.state !== 'inactive') {
      chunksRef.current = [];
      rec.onstop = null;
      rec.stop();
    }
    stopTracks();
    recorderRef.current = null;
    setIsRecording(false);
  }, [stopTracks]);

  return {
    isRecording,
    startRecording,
    stopRecording,
    cancelRecording,
  };
}
