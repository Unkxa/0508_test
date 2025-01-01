import { OtherManage } from './other.enum'
import { BasicUnitInformation } from './basicUnitInformation.enum'
import { basicInfoBaseManage } from './basicInfoBase.enum'
import { BusinessAnalysisManage } from './businessAnalysis.enum'
import { talentPool } from './talentPool.enum'
import { KnowledgeBase } from './kowledgeBase.enum'
import { ArchivalPublicity } from './archivalPublicity.enum'
import { RankEvaluation } from './rankEvaluation.enum'
import { PraiseRecognize } from './praiseRecognize.enum'
import { JobIndexEvaluationManage } from './jobIndexEvaluation.enum'
import { ConstructionProject } from './constructionProject.enum'
import { ProfessionalGuidance } from './professionalGuidance.enum'
import { BusinessConstruction } from './businessConstruction.enum'
import { DigitalArchiveRoomConstruction } from './digitalArchiveRoomConstruction.enum'
import { PerformanceAppraisal } from './performanceAppraisal.enum'
import { SpecialFund } from './specialFund.enum'
export const PERMISSION_CODE: { [x: string]: string } = {
  ...BasicUnitInformation,
  ...BusinessAnalysisManage,
  ...basicInfoBaseManage,
  ...OtherManage,
  ...talentPool,
  ...KnowledgeBase,
  ...ArchivalPublicity,
  ...RankEvaluation,
  ...PraiseRecognize,
  ...JobIndexEvaluationManage,
  ...ConstructionProject,
  ...ProfessionalGuidance,
  ...BusinessConstruction,
  ...DigitalArchiveRoomConstruction,
  ...PerformanceAppraisal,
  ...SpecialFund,
}
//去重
Object.keys(PERMISSION_CODE).forEach((key) => {
  PERMISSION_CODE[key] = key
})

type ValueOf<T> = T[keyof T]

export type PERMISSION_CODE = ValueOf<typeof PERMISSION_CODE>

export type PERMISSION_NAME = keyof typeof PERMISSION_CODE

export type PERMISSION_ITEM = PERMISSION_NAME | PERMISSION_CODE

export type PERMISSION_PARAMS = PERMISSION_ITEM | PERMISSION_ITEM[]
