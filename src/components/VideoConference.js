import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const VideoConference = ({ doctorId, onClose }) => {
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const peerConnectionRef = useRef();
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io('http://localhost:5000');
    
    socketRef.current.on('connect', () => {
      setConnectionStatus('Socket Connected');
      console.log('Socket connected:', socketRef.current.id);
    });

    socketRef.current.on('error', (error) => {
      console.error('Socket error:', error);
      setConnectionStatus('Connection Error');
    });

    socketRef.current.on('user-connected', ({ userId }) => {
      console.log('User connected:', userId);
      setConnectionStatus('Peer Connected');
    });

    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        // Add TURN servers for production
      ]
    };
    peerConnectionRef.current = new RTCPeerConnection(configuration);

    // 3. Get local media stream
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        localVideoRef.current.srcObject = stream;
        stream.getTracks().forEach(track => {
          peerConnectionRef.current.addTrack(track, stream);
        });
      });

    // 4. Handle incoming remote stream
    peerConnectionRef.current.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    // 5. Socket event handlers
    socketRef.current.emit('join-room', { doctorId });

    socketRef.current.on('offer', async (offer) => {
      await peerConnectionRef.current.setRemoteDescription(offer);
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      socketRef.current.emit('answer', { answer, doctorId });
    });

    socketRef.current.on('answer', async (answer) => {
      await peerConnectionRef.current.setRemoteDescription(answer);
    });

    socketRef.current.on('ice-candidate', async (candidate) => {
      await peerConnectionRef.current.addIceCandidate(candidate);
    });

    // 6. Handle ICE candidates
    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit('ice-candidate', {
          candidate: event.candidate,
          doctorId
        });
      }
    };

    return () => {
      if (localVideoRef.current?.srcObject) {
        localVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, [doctorId]);

  return (
    <div className="video-conference">
      <div className="status-bar">
        <span>{connectionStatus}</span>
      </div>
      <div className="video-container">
        <video ref={localVideoRef} autoPlay muted playsInline />
        <video ref={remoteVideoRef} autoPlay playsInline />
      </div>
      <button onClick={onClose}>End Call</button>
    </div>
  );
};

export default VideoConference;