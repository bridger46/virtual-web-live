import request from "../utils/request";
import config from "../config";

/**
 * @method 登录
 * @param {Object} data 请求数据
 * @returns
 */
export function applogin(data) {
  return request({
    url: `/userregistration/applogin`,
    method: "post",
    headers: {
      isToken: false,
    },
    data: {
      ...data,
      deptId: config.agentId
    },
  });
}

/**
 * @method 获取当前用户信息
 * @returns
 */
export function getUserInfo() {
  return request({
    url: `/getInfo`,
    method: "get",
    params: {
      deptId: config.agentId
    },
  });
}


/**
 * @method 获取直播列表
 * @returns
 */
export function getLiveRecordList(params) {
  return request({
    url: `/api/live/getLiveRecordList`,
    method: "get",
    params: {
      deptId: config.agentId,
      ...params
    }
  });
}


/**
 * @method 获取直播目录下的视频地址 抖音
 * @returns
 */
export function getLiveVideoNext(params) {
  return request({
    url: `/api/douyin/getLiveVideoNext`,
    method: "get",
    params
  });
}

/**
 * @method 获取直播目录下的视频地址 快手
 * @returns
 */
export function getLiveVideoNextksLive(params) {
  return request({
    url: `/ws/ksLive/getLiveVideoNext`,
    method: "get",
    params
  });
}

/**
 * @method /api/liveSwitch/remove
 * @returns
 */
export function liveSwitchremove(params) {
  return request({
    url: `/api/liveSwitch/remove`,
    method: "get",
    params
  });
}