import React from 'react';
import { JitsiMeeting } from '@jitsi/react-sdk';

const VideoConference = ({ doctorId, onClose }) => {
  const roomName = `lycospec-${doctorId}`;

  return (
    <div className="video-conference" style={{ height: '100vh', width: '100%' }}>
      <JitsiMeeting
        domain="meet.jit.si"
        roomName={roomName}
        configOverwrite={{
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          prejoinPageEnabled: false
        }}
        interfaceConfigOverwrite={{
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'closedcaptions', 'desktop', 
            'fullscreen', 'fodeviceselection', 'hangup', 'chat',
            'settings', 'raisehand', 'videoquality', 'filmstrip',
            'tileview'
          ]
        }}
        onApiReady={(externalApi) => {
          externalApi.addEventListeners({
            readyToClose: onClose
          });
        }}
        getIFrameRef={(iframeRef) => {
          iframeRef.style.height = '100%';
          iframeRef.style.width = '100%';
        }}
      />
    </div>
  );
};

export default VideoConference;