import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";

export default function Camara() {
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const [isRecording, setIsRecording] = useState();
    const [downloadLink, setDownloadLink] = useState("");
    const streamRecorderRef = useRef(null);
    const chunks = useRef([]);
    const timer = useRef(0);

    function startRecording() {
        if (isRecording) {
            return;
        }
        if (!videoRef.current) {
            return;
        }
        streamRecorderRef.current = new MediaRecorder(streamRef.current);
        streamRecorderRef.current.start();
        streamRecorderRef.current.ondataavailable = function (event) {
            if (chunks.current) {
                chunks.current.push(event.data);
            }
        }
        setTimeout(() => {
            timer.current = 1;
            console.log(timer.current)
        }, 30000);
        setTimeout(() => {
            if (streamRecorderRef.current) {
                stopRecording();
            }
        }, 120000);
        setIsRecording(true);

    }
    function stopRecording() {
        console.log(timer.current)
        if (timer.current === 1) {
            if (!streamRecorderRef.current) {
                return;
            }
            streamRecorderRef.current.stop();
            setIsRecording(false);
            timer.current = 0;
        } else {
            alert("La duración mínima es de 30 segundos");
        }
    }


    useEffect(() => {
        if (isRecording || chunks.current.length === 0) {
            return;
        }
        const blob = new Blob(chunks.current, {
            type: "video/x-matroska;codecs=avc1,opus",
        })
        setDownloadLink(URL.createObjectURL(blob));
        chunks.current = [];

    }, [isRecording])

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ audio: false, video: true }).then((stream) => {
            videoRef.current.srcObject = stream;
            streamRef.current = stream;
        })
    })

    return (
        <div>
            <video ref={videoRef} autoPlay muted playsInline></video>
            <div>
                <button onClick={startRecording} disabled={isRecording}>Grabar</button>
                <button onClick={stopRecording} disabled={!isRecording}>Parar</button>
            </div>
            <div>
                {downloadLink && <video src={downloadLink} controls></video>}
                {downloadLink && <a href={downloadLink} download="file.mp4">Descargar</a>}
            </div>
        </div>

    )
}