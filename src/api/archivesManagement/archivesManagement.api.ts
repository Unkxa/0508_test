import request from '@/common/network/request'
import { ApiUrl } from './archivesManagement.url'
import { axiosIns } from '@/common/network/ajax'

import { FilterColumn, QueryParameter } from '@/common/types/common'

import ENV from '@/common/config'
import store from '@/common/toolFun/initStore'
export enum Affiliated_Module_Enums {
  业务系统收集 = '业务系统收集',
  外部信息收集 = '外部信息收集',
  文件线上收集 = '文件线上收集',
  文件线下收集 = '文件线下收集',
  全宗卷管理 = '全宗卷管理',
  文件归档 = '文件归档',
  部门文件 = '部门文件',
  证照库 = '证照库',
}

class ArchiveManagementApi {
  /**
   * 获取视图
   * @param data 分页参数
   * @returns
   */
  getViewList = (data: any) => request.post(ENV.administrativeApiUrl + ApiUrl.getViewList, data)
  getObjectList = (parentId: string, parameter: QueryParameter, scene = '', labelStatus = '') =>
    request.post(
      ENV.administrativeApiUrl + ApiUrl.getObjectList,
      {
        ...parameter,
      },
      {
        params: {
          parentId,
          scene,
          labelStatus,
        },
      }
    )
  /**
   * 业务系统收集列表获取
   * @param parentId
   * @param parameter
   * @param archiveType
   * @returns
   */
  getSystemCollectionList = (
    parentId: string,
    parameter: QueryParameter,
    archiveType: 'da_record' | 'da_volume' | 'da_in_volume'
  ) =>
    request.post(ENV.administrativeApiUrl + ApiUrl.getSystemCollectionList, parameter, {
      params: {
        parentId,
        archiveType: archiveType === 'da_record' ? 'da_record' : 'da_volume',
      },
    })
  /**
   * 获取全部卷内件
   * @param parentId
   * @param parameter
   * @param labelStatus
   * @returns
   */
  getAllInVolumeRecordList = (parentId: string, parentPath: string, parameter: QueryParameter, labelStatus = '') =>
    request.post(
      ENV.administrativeApiUrl + ApiUrl.getAllInVolumeRecordList,
      {
        ...parameter,
      },
      {
        params: {
          parentId,
          parentPath,
          labelStatus,
        },
      }
    )
  /**
   * 根据视图更新档案
   * @param data
   * @param params
   * @returns
   */
  findArchivesByWrapper = (data: any) =>
    request.post(ENV.administrativeApiUrl + ApiUrl.findArchivesByWrapper, data, { params: {} })
  /**
   * 根据视图的配置,获取数据详情
   */
  getDataByView = (data: any, params: any) =>
    request.post(ENV.administrativeApiUrl + ApiUrl.getDataByView, data, { params })
  /**
   * 根据id获取面包屑
   * @param id
   * @returns
   */
  getBreadCrumbsById = (id: string) =>
    request.get(ENV.administrativeApiUrl + ApiUrl.getBreadCrumbsById, { params: { id } })
  /**
   * 根据文件计划id获取分类详情
   * @param filePlanId
   * @returns
   */
  findCateIdByPlanId = (filePlanId: string) =>
    request.get(ENV.administrativeApiUrl + ApiUrl.findCateIdByPlanId, { params: { filePlanId } })
  /**
   * 根据元数据id获取列配置
   * @param metadataSchemeId
   * @returns
   */
  getFormColumnConfigByMetadataSchemeId = (metadataSchemeId: string) =>
    request.get(ENV.administrativeApiUrl + ApiUrl.getFormColumnConfigByMetadataSchemeId, {
      params: { metadataSchemeId },
    })
  /**
   * 获取元数据配置列
   * @param metadataSchemeId 元数据方案Id
   * @param typeName 类型名称
   */
  getAttrListsByMetadataId = (metadataSchemeId: string, typeName: string) =>
    request.get(ENV.administrativeApiUrl + ApiUrl.getAttributeList, { params: { metadataSchemeId, typeName } })
  /**
   * 获取标准代码项
   * @param objectName
   * @returns
   */
  // todo yc 以后添加到状态管理器中 不要多次请求
  getStandardCodeByName = (objectName: string) =>
    request.get(ENV.administrativeApiUrl + ApiUrl.getStandardCodeByName, { params: { objectName } })
  /**
   * 获取标准代码项
   * @param objectName
   * @returns
   */
  getRootCategoryInfo = (id: string) =>
    request.get(ENV.administrativeApiUrl + ApiUrl.getRootCategoryInfo, { params: { id } })
  /**
   * 视图档案列表
   * @param objectName
   * @returns
   */
  viewArchiveList = (data: { queryParameter: QueryParameter; nodeData: string; viewId: string }) =>
    request.post(ENV.administrativeApiUrl + ApiUrl.viewArchiveList, data, { params: {} })
  /**
   * 软删除，放入回收站
   * @param data
   * @returns
   */
  putInRecycle = (data: { ids: string[]; affiliatedModule: Affiliated_Module_Enums }) =>
    request.post(ENV.administrativeApiUrl + ApiUrl.putInRecycle, data)
  /**
   * 将案卷放入回收站
   * @param data
   * @returns
   */
  putVolumeInRecycle = (data: { ids: string[]; affiliatedModule: Affiliated_Module_Enums }) =>
    request.post(ENV.administrativeApiUrl + ApiUrl.putVolumeInRecycle, data)
  /**
   * 将案件放入回收站
   * @param data
   * @returns
   */
  putRecordInRecycle = (data: { ids: string[]; affiliatedModule: Affiliated_Module_Enums }) =>
    request.post(ENV.administrativeApiUrl + ApiUrl.putRecordInRecycle, data)
  /**
   * 下载档案原文和元数据xml
   * @param data
   * @returns
   */
  downloadArchive = (data: { filterMetadata: boolean; ids: string[]; primaryConsiderField: string }) =>
    request.post(ENV.administrativeApiUrl + ApiUrl.downloadArchive, data, { responseType: 'blob' })
  /**
   * 根据门类id获取年度计划列表
   * @param id
   * @returns
   */
  getYearListsByCategoryId = (id: string) =>
    request.get(ENV.administrativeApiUrl + ApiUrl.getYearListsByCategoryId, { params: { id: id } })
  /**
   * 设置年度
   * @param data
   * @returns
   */
  setYear = (data: {
    newYear: string
    objectIds: string[]
    filePlanName: string
    columns?: any[]
    isSelectAll?: boolean
    removeArchiveIds?: string[]
  }) => request.put(ENV.administrativeApiUrl + ApiUrl.setYear, data)
  /**
   * 生成档号
   * @param data
   * @returns
   */
  generateArchivesCode = (data: {
    whetherCover: string
    categoryCode: string
    idList: string[]
    columns: []
    isSelectAll: false
    removeArchiveIds: []
    metadataSchemeId: string
    sceneCode: 'erms_gdhj'
  }) => request.post(ENV.administrativeApiUrl + ApiUrl.generateArchivesCode, data)

  /**
   * 手动打标
   * @param data
   * @returns
   */
  markArchive = (data: {
    labelNameList: string[] //标签列表
    archiveIdList: string[] //档案列表
    removeManualLabelNameList: string[] //收集删除的手动标签
    addManualLabelNameList: string[] //收集新添加的手动标签
    removeAutoLabelNameList: string[] //移除的自动标签
    /**
     * 跨页全选参数
     */
    column?: FilterColumn[]
    isSelectAll?: boolean
    removeArchiveIds?: string[]
  }) => request.post(ENV.administrativeApiUrl + ApiUrl.markArchive, data)
  /**
   * 标签提取
   * @param data
   * @returns
   */
  labelExtraction = (data: {
    recordIdList: string[]
    columns: FilterColumn[]
    isSelectAll: boolean
    removeArchiveIds: string[]
  }) =>
    request.post(ENV.administrativeApiUrl + ApiUrl.labelExtraction, data, {
      message: { options: { content: '操作成功', type: 'success' } },
    })
  /**
   * 格式转化
   * @param data
   * @returns
   */
  startConvertFormat = (data: {
    archivesIds: any[]
    columns?: FilterColumn[]
    isSelectAll?: boolean
    removeArchiveIds?: string[]
  }) => request.post(ENV.administrativeApiUrl + ApiUrl.startConvertFormat, data)
  /**
   *
   * @param data
   * @returns
   */
  archiveDocumentDigitization = (data: {
    ids: any[]
    columns?: FilterColumn[]
    isSelectAll?: boolean
    removeArchiveIds?: string[]
  }) => request.post(ENV.administrativeApiUrl + ApiUrl.archiveDocumentDigitization, data)
  /**
   * 四性检测
   * @param data
   * @returns
   */
  validator = (data: {
    validatorType: '01' | '02'
    sceneCode: 'erms_smzj' | 'erms_zljh'
    columns?: FilterColumn[]
    isSelectAll?: boolean
    removeArchiveIds?: string[]
  }) => {
    if (data.validatorType == '02') {
      data.sceneCode = 'erms_smzj'
    } else {
      data.sceneCode = 'erms_zljh'
    }
    return request.post(ENV.administrativeApiUrl + ApiUrl.validator, data)
  }
  /**
   * 归档前置校验
   * @param data
   * @returns
   */
  archivesValidateCheck = (data: {
    idList: string[]
    columns: FilterColumn[]
    isSelectAll: boolean
    removeArchiveIds: string[]
    sceneCode: 'erms_gdhj'
    whetherVolume: boolean
  }) => request.post(ENV.administrativeApiUrl + ApiUrl.archivesValidateCheck, data)
  /**
   * 判断是否存在实体档案
   * @param data
   * @returns
   */
  isExistencePhysicalArchive = (data: { columns: FilterColumn[]; removeArchiveIds: string[] }) =>
    request.post(ENV.administrativeApiUrl + ApiUrl.isExistencePhysicalArchive, data)
  /**
   * 获取绑定的库房
   * @param categoryId
   * @returns
   */
  getBindWarehouseByCategoryId = (categoryId: string) =>
    request.get(ENV.administrativeApiUrl + ApiUrl.getBindWarehouseByCategoryId, { params: { categoryId } })
  /**
   * 案卷归档
   * @param param0
   * @returns
   */
  archiveVolume = ({
    idList = [],
    sceneCode = '',
    whetherCheckDuplicate = true,
    whetherToFileNumber = true,
    classId = '',
    columns = [],
    isSelectAll = false,
    removeArchiveIds = [],
    whetherGeneratedCode = true,
    warehouseNo = '',
  }) =>
    request.put(ENV.administrativeApiUrl + ApiUrl.archiveVolume, {
      volumeIdList: idList,
      sceneCode,
      whetherCheckDuplicate,
      whetherToFileNumber,
      classId,
      columns,
      isSelectAll,
      removeArchiveIds,
      whetherGeneratedCode,
      warehouseNo,
    })
  /**
   * 案件归档
   * @param param0
   * @returns
   */
  archiveRecord = ({
    idList = [],
    sceneCode = '',
    whetherCheckDuplicate = true,
    whetherToFileNumber = true,
    classId = '',
    columns = [],
    isSelectAll = false,
    removeArchiveIds = [],
    whetherGeneratedCode = true,
    warehouseNo = '',
    detailLabel = '',
  }) =>
    request.put(ENV.administrativeApiUrl + ApiUrl.archiveRecord, {
      idList,
      sceneCode,
      whetherCheckDuplicate,
      whetherToFileNumber,
      classId,
      columns,
      isSelectAll,
      removeArchiveIds,
      whetherGeneratedCode,
      warehouseNo,
      detailLabel,
    })
  /**
   * 获取标错信息
   * @param param0
   * @returns
   */
  getMarkDetails = (markErrorRecordId: string) =>
    request.get(ENV.administrativeApiUrl + ApiUrl.getMarkDetails, { params: { markErrorRecordId } })
  /**
   * 确认标错
   * @param param0
   * @returns
   */
  createOrUpdateMarkErrorRecord = (data: any) =>
    request.post(ENV.administrativeApiUrl + ApiUrl.createOrUpdateMarkErrorRecord, data)
  /**
   * 确认备份
   * @param param0
   * @returns
   */
  backUps = (data: any) => request.post(ENV.administrativeApiUrl + ApiUrl.backUps, data)
  /**
   * 档案鉴定
   * @param param0
   * @returns
   */
  addAppraisalLibrary = (data: any) => request.post(ENV.administrativeApiUrl + ApiUrl.addAppraisalLibrary, data)
  /**
   * 获取原始路径对应的folder不存在的档案id集合
   * @param data 档案id集合
   * @returns
   */
  getSourceFolderNonexistentIdList = (data: any) =>
    request.post(ENV.administrativeApiUrl + ApiUrl.getSourceFolderNonexistentIdList, data)
  /**
   * 获取文件计划集合
   */
  getFilePlanList = (categoryId: string) =>
    request.get(ENV.administrativeApiUrl + ApiUrl.getFilePlanList, { params: { categoryId } })
  /**
   * 档案退回到线下收集
   */
  rearrange = (data: any) => request.post(ENV.administrativeApiUrl + ApiUrl.rearrange, data)
  /**
   * 设置档案原始路径
   */
  modifyRearrangeSourcePath = (data: any) =>
    request.post(ENV.administrativeApiUrl + ApiUrl.modifyRearrangeSourcePath, data)
  /**
   * 根据元数据id获取配置列
   * @param metadataSchemeId
   * @returns
   */
  getColumnByMetadataId = (metadataSchemeId: string) =>
    request.get(ENV.administrativeApiUrl + ApiUrl.getColumnByMetadataId, { params: { metadataSchemeId } })
  /**
   * 指定分类
   * @param data
   * @returns
   */
  updateClassification = (data: {
    archiveIdList: string[]
    classId: string
    archiveScopeId?: string
    archiveScopeName?: string
    subdivisionLabelId?: string
    contentLabelName?: string
    retentionPeriod?: string
  }) => {
    const {
      archiveIdList,
      classId,
      archiveScopeId = '',
      archiveScopeName = '',
      subdivisionLabelId = '',
      contentLabelName = '',
      retentionPeriod = '',
    } = data
    return request.post(ENV.administrativeApiUrl + ApiUrl.updateClassification, {
      archiveIdList,
      classId,
      archiveScopeId,
      archiveScopeName,
      subdivisionLabelId,
      contentLabelName,
      retentionPeriod,
    })
  }
  /**
   * 卷内重新整理
   * @param data
   * @returns
   */
  archiveRecordRearrange = (data: any) => request.post(ENV.administrativeApiUrl + ApiUrl.archiveRecordRearrange, data)
  /**
   * 档案移交导出
   * @param data
   * @returns
   */

  archiveTransferExport = (data: any) =>
    request.post(ENV.administrativeApiUrl + ApiUrl.archiveTransferExport, data, { responseType: 'blob' })
  /**
   * 提前移交
   * @param data
   * @returns
   */
  archiveEarlyHandover = (data: any) => request.post(ENV.administrativeApiUrl + ApiUrl.archiveEarlyHandover, data)
  /**
   * 入档案编研、入专题库
   * @param data
   * @returns
   */
  linkArchiveToTarget = (data: any) =>
    request.post(ENV.administrativeApiUrl + ApiUrl.linkArchiveToTarget, data, {
      message: { options: { content: '操作成功', type: 'success' } },
    })
  /**
   * 获取门类信息
   * @param id
   * @returns
   */
  getCategoryDetail = (id: string) =>
    request.get(ENV.administrativeApiUrl + ApiUrl.getCategoryDetail, { params: { id } })
  /**
   * 入档案编研、入专题库
   * @param data
   * @returns
   */
  syncDataToSyncLibrary = (data: any) => request.post(ENV.administrativeApiUrl + ApiUrl.syncDataToSyncLibrary, data)
  /**
   * 获取共享单位
   * @param data
   * @returns
   */
  getShareUnitList = (name: string, data?: any) =>
    request.post(ENV.administrativeApiUrl + ApiUrl.getShareUnitList, data, { params: { name } })
  /**
   * 发起共享
   * @param data
   * @returns
   */
  launchShare = (data: any) => request.post(ENV.administrativeApiUrl + ApiUrl.launchShare, data)
  /**
   * 获取案卷信息
   * @param parentId
   * @returns
   */
  getVolumeListByParentId = (parentId: string) =>
    request.get(ENV.administrativeApiUrl + ApiUrl.getVolumeListByParentId, { params: { parentId } })
  /**
   *  移动文件到卷内
   * @param data
   * @returns
   */
  moveInVolume = (data: { sourceIds: Array<string>; targetId: string }) =>
    request.post(ENV.administrativeApiUrl + ApiUrl.moveInVolume, data)
  /**
   *  导出
   * @param data
   * @returns
   */
  exportHouseDocument = (data: any) => request.post(ENV.administrativeApiUrl + ApiUrl.exportHouseDocument, data)
  /**
   * 通过上级目录id获取分类
   * @param parentId 父文件夹ID串，通常是一个，刷新页面为保持页面同步会用“*”分割
   */
  getClassTreeNodeListByParentId = (parentId: string, collectionWay?: 'da_record' | 'da_volume') =>
    request.get(ENV.administrativeApiUrl + ApiUrl.getClassTreeNodeList, { params: { parentId, collectionWay } })
  getTreeNodeListByParentId = (parentId: string, collectionWay?: 'da_record' | 'da_volume') =>
    request.get(ENV.administrativeApiUrl + ApiUrl.getTreeNodes, { params: { parentId, collectionWay } })

  getPrintModuleListByMetadataId = (id: string) =>
    request.get(ENV.administrativeApiUrl + ApiUrl.getPrintModuleListByMetadataId, { params: { id } })

  checkBeforePrint = (data: any) => request.post(ENV.administrativeApiUrl + ApiUrl.checkBeforePrint, data)

  printData = (data: any) => request.post(ENV.administrativeApiUrl + ApiUrl.printData, data, { responseType: 'blob' })

  getPrintData = (data: any) => request.post(ENV.administrativeApiUrl + ApiUrl.getPrintData, data)

  getSelectAllList = (parentId: string, data?: any) =>
    request.post(ENV.administrativeApiUrl + ApiUrl.getSelectAllList, data, { params: { parentId } })

  printVolumeData = (data: any) =>
    request.post(ENV.administrativeApiUrl + ApiUrl.printVolumeData, data, { responseType: 'blob' })

  getBaseInfoByMetadataId = (metadataSchemeId: string, scene = 'erms_zljh') =>
    request.get(ENV.administrativeApiUrl + ApiUrl.getBaseInfoByMetadataId, { params: { metadataSchemeId, scene } })

  checkExcelRequiredValue = (metadataSchemeId: string) =>
    request.post(
      ENV.administrativeApiUrl + ApiUrl.checkExcelRequiredValue,
      { metadataSchemeId },
      { params: { metadataSchemeId } }
    )

  getDocMatchField = (data: any) => request.post(ENV.administrativeApiUrl + ApiUrl.getDocMatchField, data)

  getMappingRuleListByMetadataIdAndFondsId = (data: any) =>
    request.post(ENV.administrativeApiUrl + ApiUrl.getMappingRuleListByMetadataIdAndFondsId, data)
  /**
   * 批量修改
   * @param data
   * @returns
   */
  updateArchivesAttribute = (data: {
    ids: string[]
    isSelectAll: boolean
    columns: FilterColumn[]
    removeArchiveIds: string[]
    replaceColumns: FilterColumn[]
    isMetadataCode: boolean
    replaceWay: number | null
  }) => request.put(ENV.administrativeApiUrl + ApiUrl.updateArchivesAttribute, data)
  /**
   * 根据上传的excel解析sheet页
   * @param path 上传附件路径
   * @returns
   */
  getSheetInfoByPath = (path: string) =>
    request.get(ENV.administrativeApiUrl + ApiUrl.getSheetInfoByPath, { params: { path } })
  /**
   * 移动卷内件
   * @param data
   * @returns
   */
  moveRecordInVolume = (data: { recordIds: string[]; targetVolumeId: string; sourceVolumeId: string }) =>
    request.put(ENV.administrativeApiUrl + ApiUrl.moveRecordInVolume, data)
  /**
   * 删除映射规则
   * @param data
   * @returns
   */
  deleteMappingRule = (id: string) =>
    request.delete(ENV.administrativeApiUrl + ApiUrl.deleteMappingRule, { params: { id } })
  /**
   * 新建映射规则
   * @param data
   * @returns
   */
  saveMappingRule = (xml: any, name: string, metadataId: string) =>
    request.post(ENV.administrativeApiUrl + ApiUrl.saveMappingRule, {
      xml,
      name,
      metadataId,
      orgCode: store.getFolderInfoByKey(['unit']).unit.code,
      fondsDisplayName: store.getFolderInfoByKey(['unit']).unit.displayName,
    })
  /**
   * 修改映射规则
   * @param data
   * @returns
   */
  updateMappingRule = (xml: any, name: string, id: string, metadataId: string) =>
    request.put(ENV.administrativeApiUrl + ApiUrl.updateMappingRule, {
      xml,
      name,
      id,
      metadataId,
    })
  /**
   * 下载导入模板
   * @param data
   * @returns
   */
  downloadImportTemplate = (data: any) =>
    request.post(ENV.administrativeApiUrl + ApiUrl.downloadImportTemplate, data, { responseType: 'blob' })
  /**
   * 新建案卷
   * @param data
   * @returns
   */
  createVolume = (data: {
    parentId: string
    collectionWay: 'da_record' | 'da_volume'
    metadataSchemeId: string
    /**类目code和类目id */
    categoryId: string
    categoryCode: string
    /**版本号 */
    versionNo: string
    sceneCode: 'erms_zljh'
    classIds: string
    /**quickDes是指的是快速著录 */
    typeName: 'quickDes' | string
    /**元数据模板 */
    jsonMetadata: string
    documentIds: string
  }) => request.post(ENV.administrativeApiUrl + ApiUrl.createVolume, data)
  /**
   * 快速著录
   * @param data
   * @returns
   */
  villageCreateRecord = (data: any) => request.post(ENV.administrativeApiUrl + ApiUrl.villageCreateRecord, data)

  getCategoryCodeById = (id: string) =>
    request.get(ENV.administrativeApiUrl + ApiUrl.getCategoryCodeById, { params: { id } })

  getImportInfo = (importId: string) =>
    request.get(ENV.administrativeApiUrl + ApiUrl.getImportInfo, { params: { importId } })

  importDataSingle = (data: any) => request.post(ENV.administrativeApiUrl + ApiUrl.importDataSingle, data)

  /**
   * 数据导入
   * @param data
   * @returns
   */
  importData = (data: any) =>
    request.post(ENV.administrativeApiUrl + ApiUrl.importData, data, {
      message: { options: { content: '导入成功', type: 'success' } },
    })
  /**
   * 更新元数据
   * @param data
   * @returns
   */
  updateRecordForm = (data: { id: string; jsonMetadata: any }) =>
    request.put(ENV.administrativeApiUrl + ApiUrl.updateRecordForm, data)
  /**
   * 著录接口
   * @param data
   * @returns
   */
  createRecord = (data: {
    actionType: '0' | '1'
    collectionWay: 'record' | 'volume'
    categoryId: string
    jsonMetadata: string //xml的json格式
    parentId: string
    metadataSchemeId: string
    licensed?: boolean //是否是特许操作--暂时用不到
    documentIds: string[]
    categoryCode: string
    year?: string
    versionNo?: string
    sceneCode: string
    classIds: string
    typeName?: string
    labelNames?: string[]
  }) => request.post(ENV.administrativeApiUrl + ApiUrl.createRecord, data)
  /**
   * 获取元数据文件策略
   * @param metadataSchemeId
   * @returns
   */
  getRecordPolicyDetail = (metadataSchemeId: string) =>
    request.get(ENV.administrativeApiUrl + ApiUrl.getRecordPolicyDetail, { params: { metadataSchemeId } })
  /**
   * 获取格式转换状态
   * @param archiveId
   * @returns
   */
  getConvertFormatResult = (archiveId: string) =>
    request.get(ENV.administrativeApiUrl + ApiUrl.getConvertFormatResult, { params: { archiveId } })
  /**
   * 获取检测记录列表
   * @param data
   * @returns
   */
  getVerifyRecordsBatch = (data: any) => request.post(ENV.administrativeApiUrl + ApiUrl.getVerifyRecordsBatch, data)
  /**
   * 删除检测记录
   * @param data
   * @returns
   */
  delRecordbatch = (data: any) => request.delete(ENV.administrativeApiUrl + ApiUrl.delRecordbatch, { data })
  /**
   * 获取检测修订列表
   * @param data
   * @returns
   */
  getVerifyReviseBatch = (data: any) => request.post(ENV.administrativeApiUrl + ApiUrl.getVerifyReviseBatch, data)
  /**
   * 删除检测修订
   * @param data
   * @returns
   */
  delRevise = (data: any) => request.delete(ENV.administrativeApiUrl + ApiUrl.delRevise, { data })
  /**
   * 获取专题列表
   * @param data
   * @returns
   */
  getClassifyList = (data: any) => request.post(ENV.administrativeApiUrl + ApiUrl.getClassifyList, data)
  /**
   * 获取专题列表
   * @param data
   * @returns
   */
  getSubjectList = (data: any) => request.post(ENV.administrativeApiUrl + ApiUrl.getSubjectList, data)

  getSubjectArchiveList = (data: any) =>
    request.post(
      ENV.administrativeApiUrl + ApiUrl.getSubjectArchiveList,
      {
        columns: data.columns || [],
        pagingSort: data.pagingSort,
        sortList: data.sortList || [],
      },
      { params: { subjectId: data.subjectId, categoryId: data.categoryId || '' } }
    )

  /**
   * 获取专题下档案列表
   */
  getSubjectLinkedArchive = (data: any) =>
    request.post(
      ENV.administrativeApiUrl + ApiUrl.getSubjectLinkedArchive,
      {
        columns: data.columns || [],
        pagingSort: data.pagingSort,
        sortList: data.sortList || [],
      },
      { params: { subjectId: data.subjectId } }
    )

  /**
   * 获取编研车中的档案列表
   * @returns
   */
  getCompilingCarList = (typeName: '专题库编研车' | '编研库编研车') =>
    request.get(ENV.administrativeApiUrl + ApiUrl.getCompilingCarList, { params: { typeName } })

  /**
   * 一键同步
   * @returns
   */
  oneClickSync = (subjectId: string) => request.post(ENV.administrativeApiUrl + ApiUrl.oneClickSync, { subjectId })

  /**
   * 移除专题库
   * @returns
   */
  archiveUnlink = (data: any) =>
    request.post(ENV.administrativeApiUrl + ApiUrl.archiveUnlink, data, {
      message: { options: { content: '操作成功', type: 'success' } },
    })

  /**
   * 把档案加入到编研车
   * @returns
   */
  addEditingStore = (objectIdList: Array<string>, typeName: '专题库编研车' | '编研库编研车') =>
    request.post(
      ENV.administrativeApiUrl + ApiUrl.addEditingStore,
      { objectIdList, typeName },
      {
        message: { options: { content: '操作成功', type: 'success' } },
      }
    )

  /**
   * 把档案加入到编研车
   * @returns
   */
  getArchivesFromEditingStore = (typeName: '专题库编研车' | '编研库编研车') =>
    request.get(ENV.administrativeApiUrl + ApiUrl.getArchivesFromEditingStore, { params: { typeName } })

  /**
   * 从编研车中删除档案
   * @returns
   */
  removeArchivesFromEditingStore = (data: any) =>
    request.delete(ENV.administrativeApiUrl + ApiUrl.removeArchivesFromEditingStore, { data })

  /**
   * 专题库导出数据
   * @returns
   */
  exportData = (data: any) => request.post(ENV.administrativeApiUrl + ApiUrl.exportData, data, { responseType: 'blob' })

  /**
   * 专题库导出报表
   * @returns
   */
  archivesExport = (data: any) =>
    request.post(ENV.administrativeApiUrl + ApiUrl.archivesExport, data, { responseType: 'blob' })

  /**
   * 获取加入拉取规则
   */
  getSubjectRule = (subjectId: string) =>
    request.post(ENV.administrativeApiUrl + ApiUrl.getSubjectRule, {
      columns: [
        {
          filterConditionCode: 5,
          name: 'da_subject_id',
          type: 'string',
          value: subjectId,
        },
      ],
      pagingSort: {
        currentPage: 1,
        pageSize: 999999,
      },
      sortList: [],
    })

  /**
   * 删除分类
   */
  deleteClassify = (subjectClassificationId: string) =>
    request.delete(ENV.administrativeApiUrl + ApiUrl.deleteClassify, { params: { subjectClassificationId } })

  /**
   * 删除专题
   */
  deleteSubject = (subjectId: string) =>
    request.delete(ENV.administrativeApiUrl + ApiUrl.deleteSubject, { params: { subjectId } })

  /**
   * 修改专题
   * @param data
   */
  updateClassify = (data: any) =>
    request.put(ENV.administrativeApiUrl + ApiUrl.updateClassify, data, {
      message: { options: { content: '操作成功', type: 'success' } },
    })

  /**
   * 创建专题任务分类
   * @param queryParameter
   * @returns
   */
  createTaskClassification = (data: any) =>
    request.post(ENV.administrativeApiUrl + ApiUrl.createTaskClassification, data)

  /**
   * 创建专题
   * @param data
   */
  createClassify = (data: any) => request.post(ENV.administrativeApiUrl + ApiUrl.createClassify, data)

  /**
   * 获取分类列表
   * @param queryParameter
   * @returns
   */
  subjectDetail = (id: string) => request.get(ENV.administrativeApiUrl + ApiUrl.subjectDetail, { params: { id } })

  /**
   * 创建专题
   * @param data
   */
  createSubject = (data: any) => request.post(ENV.administrativeApiUrl + ApiUrl.createSubject, data)

  /**
   * 修改专题
   * @param data
   */
  updateSubject = (data: any) => request.put(ENV.administrativeApiUrl + ApiUrl.updateSubject, data)

  /**
   * 编研库导出报表
   * @returns
   */
  subjectArchivesExport = (data: any) =>
    request.post(ENV.administrativeApiUrl + ApiUrl.subjectArchivesExport, data, { responseType: 'blob' })

  /**
   * 规则创建
   * @returns
   */
  createRule = (data: any) => request.post(ENV.administrativeApiUrl + ApiUrl.createRule, data)
  /**
   * 规则更新
   * @returns
   */
  updateRule = (data: any) => request.put(ENV.administrativeApiUrl + ApiUrl.updateRule, data)
  /**
   * 规则删除
   * @returns
   */
  deleteRules = (data: any) => request.delete(ENV.administrativeApiUrl + ApiUrl.deleteRule, data)

  /**
   * 查看编研单详情
   * @returns
   */
  getCompilingFormDetails = (compilingFormId: string) =>
    request.get(ENV.administrativeApiUrl + ApiUrl.getCompilingFormDetails, { params: { compilingFormId } })
  /**
   * 查看编研单详情
   * @returns
   */
  execAutoJoin = (subjectId: string) =>
    request.post(ENV.administrativeApiUrl + ApiUrl.execAutoJoin, null, {
      params: { subjectId },
      message: { options: { content: '操作成功', type: 'success' } },
    })
}
const archiveManagementApi = new ArchiveManagementApi()
export default archiveManagementApi
