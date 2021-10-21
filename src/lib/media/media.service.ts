import * as EXIF from 'exif-js';
import Api from '../api/Api';
import { MediaCreateDTO, PlansCreateDTO } from '../api/Media.hooks';
import S3FileUpload from 'react-s3/lib/ReactS3';

export const imageSizes: Record<string, ResizeOptions> = {
  small: {
    width: 512,
    height: 512
  },
  medium: {
    width: 1024,
    height: 1024
  },
  large: {
    width: 2048,
    height: 2048
  }
};

export type ResizeOptions = {
  width: number;
  height: number;
  aspectRatio?: string;
};

export type MediaDimension = {
  height: number;
  width: number;
  key: string;
};

export type MediaOrientationOptions = {
  canvas: HTMLCanvasElement;
  context: any;
  dimension: Pick<MediaDimension, 'height' | 'width'>;
  orientation: MediaOrientation;
};

enum MediaResizeAspect {
  STRETCH = 'stretch',
  FILL = 'fill',
  FIT = 'fit'
}

export enum MediaOrientation {
  HORIZONTAL_FLIP = 2,
  ROTATE_LEFT_180_DEG = 3,
  VERTICAL_FLIP = 4,
  VERTICAL_FLIP_WITH_90_DEG_ROTATE_RIGHT = 5,
  ROTATE_RIGHT_90_DEG = 6,
  HORIZONTAL_FLIP_WITH_90_DEG_ROTATE_RIGHT = 7,
  ROTATE_LEFT_90_DEG = 8
}

export const resize = async (url: string, options: ResizeOptions): Promise<string> => {
  const image = await loadImage(url);
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d') as CanvasRenderingContext2D;

  return new Promise(resolve => {
    EXIF.getData(image as any, () => {
      const orientation = EXIF.getTag(image, 'Orientation');
      let { width, height, aspectRatio } = options;
      let scale = 1.0;

      switch (aspectRatio) {
        case MediaResizeAspect.STRETCH:
          canvas.width = width;
          canvas.height = height;
          break;
        case MediaResizeAspect.FILL:
          scale = Math.max(width / image.width, height / image.height);
          canvas.width = width;
          canvas.height = height;
          width = image.width * scale;
          height = image.height * scale;
          break;
        case MediaResizeAspect.FIT:
        default:
          scale = Math.min(width / image.width, height / image.height);
          if (scale > 1.0) {
            scale = 1.0;
          }
          width = image.width * scale;
          height = image.height * scale;
          canvas.width = width;
          canvas.height = height;
      }
      context.save();
      setOrientation({ canvas, context, dimension: { width, height }, orientation });
      context.drawImage(image, 0, 0, width, height);
      context.restore();

      resolve(canvas.toDataURL('image/jpeg', 0.8));
    });
  });
};

export const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = url;
    image.onload = () => {
      resolve(image);
    };

    image.onerror = error => {
      reject(error);
    };
  });
};

export const dataUrlToBlob = (dataUrl: string): any => {
  // convert base64/URLEncoded data component to raw binary data held in a string
  let byteString = '';
  if (dataUrl.split(',')[0].indexOf('base64') >= 0) {
    byteString = atob(dataUrl.split(',')[1]);
  }

  // separate out the mime component
  const mimeString = dataUrl
    .split(',')[0]
    .split(':')[1]
    .split(';')[0];

  // write the bytes of the string to a typed array
  const ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], { type: mimeString });
};

export function setOrientation(options: MediaOrientationOptions) {
  const {
    canvas,
    context,
    dimension: { width, height },
    orientation
  } = options;

  switch (orientation) {
    case MediaOrientation.HORIZONTAL_FLIP:
      context.translate(width, 0);
      context.scale(-1, 1);
      break;
    case MediaOrientation.ROTATE_LEFT_180_DEG:
      context.translate(width, height);
      context.rotate(Math.PI);
      break;
    case MediaOrientation.VERTICAL_FLIP:
      context.translate(0, height);
      context.scale(1, -1);
      break;
    case MediaOrientation.VERTICAL_FLIP_WITH_90_DEG_ROTATE_RIGHT:
      canvas.width = height;
      canvas.height = width;
      context.rotate(0.5 * Math.PI);
      context.scale(1, -1);
      break;
    case MediaOrientation.ROTATE_RIGHT_90_DEG:
      canvas.width = height;
      canvas.height = width;
      context.rotate(0.5 * Math.PI);
      context.translate(0, -height);
      break;
    case MediaOrientation.HORIZONTAL_FLIP_WITH_90_DEG_ROTATE_RIGHT:
      canvas.width = height;
      canvas.height = width;
      context.rotate(0.5 * Math.PI);
      context.translate(width, -height);
      context.scale(-1, 1);
      break;
    case MediaOrientation.ROTATE_LEFT_90_DEG:
      canvas.width = height;
      canvas.height = width;
      context.rotate(-0.5 * Math.PI);
      context.translate(-width, 0);
      break;
  }
}

export const getSignature = async (params: { type: string; acl: string }) => {
  const [response, body] = await Api.get('media/signature', params);
  if (response.ok) return body;
  throw new Error(body.error);
};

export const createMedia = async (media: MediaCreateDTO) => {
  const [response, body] = await Api.post('media', media);
  if (response.ok) return body;
  throw new Error(body.error);
};

export const createPlan = async (file: PlansCreateDTO) => {
  const [response, body] = await Api.post('plans', file);
  if (response.ok) return body;
  throw new Error(body.error);
};

export const uploadToS3 = (name: string, blob: Blob, config: any, acl: string, progress: (percent: number) => void): Promise<string> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    const bucket = `https://${config.bucket}.s3.amazonaws.com`;
    const key = config.uniqueFilePrefix + name;

    formData.append('key', key);
    formData.append('AWSAccessKeyId', config.AWSAccessKeyId);
    formData.append('acl', acl);
    formData.append('success_action_status', '201');
    formData.append('policy', config.policy);
    formData.append('signature', config.signature);
    formData.append('Content-Type', config['Content-Type']);
    formData.append('file', blob);

    xhr.open('POST', bucket, true);

    xhr.onerror = () => reject('Something went wrong.');

    xhr.upload.addEventListener(
      'progress',
      e => {
        progress(e.loaded);
      },
      false
    );

    xhr.upload.addEventListener(
      'error',
      error => {
        reject(error);
      },
      false
    );

    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) {
        return;
      }
      resolve(bucket + '/' + key);
    };

    xhr.send(formData);
  });
};
