import React from 'react';
import { JitsiMeeting } from '@jitsi/react-sdk';

const VideoConference = ({ doctorId, patientId, callId, onClose, isDoctor }) => {
  const generateRoomName = () => {
    return `lycospec-${doctorId}-${patientId}-${callId}`;
  };

  const displayName = isDoctor ? `Dr. ${doctorId}` : `Patient ${patientId}`;

  return (
    <div className="video-conference-container">
      <JitsiMeeting
        domain="meet.jit.si"
        roomName={generateRoomName()}
        configOverwrite={{
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          prejoinPageEnabled: false,
          disableModeratorIndicator: true,
          enableWelcomePage: false,
          enableClosePage: true,
          disableDeepLinking: true
        }}
        interfaceConfigOverwrite={{
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
          MOBILE_APP_PROMO: false,
          SHOW_CHROME_EXTENSION_BANNER: false,
          HIDE_INVITE_MORE_HEADER: true,
          DEFAULT_BACKGROUND: '#ffffff',
          TOOLBAR_ALWAYS_VISIBLE: true
        }}
        userInfo={{
          displayName: displayName,
          email: '',
        }}
        onApiReady={(externalApi) => {
          externalApi.executeCommand('subject', ' ');
          externalApi.addEventListeners({
            readyToClose: onClose,
            participantLeft: onClose,
          });
        }}
        getIFrameRef={(iframeRef) => {
          iframeRef.style.height = '100vh';
          iframeRef.style.width = '100%';
        }}
      />
    </div>
  );
};

export default VideoConference;