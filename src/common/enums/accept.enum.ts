const acceptFileTypeList = [
  '.doc',
  '.docx',
  '.xls',
  '.xlsx',
  '.csv',
  '.ods',
  '.ppt',
  '.pptx',
  '.pdf',
  '.txt',
  '.java',
  '.php',
  '.xml',
  '.py',
  '.md',
  '.js',
  '.css',
  '.zip',
  '.rar',
  // '.jar',
  '.tar',
  '.gzip',
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.tif',
  '.dng',
  '.cr2',
  '.ai',
  '.psd',
  '.wmv',
  '.mp4',
  '.avi',
  '.mpeg',
  '.flv',
  '.asf',
  '.mov',
  '.rm',
  '.dat',
  '.mxf',
  '.mkv',
  '.m4v',
  '.mpg',
  '.vob',
  '.wav',
  '.mp3',
  '.wma',
  '.aac',
  '.midi',
  '.mid',
  '.mmf',
  '.mp2',
  '.flac',
  '.ram',
  '.dwg',
]
export const acceptFileType = acceptFileTypeList.join(',')

export const acceptFileTypeExcludeZip = () => {
  const filteredList = acceptFileTypeList.filter((type) => type !== '.zip')
  console.log('----------filteredList', filteredList.join(','))
  return filteredList.join(',')
}
