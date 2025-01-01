export type PERMISSION_MAPPER_KEY = keyof typeof PERMISSION_MAPPER
export enum PERMISSION_MAPPER {
  S = 'administrative',
  S_NAME = '行政管理平台',
  pass = 'pass',
  blocked = 'blocked',

  // 操作公用
  新增 = 'add',
  编辑 = 'edit',
  导入 = 'import',
  删除 = 'delete',
  查看 = 'check',
  设置页面 = 'setting',
  知识库 = 'kowledgeBase',
  首页 = 'kowledgeBaseHome',
  分类管理 = 'classifyManage',
  文件管理 = 'filesManage',
  知识采集 = 'knowledgeAcquisition',
  下载 = 'download',
  保存 = 'save',
  恢复 = 'recover',
  报送 = 'report',
  配置 = 'config',
  开关 = 'switch',
  查看附件 = 'checkFile',
  流程记录 = 'processRecord',
  填报 = 'fillIn',
  继续填报 = 'continueFillIn',
  整改 = 'rectify',
  催办 = 'urge',
  预览 = 'preview',
  审查 = 'examine',
  审核 = 'audit',
  评分 = 'score',
  修改评分 = 'editScore',
  发布 = 'publish',
  撤销 = 'revoke',
  详情 = 'detail',
  上传 = 'upload',
  公示 = 'publish',
  异议 = 'objection',
  决定 = 'decide',
  提交 = 'submit',
  撤回 = 'revocation',
  评审 = 'review',
  确认 = 'confirm',
  批量删除 = 'batchDelete',
  综合档案馆导入 = 'dagImport',
  机关导入 = 'jgImport',
  企事业单位导入 = 'qsyImport',
  批量审查 = 'batchReview',
  批量审核 = 'batchExamine',
  批量审定 = 'batchAuthorize',
  发起申请 = 'launchApplication',
  创建子任务 = 'createSubtask',

  //市馆个性化
  市馆个性化 = 'diyIchidate',

  // 单位基础信息维护
  单位基础信息维护 = 'basicUnitInformation',
  档案工作框架 = 'fileWorkFramework',
  基本信息 = 'basicInformation',
  人员组织 = 'personnelOrganization',
  管理制度 = 'managementSystem',
  基础设施 = 'basicImplement',
  库房 = 'warehouse',
  设备 = 'equipment',
  系统 = 'system',
  大事记 = 'bigEvent',
  大事记记录 = 'bigEventRecord',
  时间轴 = 'timeline',
  指导意见 = 'guidanceOpinion',
  组织机构沿革 = 'administrativeHistory',
  组织机构沿革子 = 'administrativeHistoryChild',
  //业务数据仓
  业务数据仓 = 'businessAnalysis',
  业务管理 = 'businessModel',
  数据管理 = 'businessDataWarehouse',
  信息集字段定义 = 'infoDefinition',
  信息数据管理 = 'infoDataManagement',
  省信息集数据报送 = 'infoDataSubmitted',
  指标管理 = 'targetManagement',

  人才队伍 = 'talentTeam',
  人才库 = 'talentPool',
  人才申报 = 'teamTalentApplication',
  申报列表 = 'talentApplication',

  // 基础信息库
  基础信息库 = 'basicInfoBase',
  单位机构设置 = 'unitAgency',
  监督检查对象库 = 'checkObjectLibrary',
  档案局库 = 'archivesOfficeLibrary',
  档案馆库 = 'archivesLibrary',

  //
  业务考核管理 = 'jobIndexEvaluation',
  考核模板配置 = 'indexConfigPage',
  考核内容填报 = 'indexRegisterPage',
  考核任务管理 = 'indexManagePage',
  考核单位列表 = 'assesUnitIndex',

  // 档案宣传
  档案宣传 = 'archivalPublicity',
  约稿管理 = 'contributionManagement',
  投稿管理 = 'submissionManagement',
  刊稿库 = 'manuscriptBase',
  宣传报道员管理 = 'publicityReporterManagement',

  //职称评审
  职称评审 = 'rankEvaluation',
  职称评审子 = 'rankReview',
  职称人员库 = 'professionalTitleDatabase',
  评审委员会库 = 'reviewBoardLibrary',
  试题库 = 'itemBank',

  //表彰表扬
  表彰表扬 = 'praiseRecognize',
  表彰 = 'recognize',
  表扬 = 'praise',
  新增表彰任务 = 'addRecognizeTask',
  导出自定义表 = 'export',
  资料填报 = 'dataFillIn',
  新增个人集体 = 'addPersonalCollective',
  提交资料 = 'submitData',
  审核完成 = 'auditComplete',
  发布公示 = 'publishPublicity',
  发布决定 = 'publishDecision',
  市级名额分配 = 'cityQuotaAllocation',
  确认名额 = 'confirmQuota',
  导出对象汇总表 = 'exportObjectSummaryTable',
  导出推荐对象汇总表 = 'exportRecommendObjectSummaryTable',
  我发送的 = 'mySend',
  新增表扬任务 = 'addPraiseTask',
  发送给我 = 'sendToMe',
  下载公示 = 'downloadPublicity',
  下载汇总附件表 = 'downloadSummaryAttachmentTable',
  决定通知 = 'decisionNotification',
  公示通知 = 'publicityNotification',
  省级审核 = 'provincialAudit',
  市级审核 = 'cityAudit',
  // 资金奖补项目
  资金奖补项目 = 'constructionProject',
  资金奖补项目管理 = 'projectDeclaration',
  新增资金奖补项目任务 = 'addConstructionProjectTask',
  设置评价指标 = 'setEvaluationIndex',
  资金奖补项目填报 = 'constructionProjectFillIn',
  项目库 = 'projectLibrary',
  储备库 = 'reserveLibrary',
  资金奖补项目管理详情 = 'constructionProjectDetail',
  资金奖补项目任务 = 'constructionProjectTask',

  // 绩效考核
  绩效考核 = 'performanceAppraisal',
  指标体系管理 = 'indicatorManage',
  绩效考评管理 = 'performanceManage',

  //业务指导
  业务指导 = 'professionalGuidance',
  收集档案规范细则管理 = 'specificationManagement',
  新增收集档案规范细则 = 'createCollectionOfFileSpecifications',
  年度工作 = 'annualWork',
  年度工作管理 = 'annualWorkManagement',
  年度工作填报 = 'annualWorkReport',
  馆库建设 = 'libraryConstruction',
  开放工作 = 'openWork',
  开放工作管理 = 'openWorkManage',
  开放工作库 = 'openWorkLibrary',

  //标准化建设
  标准化建设 = 'standardConstruct',
  档案室业务建设评价 = 'businessConstruction',
  评价指标模板配置 = 'indicatorTemplate',

  //数字档案馆(室)建设
  数字档案馆室建设 = 'digitalArchiveRoomConstruction',
  数字档案室建设测评 = 'roomConstruction',
  数字档案馆系统测评 = 'archiveSystemAssessment',
  数字档案室建设测评管理 = 'evaluationManagement',
  数字档案馆建设测评管理 = 'archivesCenterEvaluationManagement',

  //专项资金
  专项资金 = 'specialFund',
  新增专项资金任务 = 'addSpecialFundTask',
  专项资金管理 = 'management',
  专项资金任务 = 'specialFundTask',
  资金分配 = 'allocate',
  项目管理 = 'projectManage',
}