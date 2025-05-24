import React, { useRef, useState, useEffect } from "react";
import {
  FaPlay,
  FaPause,
  FaVolumeMute,
  FaVolumeUp,
  FaRecordVinyl,
  FaStop,
  FaMicrophone,
  FaMicrophoneSlash,
  FaExpand,
  FaCompress,
} from "react-icons/fa";
import styles from "./VideoStreamingPlayer.module.css";

const VideoStreamingPlayer = ({ src, type = "video/mp4" }) => {
  const videoRef = useRef(null);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [recording, setRecording] = useState(false);
  const [micMuted, setMicMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  // Play or pause video
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setPlaying(!playing);
  };

  // Mute or unmute video
  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !muted;
    setMuted(!muted);
  };

  // Volume slider change
  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    if (!videoRef.current) return;
    videoRef.current.volume = vol;
    setVolume(vol);
    if (vol === 0) {
      videoRef.current.muted = true;
      setMuted(true);
    } else {
      videoRef.current.muted = false;
      setMuted(false);
    }
  };

  // Toggle recording (mock)
  const toggleRecord = () => {
    if (recording) {
      setRecording(false);
      alert("Recording stopped (mock)");
    } else {
      setRecording(true);
      alert("Recording started (mock)");
    }
  };

  // Toggle mic mute/unmute (UI only)
  const toggleMic = () => {
    setMicMuted(!micMuted);
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    const elem = videoRef.current.parentElement; // container to fullscreen

    if (!fullscreen) {
      if (elem.requestFullscreen) elem.requestFullscreen();
      else if (elem.mozRequestFullScreen) elem.mozRequestFullScreen();
      else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
      else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
      setFullscreen(true);
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      setFullscreen(false);
    }
  };

  // Sync playing state if user clicks native controls or keyboard
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setPlaying(true);
    const handlePause = () => setPlaying(false);

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.videoWrapper}>
        <video
          ref={videoRef}
          className={styles.videoElement}
          src={src}
          type={type}
          muted={muted}
          volume={volume}
          controls={false}
          preload="metadata"
        />
      </div>

      <div className={styles.controls}>
        {/* Play/Pause */}
        <button onClick={togglePlay} className={styles.button} aria-label="Play/Pause">
          {playing ? <FaPause /> : <FaPlay />}
        </button>

        {/* Mute/Unmute */}
        <button onClick={toggleMute} className={styles.button} aria-label="Mute/Unmute">
          {muted ? <FaVolumeMute /> : <FaVolumeUp />}
        </button>

        {/* Volume slider */}
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={muted ? 0 : volume}
          onChange={handleVolumeChange}
          className={styles.volumeSlider}
          aria-label="Volume"
        />

        {/* Record (mock) */}
        <button
          onClick={toggleRecord}
          className={`${styles.button} ${recording ? styles.recording : ""}`}
          aria-label="Record/Stop Recording"
        >
          {recording ? <FaStop /> : <FaRecordVinyl />}
        </button>

        {/* Mic mute/unmute (UI only) */}
        <button onClick={toggleMic} className={styles.button} aria-label="Mic Mute/Unmute">
          {micMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
        </button>

        {/* Fullscreen */}
        <button onClick={toggleFullscreen} className={styles.button} aria-label="Fullscreen Toggle">
          {fullscreen ? <FaCompress /> : <FaExpand />}
        </button>
      </div>
    </div>
  );
};

export default VideoStreamingPlayer;
