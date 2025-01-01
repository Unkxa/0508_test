/**
 * 权限功能使用, 不许写别的
 */
export enum PermissionList {
  'NONE' = 10,
  'BROWSE' = 20,
  'PREVIEW' = 26,
  'PRINT' = 28,
  'READ_ONLY' = 30,
  'DOWNLOAD' = 32,
  'RELATION' = 36,
  'VERSION' = 40,
  'WRITE' = 50,
  'DELETE' = 60,
  'ASSOCIATE' = 36,
  'CHANGEPERMIT' = 1000,
  'CHANGEOWNER' = 1010,
  'EXDELETE' = 1020,
}
