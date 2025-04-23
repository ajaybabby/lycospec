import React, { useEffect, useRef, useState } from 'react';
import './VideoConference.css';

const VideoConference = ({ onClose, doctorId }) => {
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const peerConnection = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  useEffect(() => {
    initializeWebRTC();
    return () => {
      if (peerConnection.current) {
        peerConnection.current.close();
      }
      stopVideo();
    };
  }, []);

  const initializeWebRTC = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Create RTCPeerConnection
      peerConnection.current = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      });

      // Add local stream to peer connection
      stream.getTracks().forEach(track => {
        peerConnection.current.addTrack(track, stream);
      });

      // Handle incoming remote stream
      peerConnection.current.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      // Handle ICE candidates
      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          // Send ICE candidate to signaling server
          sendIceCandidate(event.candidate);
        }
      };

      // Create and send offer
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      sendOffer(offer);

    } catch (err) {
      console.error('Error initializing WebRTC:', err);
    }
  };

  const sendOffer = async (offer) => {
    try {
      const response = await fetch('https://councils-mrna-flashers-mentioned.trycloudflare.com/api/webrtc/offer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          doctorId,
          offer
        })
      });
      const data = await response.json();
      if (data.success && data.answer) {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.answer));
      }
    } catch (error) {
      console.error('Error sending offer:', error);
    }
  };

  const sendIceCandidate = async (candidate) => {
    try {
      await fetch('https://councils-mrna-flashers-mentioned.trycloudflare.com/api/webrtc/ice-candidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          doctorId,
          candidate
        })
      });
    } catch (error) {
      console.error('Error sending ICE candidate:', error);
    }
  };

  const toggleMute = () => {
    const stream = localVideoRef.current.srcObject;
    stream.getAudioTracks().forEach(track => {
      track.enabled = !track.enabled;
    });
    setIsMuted(!isMuted);
  };

  const toggleCamera = () => {
    const stream = localVideoRef.current.srcObject;
    stream.getVideoTracks().forEach(track => {
      track.enabled = !track.enabled;
    });
    setIsCameraOff(!isCameraOff);
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
        <button 
          className={`control-btn mic-btn ${isMuted ? 'off' : ''}`}
          onClick={toggleMute}
        >
          <i className={`fas fa-microphone${isMuted ? '-slash' : ''}`}></i>
        </button>
        <button 
          className={`control-btn camera-btn ${isCameraOff ? 'off' : ''}`}
          onClick={toggleCamera}
        >
          <i className={`fas fa-video${isCameraOff ? '-slash' : ''}`}></i>
        </button>
        <button className="control-btn end-call" onClick={onClose}>
          End Call
        </button>
      </div>
    </div>
  );
};

export default VideoConference;