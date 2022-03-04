import fs from 'fs';
import rimraf from 'rimraf';
import path from 'path';
import DecompressZip from 'decompress-zip';

export const fileToBlob = (file) =>
  new Promise((resolve, reject) => {
    fs.readFile(file.path, (err, data) => {
      if (err) {
        reject(err);
      }
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      resolve(data);
    });
  });

export const getExtFromFileName = (filename) => filename.split('.').pop() || '';

export const getFileName = (filename) => filename.split('.')[0] || '';

export const deleteDirectory = (path) => {
  if (fs.existsSync(path)) rimraf.sync(path);
};

export const createFolder = (path) => {
  //Verifica se não existe
  if (!fs.existsSync(path)) {
    //Efetua a criação do diretório
    fs.mkdirSync(path);
  }
};

export const writeFile = (file) =>
  new Promise((resolve, reject) => {
    file.on('error', (err) => reject(err)).on('finish', () => resolve(file));
  });

export const writeFileAsync = (path, content): any =>
  new Promise((resolve, reject) =>
    //@ts-ignore
    fs.writeFile(path, content, (__dirname, error) => {
      if (!error) {
        return resolve({
          path,
        });
      }

      return reject(error);
    }),
  );

export const extractFileZipBuffer = (file: any, filePath: string): any =>
  new Promise(async (resolve, reject) => {
    const pathResolved = path.resolve(__dirname, filePath, file.originalname);

    const res = await writeFileAsync(pathResolved, file.buffer);

    const unzipper = new DecompressZip(res.path);

    unzipper.on('error', function (err) {
      console.log('event error');
      console.log(err);
      return reject(err);
    });

    unzipper.on('extract', function (log) {
      console.log('log es', log);
      deleteDirectory(pathResolved);
      resolve('Finished extracting');
    });

    unzipper.on('progress', function (fileIndex, fileCount) {
      console.log('Extracted file ' + (fileIndex + 1) + ' of ' + fileCount);
    });

    unzipper.extract({
      path: filePath,
    });
  });
