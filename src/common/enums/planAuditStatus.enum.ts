/**
 * @disposition 审核状态
 * @param {string} approved 审核通过
 * @param {string} noApproved 审核不通过
 * @param {string} waitApproving 待审核
 *
 */
export enum planAuditStatusEnum {
  APPROVED = '审核通过',
  APPROVING = '审核中',
  REJECT = '审核不通过',
  PENDING_APPROVE = '待审核',
}
