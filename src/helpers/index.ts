import RNFS from 'react-native-fs';

export const deleteFile = async (path: string): Promise<boolean> => {
  try {
    await RNFS.unlink(path);
    console.log('deleteFile');
    return true;
  } catch (err) {
    return false;
  }
};

export const uploadFile = async (file: RNFS.UploadFileItem) => {
  try {
    const response = await RNFS.uploadFiles({
      toUrl: 'uploadUrl',
      files: [file],
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      fields: {
        hello: 'world',
      },
    });
    if (response.statusCode === 200) {
      console.log('FILES UPLOADED!'); // response.statusCode, response.headers, response.body
      await deleteFile(file.filepath);
    } else {
      console.log('SERVER ERROR');
    }
  } catch (err) {
    console.log(err);
  }
};
