import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import './DoctorVideoCall.css';

const DoctorVideoCall = () => {
  const { requestId } = useParams();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    startCall();
    return () => {
      if (peerConnection.current) {
        peerConnection.current.close();
      }
    };
  }, []);

  const startCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localVideoRef.current.srcObject = stream;

      peerConnection.current = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          // Add your TURN server here if needed
        ]
      });

      stream.getTracks().forEach(track => {
        peerConnection.current.addTrack(track, stream);
      });

      peerConnection.current.ontrack = (event) => {
        remoteVideoRef.current.srcObject = event.streams[0];
      };

      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          // Send candidate to signaling server
          sendToSignalingServer({
            type: 'candidate',
            candidate: event.candidate,
            requestId
          });
        }
      };

      // Connect to signaling server
      connectToSignalingServer();

    } catch (error) {
      console.error('Error starting call:', error);
    }
  };

  const connectToSignalingServer = () => {
    const ws = new WebSocket('ws://localhost:5000');

    ws.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'offer') {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);
        
        sendToSignalingServer({
          type: 'answer',
          answer: answer,
          requestId
        });
      }

      if (data.type === 'candidate') {
        await peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    };
  };

  const sendToSignalingServer = (data) => {
    // Implement your signaling server communication here
    fetch('http://localhost:5000/api/signaling', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    });
  };

  return (
    <div className="video-call-container">
      <div className="video-grid">
        <div className="remote-video">
          <video ref={remoteVideoRef} autoPlay playsInline />
          <div className="patient-name">Patient</div>
        </div>
        <div className="local-video">
          <video ref={localVideoRef} autoPlay playsInline muted />
          <div className="doctor-name">Doctor</div>
        </div>
      </div>
      <div className="controls">
        <button className="end-call" onClick={() => window.history.back()}>
          End Call
        </button>
      </div>
    </div>
  );
};

export default DoctorVideoCall;