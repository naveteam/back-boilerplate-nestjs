import aws from 'aws-sdk';
import path from 'path';
import { promises as fs, createReadStream, createWriteStream } from 'fs';
import { v4 } from 'uuid';
import axios from 'axios';
import mime from 'mime-types';

import { writeFile } from 'helpers';
import {
  AWS_BUCKET,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  AWS_URL_EXPIRES,
  AWS_URL_ROUTE_S3_DNS,
} from '../../config';

export const initBucket = () =>
  new aws.S3({
    signatureVersion: 'v4',
    region: AWS_REGION,
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  });

export const uploadDirToS3 = async (s3Path: string) => {
  const s3 = initBucket();
  const mainFolderName = v4();

  const getFiles = async (dir: string): Promise<string | string[]> => {
    const dirents = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
      dirents.map((dirent) => {
        const res = path.resolve(dir, dirent.name);
        return dirent.isDirectory() ? getFiles(res) : res;
      }),
    );
    return Array.prototype.concat(...files);
  };

  const files = (await getFiles(s3Path)) as string[];
  const uploads = Promise.all(
    files.map((filePath) => {
      const bucketPath = filePath.substring(s3Path.length - 1);
      const contentTypeFile = mime.lookup(filePath);

      //Key: path.relative(s3Path, filePath)
      const params = {
        Bucket: AWS_BUCKET,
        Key: `${mainFolderName}${bucketPath}`,
        Body: createReadStream(filePath),
        ContentType: contentTypeFile !== false ? contentTypeFile : '',
      };

      return s3
        .upload(params, function (err, data) {
          if (err) {
            console.log(err);
          } else {
            console.log(
              'Successfully uploaded ' +
                path.relative(s3Path, filePath) +
                ' to ' +
                AWS_BUCKET,
            );
            console.log('Uploaded em: ', data.Location);
            console.log('Chave: ', data.key);

            return { Location: data.Location, key: data.key };
          }
        })
        .promise();
    }),
  );
  return Promise.all(await uploads);
};

export const searchFileArrayToS3 = (arrayFiles: any[], nameFile: string) =>
  arrayFiles.find((val) => {
    if (val.Key.indexOf(nameFile) != -1) {
      return val;
    }
  });

export const signedUrlToS3 = async (key: string) => {
  const s3 = initBucket();

  const signedUrl = s3.getSignedUrl('getObject', {
    Bucket: AWS_BUCKET,
    Key: key,
    Expires: Number(AWS_URL_EXPIRES),
  });

  return { url: signedUrl, key: key };
};

export const createUrlToS3WithDns = (key: string) =>
  `${AWS_URL_ROUTE_S3_DNS}/${key}`;

export const getImage = async (filename) => {
  const s3 = initBucket();
  const s3Params = {
    Bucket: AWS_BUCKET,
    Key: filename,
  };

  const file = createWriteStream(filename);

  await s3.getObject(s3Params).createReadStream().pipe(file);

  return writeFile(file);
};
