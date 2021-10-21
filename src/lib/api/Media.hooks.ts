import { useCallback, useEffect, useRef, useState } from 'react';
import { createMedia, createPlan, getSignature, uploadToS3 } from '../media/media.service';
import { Media, Plan } from '../../types';
import { s3BucketCredentials } from '../../constants/Bid';
import S3FileUpload from 'react-s3/lib/ReactS3';

export type DropFileObject = {
  bytes: string;
  icon: string;
  id: string;
  isDir: boolean;
  link: string;
  linkType: string;
  name: string;
};

export type MediaCreateDTO = {
  filename: string;
  originalUrl: string;
  smallUrl: string;
  mediumUrl: string;
  largeUrl: string;
};

export type PlansCreateDTO = {
  filename: string;
  url: string;
  bidId: number;
};

export type PlansCreateDTODrop = {
  filename: string;
  url: string;
  bidId: number;
  isDropBoxReq: string;
  accessToken: string;
};

export function useDocumentUpload() {
  const [uploadedFiles, setUploadedFiles] = useState([] as any[]);
  const [error, setError] = useState<Error | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const acl = 'private';

  const unmounted = useRef(false);

  useEffect(() => {
    return () => {
      unmounted.current = true;
    };
  }, []);

  const uploadDrop = useCallback(async (bidId: number, files: DropFileObject[]): Promise<void> => {
    setIsUploading(true);
    setError(null);
    let data: Plan;

    try {
      if (files.length > 0) {
        files.map(async (file, index) => {
          // let amazoneParam = Object.assign({}, s3BucketCredentials, { name: file.name, dirName: 'documents' });
          // let awsResponse = await S3FileUpload.uploadFile(file, amazoneParam);

          // let fileUrl = awsResponse.location;

          // console.log('awsResponse.location awsResponse.location awsResponse.location', awsResponse.location);
          let fileLink = file.link.slice(0, -1);
          fileLink = fileLink + '1';

          console.log(fileLink + '1', 'asaasassa');

          const newFile: PlansCreateDTODrop = {
            filename: file.name,
            url: fileLink,
            bidId,
            isDropBoxReq: '1',
            accessToken:
              'sl.AsyyBNfIvLIws8sVQQIw1KSmt-UuYK5vJgfcHo8YXmMCu3NnvflsK3yfBPJRlRd9ko0oEChDhu7tEma7gDkzLEGenKywiKYsTxa0kKMlH4cQD7XiNIbYQG7cc_OJ6YSGNLSCL7I'
          };
          data = await createPlan(newFile);
          setUploadedFiles(files => [...files, data]);
          // if (files.length === index + 1) {
          //   setProgress(1.0);
          // }
          !unmounted.current && setIsUploading(false);
        });
      }
    } catch (error) {
      !unmounted.current && setError(error);
      !unmounted.current && setIsUploading(false);
    }
  }, []);

  const upload = useCallback(async (bidId: number, files: File[]): Promise<void> => {
    setIsUploading(true);
    setError(null);
    let data: Plan;

    const MIN_VALUE = 1.0;
    try {
      if (files.length > 0) {
        let uploadedSize = 0;
        const totalFileSize = files.reduce((a, b) => a + b.size, 0);
        files.map(async (file, index) => {
          const credentials = await getSignature({ type: file.type, acl });

          const sizeOfFile = (file.size / 1024 / 1024).toFixed(2);

          if (Number(sizeOfFile) > 200) {
            alert('You are not allowed to upload file more than 200 MB.');
            !unmounted.current && setIsUploading(false);
          } else {
            let amazoneParam = Object.assign({}, s3BucketCredentials, { name: file.name, dirName: 'documents' });
            let awsResponse = await S3FileUpload.uploadFile(file, amazoneParam);

            let fileUrl = awsResponse.location;
            // const fileUrl = await uploadToS3(file.name, file, credentials, acl, (percent: number) => {
            //   uploadedSize = percent;
            //   // console.log((totalFileSize))
            //   // console.log((percent))
            //   // setProgress(Math.min(MIN_VALUE, uploadedSize / totalFileSize));
            // });
            const newFile: PlansCreateDTO = {
              filename: file.name,
              url: fileUrl,
              bidId
            };
            data = await createPlan(newFile);
            setUploadedFiles(files => [...files, data]);
            !unmounted.current && setIsUploading(false);
          }
        });
      }
    } catch (error) {
      !unmounted.current && setError(error);
      !unmounted.current && setIsUploading(false);
    }
  }, []);

  const uploadCompanyLogo = useCallback(async (file: File): Promise<Media> => {
    setIsUploading(true);
    setError(null);
    let data;
    try {
      if (file) {
        const credentials = await getSignature({ type: file.type, acl });
        const fileUrl = await uploadToS3(file.name, file, credentials, acl, (progress: number) => {
          setProgress(progress);
        });
        const newFile: MediaCreateDTO = {
          filename: file.name,
          originalUrl: fileUrl,
          smallUrl: fileUrl,
          mediumUrl: fileUrl,
          largeUrl: fileUrl
        };

        data = await createMedia(newFile);
        !unmounted.current && setIsUploading(false);
      }
    } catch (error) {
      !unmounted.current && setError(error);
    }
    return data;
  }, []);

  return {
    uploadedFiles,
    error,
    isUploading,
    setIsUploading,
    upload,
    uploadDrop,
    uploadCompanyLogo,
    progress,
    setUploadedFiles,
    setProgress
  };
}
