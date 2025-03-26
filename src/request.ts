// import axios, {
//     type AxiosInstance,
//     type AxiosRequestConfig,
//     type AxiosResponse,
//     type AxiosError,
//   } from '{{{axiosPath}}}';
//   import useUmiRequest, { UseRequestProvider } from '{{{umiRequestPath}}}';
//   import { ApplyPluginsType } from 'umi';
//   import { getPluginManager } from '../core/plugin';

//   import {
//     BaseOptions,
//     BasePaginatedOptions,
//     BaseResult,
//     CombineService,
//     LoadMoreFormatReturn,
//     LoadMoreOptions,
//     LoadMoreOptionsWithFormat,
//     LoadMoreParams,
//     LoadMoreResult,
//     OptionsWithFormat,
//     PaginatedFormatReturn,
//     PaginatedOptionsWithFormat,
//     PaginatedParams,
//     PaginatedResult,
//   } from '{{{umiRequestPath}}}/es/types';

//   /**
//    * @file 基于 axios 和 useRequest 的请求库封装
//    */

//   /**
//    * 通用的响应数据类型，包含一个泛型参数T用于指定data字段的类型
//    */
//   type ResultWithData< T = any > = { {{resultDataType}} [key: string]: any };

//   /**
//    * useRequest Hook的重载函数声明
//    * 支持多种数据格式和配置选项，包括基础请求、加载更多和分页请求
//    */
//   function useRequest<
//     R = any,
//     P extends any[] = any,
//     U = any,
//     UU extends U = any,
//   >(
//     service: CombineService<R, P>,
//     options: OptionsWithFormat<R, P, U, UU>,
//   ): BaseResult<U, P>;
//   function useRequest<R extends ResultWithData = any, P extends any[] = any>(
//     service: CombineService<R, P>,
//     options?: BaseOptions<R{{{resultDataField}}}, P>,
//   ): BaseResult<R{{{resultDataField}}}, P>;
//   function useRequest<R extends LoadMoreFormatReturn = any, RR = any>(
//     service: CombineService<RR, LoadMoreParams<R>>,
//     options: LoadMoreOptionsWithFormat<R, RR>,
//   ): LoadMoreResult<R>;
//   function useRequest<
//     R extends ResultWithData<LoadMoreFormatReturn | any> = any,
//     RR extends R = any,
//   >(
//     service: CombineService<R, LoadMoreParams<R{{{resultDataField}}}>>,
//     options: LoadMoreOptions<RR{{{resultDataField}}}>,
//   ): LoadMoreResult<R{{{resultDataField}}}>;

//   function useRequest<R = any, Item = any, U extends Item = any>(
//     service: CombineService<R, PaginatedParams>,
//     options: PaginatedOptionsWithFormat<R, Item, U>,
//   ): PaginatedResult<Item>;
//   function useRequest<Item = any, U extends Item = any>(
//     service: CombineService<
//       ResultWithData<PaginatedFormatReturn<Item>>,
//       PaginatedParams
//     >,
//     options: BasePaginatedOptions<U>,
//   ): PaginatedResult<Item>;
//   /**
//    * useRequest Hook的实现
//    * @param service - 请求服务函数
//    * @param options - 配置选项
//    * @returns 根据配置返回相应的请求结果
//    */
//   function useRequest(service: any, options: any = {}) {
//     return useUmiRequest(service, {
//       formatResult: {{{formatResult}}},
//       requestMethod: (requestOptions: any) => {
//         if (typeof requestOptions === 'string') {
//           return request(requestOptions);
//         }
//         if (typeof requestOptions === 'object') {
//           const { url, ...rest } = requestOptions;
//           return request(url, rest);
//         }
//         throw new Error('request options error');
//       },
//       ...options,
//     });
//   }

//   // request 方法 opts 参数的接口
//   /**
//    * 请求配置接口，扩展自AxiosRequestConfig
//    * 添加了错误处理和拦截器相关配置
//    */
//   interface IRequestOptions extends AxiosRequestConfig {
//     skipErrorHandler?: boolean;
//     requestInterceptors?: IRequestInterceptorTuple[];
//     responseInterceptors?: IResponseInterceptorTuple[];
//     [key: string]: any;
//   }

//   /**
//    * 请求配置接口 - 返回完整响应对象
//    */
//   interface IRequestOptionsWithResponse extends IRequestOptions {
//     getResponse: true;
//   }

//   /**
//    * 请求配置接口 - 仅返回响应数据
//    */
//   interface IRequestOptionsWithoutResponse extends IRequestOptions{
//     getResponse: false;
//   }

//   /**
//    * 请求函数接口定义
//    * 支持多种调用方式，可选择是否返回完整响应对象
//    */
//   interface IRequest{
//      <T = any>(url: string, opts: IRequestOptionsWithResponse): Promise<AxiosResponse<T>>;
//      <T = any>(url: string, opts: IRequestOptionsWithoutResponse): Promise<T>;
//      <T = any>(url: string, opts: IRequestOptions): Promise<T>; // getResponse 默认是 false， 因此不提供该参数时，只返回 data
//      <T = any>(url: string): Promise<T>;  // 不提供 opts 时，默认使用 'GET' method，并且默认返回 data
//   }

//   type RequestError = AxiosError | Error

//   interface IErrorHandler {
//     (error: RequestError, opts: IRequestOptions): void;
//   }

//   /**
//    * 支持同步或异步返回的类型
//    */
//   type WithPromise<T> = T | Promise<T>;

//   /**
//    * 拦截器相关类型定义
//    */
//   type IRequestInterceptorAxios = (config: IRequestOptions) => WithPromise<IRequestOptions>;
//   type IRequestInterceptorUmiRequest = (url: string, config : IRequestOptions) => WithPromise<{ url: string, options: IRequestOptions }>;
//   type IRequestInterceptor = IRequestInterceptorAxios | IRequestInterceptorUmiRequest;
//   type IErrorInterceptor = (error: Error) => Promise<Error>;
//   type IResponseInterceptor = <T = any>(response : AxiosResponse<T>) => WithPromise<AxiosResponse<T>> ;
//   type IRequestInterceptorTuple = [IRequestInterceptor , IErrorInterceptor] | [IRequestInterceptor] | IRequestInterceptor
//   type IResponseInterceptorTuple = [IResponseInterceptor, IErrorInterceptor] | [IResponseInterceptor] | IResponseInterceptor

//   /**
//    * 请求配置接口，包含错误处理和拦截器配置
//    */
//   export interface RequestConfig<T = any> extends AxiosRequestConfig {
//     errorConfig?: {
//       errorHandler?: IErrorHandler;
//       errorThrower?: ( res: T ) => void
//     };
//     requestInterceptors?: IRequestInterceptorTuple[];
//     responseInterceptors?: IResponseInterceptorTuple[];
//   }

//   let requestInstance: AxiosInstance;
//   let config: RequestConfig;
//   /**
//    * 获取全局配置
//    * @returns 合并后的请求配置
//    */
//   const getConfig = (): RequestConfig => {
//     if (config) return config;
//     config = getPluginManager().applyPlugins({
//       key: 'request',
//       type: ApplyPluginsType.modify,
//       initialValue: {},
//     });
//     return config;
//   };

//   /**
//    * 获取请求实例
//    * 初始化axios实例并配置拦截器
//    * @returns axios实例
//    */
//   const getRequestInstance = (): AxiosInstance => {
//     if (requestInstance) return requestInstance;
//     const config = getConfig();
//     requestInstance = axios.create(config);

//     // 配置请求拦截器
//     config?.requestInterceptors?.forEach((interceptor) => {
//       if(interceptor instanceof Array){
//         // 处理数组形式的拦截器，支持错误处理
//         requestInstance.interceptors.request.use(async (config) => {
//           const { url } = config;
//           if(interceptor[0].length === 2){
//             // 处理UmiRequest风格的拦截器
//             const { url: newUrl, options } = await interceptor[0](url, config);
//             return { ...options, url: newUrl };
//           }
//           return interceptor[0](config);
//         }, interceptor[1]);
//       } else {
//         // 处理单个拦截器函数
//         requestInstance.interceptors.request.use(async (config) => {
//           const { url } = config;
//           if(interceptor.length === 2){
//             const { url: newUrl, options } = await interceptor(url, config);
//             return { ...options, url: newUrl };
//           }
//           return interceptor(config);
//         })
//       }
//     });

//     // 配置响应拦截器
//     config?.responseInterceptors?.forEach((interceptor) => {
//       interceptor instanceof Array ?
//         requestInstance.interceptors.response.use(interceptor[0], interceptor[1]):
//          requestInstance.interceptors.response.use(interceptor);
//     });

//     // 全局响应拦截器：处理请求失败的情况
//     requestInstance.interceptors.response.use((response) => {
//       const { data } = response;
//       if(data?.success === false && config?.errorConfig?.errorThrower){
//         config.errorConfig.errorThrower(data);
//       }
//       return response;
//     })
//     return requestInstance;
//   };

//   /**
//    * 统一的请求函数
//    * @param url - 请求地址
//    * @param opts - 请求配置，默认为GET请求
//    * @returns Promise 根据getResponse配置返回完整响应对象或仅响应数据
//    */
//   const request: IRequest = (url: string, opts: any = { method: 'GET' }) => {
//     const requestInstance = getRequestInstance();
//     const config = getConfig();
//     const { getResponse = false, requestInterceptors, responseInterceptors } = opts;

//     // 注册请求拦截器并返回拦截器ID，用于后续清理
//     const requestInterceptorsToEject = requestInterceptors?.map((interceptor) => {
//       if(interceptor instanceof Array){
//         return requestInstance.interceptors.request.use(async (config) => {
//           const { url } = config;
//           if(interceptor[0].length === 2){
//             const { url: newUrl, options } = await interceptor[0](url, config);
//             return { ...options, url: newUrl };
//           }
//           return interceptor[0](config);
//         }, interceptor[1]);
//       } else {
//         return requestInstance.interceptors.request.use(async (config) => {
//           const { url } = config;
//           if(interceptor.length === 2){
//             const { url: newUrl, options } = await interceptor(url, config);
//             return { ...options, url: newUrl };
//           }
//           return interceptor(config);
//         })
//       }
//     });

//     // 注册响应拦截器并返回拦截器ID
//     const responseInterceptorsToEject = responseInterceptors?.map((interceptor) => {
//       return interceptor instanceof Array ?
//         requestInstance.interceptors.response.use(interceptor[0], interceptor[1]):
//          requestInstance.interceptors.response.use(interceptor);
//     });

//     return new Promise((resolve, reject)=>{
//       requestInstance
//         .request({...opts, url})
//         .then((res)=>{
//           // 清理请求完成后的拦截器
//           requestInterceptorsToEject?.forEach((interceptor) => {
//             requestInstance.interceptors.request.eject(interceptor);
//           });
//           responseInterceptorsToEject?.forEach((interceptor) => {
//             requestInstance.interceptors.response.eject(interceptor);
//           });
//           resolve(getResponse ? res : res.data);
//         })
//         .catch((error)=>{
//           // 清理请求失败后的拦截器
//           requestInterceptorsToEject?.forEach((interceptor) => {
//             requestInstance.interceptors.request.eject(interceptor);
//           });
//           responseInterceptorsToEject?.forEach((interceptor) => {
//             requestInstance.interceptors.response.eject(interceptor);
//           });
//           try {
//             // 调用错误处理器
//             const handler = config?.errorConfig?.errorHandler;
//             if(handler)
//               handler(error, opts, config);
//           } catch (e) {
//             reject(e);
//           }
//           reject(error);
//         })
//     })
//   }

//   export {
//     useRequest,
//     UseRequestProvider,
//     request,
//     getRequestInstance,
//   };

//   export type {
//     AxiosInstance,
//     AxiosRequestConfig,
//     AxiosResponse,
//     AxiosError,
//     RequestError,
//     IRequestInterceptorAxios as RequestInterceptorAxios,
//     IRequestInterceptorUmiRequest as RequestInterceptorUmiRequest,
//     IRequestInterceptor as RequestInterceptor,
//     IErrorInterceptor as ErrorInterceptor,
//     IResponseInterceptor as ResponseInterceptor,
//     IRequestOptions as RequestOptions,
//     IRequest as Request,
//   };
