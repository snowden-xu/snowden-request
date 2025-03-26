/**
 * @file 基于 axios 的 HTTP 请求封装
 * @description 提供了一个统一的 HTTP 请求接口，支持响应拦截、错误处理等功能
 * @module request
 */

import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
} from "axios";

/**
 * @interface RequestOptions
 * @description 请求配置选项，继承自 AxiosRequestConfig
 */
interface RequestOptions extends AxiosRequestConfig {
  [key: string]: any;
}

/**
 * @interface RequestOptionsWithResponse
 * @description 返回完整响应对象的请求配置
 */
interface RequestOptionsWithResponse extends RequestOptions {
  getResponse: true;
}

/**
 * @interface RequestOptionsWithoutResponse
 * @description 仅返回响应数据的请求配置
 */
interface RequestOptionsWithoutResponse extends RequestOptions {
  getResponse: false;
}

/**
 * @interface Request
 * @description 统一的请求函数接口定义
 */
interface Request {
  <T extends AxiosResponse<any, any> = any>(
    url: string,
    opts: RequestOptionsWithResponse
  ): Promise<AxiosResponse<T>>;
  <T extends AxiosResponse<any, any> = any>(
    url: string,
    opts: RequestOptionsWithoutResponse
  ): Promise<T>;
  <T extends AxiosResponse<any, any> = any>(
    url: string,
    opts: RequestOptions
  ): Promise<T>;
  <T extends AxiosResponse<any, any> = any>(url: string): Promise<T>;
}

/**
 * @typedef {AxiosError | Error} RequestError
 * @description 请求错误类型
 */
type RequestError = AxiosError | Error;

/**
 * @interface ErrorHandler
 * @description 错误处理器函数接口
 */
interface ErrorHandler {
  (error: RequestError, opts: RequestOptions): void;
}

/**
 * @interface RequestConfig
 * @description 请求配置接口，包含错误处理相关配置
 */
export interface RequestConfig<T = any> extends AxiosRequestConfig {
  errorConfig?: {
    errorHandler?: ErrorHandler;
    errorThrower?: (res: T) => void;
  };
}

let requestInstance: AxiosInstance;
let config: RequestConfig;

/**
 * @function getConfig
 * @description 获取请求配置
 * @returns {RequestConfig} 请求配置对象
 */
const getConfig = (): RequestConfig => {
  if (config) return config;
  // TODO: 从配置文件中获取配置
  config = {};
  return config;
};

/**
 * @function getRequestInstance
 * @description 获取请求实例，包含响应拦截器配置
 * @returns {AxiosInstance} axios 实例
 */
const getRequestInstance = (): AxiosInstance => {
  if (requestInstance) return requestInstance;
  const config = getConfig();
  requestInstance = axios.create(config);

  requestInstance.interceptors.response.use((response) => {
    const { data } = response;
    if (data?.success === false && config?.errorConfig?.errorThrower) {
      config?.errorConfig?.errorThrower(data);
    }
    return response;
  });
  return requestInstance;
};

/**
 * @function request
 * @description 统一的请求函数，支持完整响应和仅数据响应两种模式
 * @param {string} url - 请求地址
 * @param {RequestOptions} [opts={ method: "GET" }] - 请求配置选项
 * @returns {Promise<any>} 请求响应
 */
const request: Request = (url: string, opts: any = { method: "GET" }) => {
  const requestInstance = getRequestInstance();
  const config = getConfig();
  const { getResponse = false } = opts;

  return new Promise((resolve, reject) => {
    requestInstance
      .request({ ...opts, url })
      .then((res) => {
        resolve(getResponse ? res : res.data);
      })
      .catch((error) => {
        try {
          const handler = config?.errorConfig?.errorHandler;
          if (handler) {
            handler(error, opts);
          }
        } catch (e) {
          reject(e);
        }
        reject(error);
      });
  });
};

export { request, getRequestInstance };

export type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  RequestError,
  RequestOptions,
  Request,
};
