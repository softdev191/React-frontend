import React, { useContext, useEffect, useState } from 'react';
import Defaults from '../../constants/Defaults';

type Media = { width: number; height: number };
const MediaContext = React.createContext<Media>({ width: 0, height: 0 });

type MediaProviderProps = {
  children: JSX.Element;
};
function MediaProvider(props: MediaProviderProps) {
  const { children } = props;
  const [media, setMedia] = useState<Media>({ width: window.document.body.clientWidth, height: window.document.body.clientHeight });

  useEffect(() => {
    window.addEventListener('resize', () => {
      setMedia({
        width: window.document.body.clientWidth,
        height: window.document.body.clientHeight
      });
    });
    window.addEventListener('load', () => {
      setMedia({
        width: window.document.body.clientWidth,
        height: window.document.body.clientHeight
      });
    });
    return function cleanup() {
      window.removeEventListener('resize', () => {});
      window.removeEventListener('load', () => {});
    };
  }, []);
  return <MediaContext.Provider value={media}>{children}</MediaContext.Provider>;
}

type MediaBreakpoint = { [key in keyof typeof Defaults.MEDIA_BREAKPOINTS]: boolean } & {
  width: number;
  height: number;
  // Index signature
  [key: string]: any;
};

function useMedia() {
  const dimension = useContext(MediaContext);

  return Object.entries(Defaults.MEDIA_BREAKPOINTS).reduce(
    (accumulator, [size, value]) => {
      accumulator[size] = dimension.width < value;
      accumulator.width = dimension.width;
      accumulator.height = dimension.height;
      return accumulator;
    },
    {} as MediaBreakpoint
  );
}

export { MediaContext, useMedia };
export default MediaProvider;
