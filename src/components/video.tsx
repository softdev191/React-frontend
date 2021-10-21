import React, { RefAttributes } from 'react';
import videojs from 'video.js';
import styled from '../styled-components';

import Box from './Box';
import {
  background,
  BackgroundColorProps,
  BackgroundProps,
  border,
  BorderProps,
  color,
  compose,
  flexbox,
  FlexboxProps,
  layout,
  LayoutProps,
  OpacityProps,
  position,
  PositionProps,
  space,
  SpaceProps,
  system
} from 'styled-system';
import 'video.js/dist/video-js.css';

export type VideoProps = {
  src?: string;
  alt?: string;
  objectFit?: string;
  transform?: string;
  crossOrigin?: string;
} & BackgroundColorProps &
  BackgroundProps &
  BorderProps &
  FlexboxProps &
  LayoutProps &
  OpacityProps &
  PositionProps &
  SpaceProps &
  React.HTMLAttributes<HTMLVideoElement> &
  RefAttributes<HTMLVideoElement>;

interface IVideoPlayerProps {
  options: videojs.PlayerOptions;
}

const initialOptions: videojs.PlayerOptions = {
  controls: false,
  fluid: true,
  controlBar: {
    volumePanel: {
      inline: false
    }
  }
};

const VideoPlayer: React.FC<IVideoPlayerProps> = ({ options }) => {
  const videoNode = React.useRef<HTMLVideoElement | any>();
  const player = React.useRef<videojs.Player>();
  let ref: any;
  React.useEffect(() => {
    player.current = videojs(videoNode.current, {
      ...initialOptions,
      ...options
    }).ready(function() {
      // console.log('onPlayerReady', this);
    });
    return () => {
      if (player.current) {
        player.current.dispose();
      }
    };
  }, [options]);

  return <video ref={videoNode} width='800' height='500' className='video-js' />;
};

const BaseVideo = styled(Box).attrs({
  as: 'vid'
})<VideoProps>(
  system({
    objectFit: true,
    transform: true,
    crossOrigin: true
  }),
  {
    objectFit: 'contain'
  },
  compose(background, border, color, flexbox, layout, position, space)
);

const Video = React.forwardRef<HTMLVideoElement, VideoProps>((props: VideoProps) => {
  const videoJsOptions: {
    autoplay: boolean;
    controls: boolean;
    sources: [
      {
        src: any;
        type: string;
      }
    ];
  } = {
    autoplay: true,
    controls: false,
    sources: [
      {
        src: props.src,
        type: 'video/mp4'
      }
    ]
  };

  return <VideoPlayer options={videoJsOptions} />;
});

export default Video;
