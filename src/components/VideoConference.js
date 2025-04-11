import React, { useEffect, useRef, useState } from 'react';
import './VideoConference.css';

const VideoConference = ({ onClose }) => {
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    startVideo();
    return () => {
      stopVideo();
    };
  }, []);

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Error accessing media devices:', err);
    }
  };

  const stopVideo = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      localVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
  };

  return (
    <div className="video-conference">
      <div className="video-container">
        <video 
          ref={localVideoRef} 
          autoPlay 
          playsInline 
          muted 
          className="local-video"
        />
        <video 
          ref={remoteVideoRef} 
          autoPlay 
          playsInline 
          className="remote-video"
        />
      </div>
      <div className="controls">
        <button className="control-btn mic-btn">
          <i className="fas fa-microphone"></i>
        </button>
        <button className="control-btn camera-btn">
          <i className="fas fa-video"></i>
        </button>
        <button className="control-btn end-call" onClick={onClose}>
          End Call
        </button>
      </div>
    </div>
  );
};

export default VideoConference;