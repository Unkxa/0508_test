/**
 *
 * 存放 type 和 interface
 */

import { AxiosPromise, AxiosResponse } from 'axios'
import { FILTER_CODE } from '@/common/enums/query-parameter.enum'
export type FilterTypes = 'string' | 'int' | 'date' | 'boolean'
export interface Pager {
  currentPage?: number
  pageSize?: number
  totalCount?: number
}

export interface AxiosReturnTypes extends AxiosResponse {
  code?: string
  data?: any
  result: any
  message?: string
  requestId?: string
  timestamp?: number
  uri?: string
  totalCount?: number
  config: any
  [keys: string]: any
}

export interface FilterOptions {
  code?: FILTER_CODE
  type?: FilterTypes
  enableFlag?: boolean
  isDateRange?: boolean
}

export interface FilterColumn {
  name: string
  value: string | number
  type: FilterTypes
  filterConditionCode: FILTER_CODE
}

export interface PagingSort {
  currentPage: number
  pageSize: number
  totalCount: number
  pageCount: number
  sortField?: string
  sortWay?: 'desc' | 'asc'
  sortFieldType?: unknown
  startIndex: number
  endIndex: number
}
export interface QueryParameter {
  pagingSort: PagingSort
  columns: FilterColumn[]
  sortList: { sortField: string; sortWay: 'desc' | 'asc' }
  queryConditionByColumnFields?: string
}
