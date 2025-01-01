/**
 * 仅仅在项目初始化时使用, 存储erms(注意,不包含 admin) 系统和用户信息,
 */
import ENV from '@/common/config'

const storeNameLists = [
  'user',
  'unit',
  'grade',
  'dept',
  'fileTransferDept',
  'archiveFile', //档案库文件夹
  'fileArrange', //文件线下收集文件夹
  'shareFolder',
  'usingFolder',
  'appraisalTaskFolder',
  'warehouseFolder',
  'subjectFolder',
  'libraryFileFolder',
  'transferRecordFolder',
  'destroyFormFolder',
  'dataForm',
  'archiveShareFolder',
  'businessFormFolder',
  'usingRepFolder',
  'businessCollectionFolder', //业务系统收集文件夹
  'userPersonalFolder',
  'deptFileFolder',
  'releaseFolder',
  'ermsSubjectFolder',
  'editResearchSubjectFolder',
  'archiveShareFolder',
  'filingRegistrationFolder',
  'ledgerFolder',
  'yearlyFormFolder',
  'fondVolumeFolder',
  'photoAchievementsPath',
  'fileAchievementsPath',
  'syncLibFolder',
  'fileCollectionFolder', //文件线上收集文件夹
  'externalCollectFolder',
  'databaseFolderPath',
  'isArchivesCenter',
  'subjectTaskFolder',
  'topicTaskPath',
  'topicTaskControlPath',
  'libraryArchivalFolder',
  'departmentDTOS',
] as const
// 增加
const initAdministrativeUserStore = (info: { [x: string]: any }) => {
  storeNameLists.forEach((name) => {
    const data = info[name]
    //值存在就设置
    localStorage.setItem(ENV.cookieName + name, JSON.stringify(data))
  })
}
// 删除
const removeFolderInfoByKey = (keyArr: string | string[]) => {
  if (keyArr instanceof Array) {
    keyArr.forEach((str) => {
      localStorage.removeItem(ENV.cookieName + str)
      return
    })
  } else {
    localStorage.removeItem(ENV.cookieName + keyArr)
  }
}
// 查
const getFolderInfoByKey = (keyArr: string | string[]): any => {
  let result: { [x: string]: any } = {}

  if (keyArr instanceof Array) {
    keyArr.forEach((str) => {
      result[str] = getFolderInfoByKeySingle(str)
      return
    })
  } else {
    result = getFolderInfoByKeySingle(keyArr)
  }

  if (result instanceof Object) {
    // 去除 js 对象中的空值以及空对象
    result = Object.fromEntries(
      Object.entries(result).filter(
        ([key, value]) => value !== null && value !== undefined && Object.keys(value).length !== 0
      )
    )
  }
  return result
}

const getFolderInfoByKeySingle = (key: string): any => {
  const folderInfo = window.localStorage.getItem(ENV.cookieName + key)
  let result = {}
  try {
    if (folderInfo && folderInfo != 'undefined') {
      result = JSON.parse(folderInfo)
    }
  } catch (error) {
    result = {}
  }
  return result
}

export default {
  initAdministrativeUserStore,
  getFolderInfoByKey,
  removeFolderInfoByKey,
}
