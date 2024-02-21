import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { UserForm, UserInfo, UserPageVO, UserQuery } from './types';

/**
 * 登录成功后获取用户信息（昵称、头像、权限集合和角色集合）
 */
export function getUserInfo(): AxiosPromise<UserInfo> {
  return request({
    url: '/api/v1/users/me',
    method: 'get'
  });
}

/**
 * 获取用户分页列表
 *
 * @param queryParams
 */
export function getUserPage(
  queryParams: UserQuery
): AxiosPromise<PageResult<UserPageVO[]>> {
  return request({
    url: '/oms-sys/api/user',
    method: 'get',
    params: queryParams
  });
}

/**
 * 获取用户表单详情
 *
 * @param userId
 */
export function getUserForm(userId: number): AxiosPromise<UserForm> {
  return request({
    url: '/api/v1/users/' + userId + '/form',
    method: 'get'
  });
}

/**
 * 添加用户
 *
 * @param data
 */
export function addUser(data: any) {
  return request({
    url: '/oms-sys/api/user',
    method: 'post',
    data: data
  });
}

/**
 * 修改用户
 *
 * @param id
 * @param data
 */
export function updateUser( data: any) {
  return request({
    url: '/oms-sys/api/user',
    method: 'put',
    data: data
  });
}

/**
 * 修改用户状态
 *
 * @param id
 * @param status
 */
export function updateUserStatus(id: any, status: any) {
  return request({
    url: '/users/' + id + '/status/'+status,
    method: 'put',
    params: { status: status }
  });
}

export function updateUserStatu(id: any, status: any) {
  return request({
    url: '/oms-sys/api/user/' + id+'/status/'+status,
    method: 'put',
    // params: params
  });
}
/**
 * 修改用户密码
 *
 * @param id
 * @param password
 */
export function updateUserPassword(id: number, password: string) {
  return request({
    url: '/api/v1/users/' + id + '/password',
    method: 'patch',
    params: { password: password }
  });
}

/**
 * 删除用户
 *
 * @param ids
 */
export function deleteUsers(data:any) {
  return request({
    url: '/oms-sys/api/user/pwd',
    method: 'put',
    data:data
  });
}

/**
 * 下载用户导入模板
 *
 * @returns
 */
export function downloadTemplateApi() {
  return request({
    url: '/api/v1/users/template',
    method: 'get',
    responseType: 'arraybuffer'
  });
}

/**
 * 导出用户
 *
 * @param queryParams
 * @returns
 */
export function exportUser(queryParams: UserQuery) {
  return request({
    url: '/api/v1/users/_export',
    method: 'get',
    params: queryParams,
    responseType: 'arraybuffer'
  });
}

/**
 * 导入用户
 *
 * @param file
 */
export function importUser(deptId: number, file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return request({
    url: '/api/v1/users/_import',
    method: 'post',
    params: { deptId: deptId },
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}
