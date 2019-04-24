const decompress = require('decompress');
const tmp = require('tmp');

const http = require('./http');
const defaultLogger = require('./logger');

module.exports = {

  downloadAndExtract(url, targetDir, haveFilter = true, logger = defaultLogger) {
    logger.info(`Downloading from ${url}. It may take a few minutes.`);
    const file = tmp.fileSync();
    const filePath = file.name;
    return http.stream(url, filePath)
      .then(() => {
        logger.info(`Decompressing the file into ${targetDir}.`);
        return decompress(filePath, targetDir, {
          filter: (decompressFile) => {
            if (haveFilter) {
              const decompressPath = decompressFile.path;
              return !decompressPath.includes('.git/') && !decompressPath.includes('__MACOSX');
            }
            return null;
          },
        });
      });
  },
};
