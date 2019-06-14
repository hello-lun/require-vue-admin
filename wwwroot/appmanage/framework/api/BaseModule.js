define([
    'axios',
    'framework/core/usermanager',
    '_',
    'ELEMENT'
  ], function (
    axios, 
    UserManager,
    _,
    ELEMENT
  ) {
    'use strict';

    var $alert = ELEMENT.MessageBox.alert;

    function BaseModule (baseUrl, isMock) {
      this.lib = axios;
      this.baseUrl = handleBaseUrl(baseUrl, isMock);
      this.client = axios.create({
        baseURL: this.baseUrl,
        headers: {
          // 'Content-Type': 'application/x-www-form-urlencoded'
          'Content-Type': 'application/json'
        }
      });
      
      // 处理HTTP拦截
      _.bind(beforeRequest, this)();
      _.bind(afterResponse, this)();
    }

    BaseModule.prototype.baseRequest = function (methods, params) {
      var url = params.url || '',
          data = params.data || null,
          config = params.config;
      
      if (!config.cancelToken) {
        var CancelToken = axios.CancelToken;
        var cancelFn;
        config.cancelToken = new CancelToken(function executor(c) {
          cancelFn = c;
        });
        config.cancelFn = cancelFn;
      }
      var methodsFn = this.client[methods];

      var promise = data ? methodsFn(url, data, config) : methodsFn(url, config);
      return promise;
    }
  
    BaseModule.prototype.post = function (url, data, config) {
      var url = url || '',
          data = data || {},
          config = _.extend({}, (config || {}));
  
      return this.baseRequest('post', {
        url: url, 
        data: data, 
        config: config
      });
    };
  
    BaseModule.prototype.get = function (url, data, config) {
      var url = url || '',
          data = data || {},
          config = _.extend({}, (config || {}), {params: data});
      
      return this.baseRequest('get', {
        url: url, 
        config: config
      });
    };
  
    BaseModule.prototype.delete = function (url, data, config) {
      var url = url || '',
          config = _.extend({}, (config || {}), {params: data});
  
      return this.baseRequest('delete', {
        url: url, 
        config: config
      });
    };
  
    BaseModule.prototype.put = function (url, data, config) {
      var url = url || '',
          data = data || {},
          config = _.extend({}, (config || {}));
  
      return this.baseRequest('put', {
        url: url, 
        data: data, 
        config: config
      });
    };
  
    BaseModule.prototype.patch = function (url, data, config) {
      var url = url || '',
          data = data || {},
          config = _.extend({}, (config || {}));
  
      return this.baseRequest('patch', {
        url: url, 
        data: data, 
        config: config
      });
    };

    // 处理baseURl
    var handleBaseUrl = function (baseUrl, isMock) {
      var globalConfig = window.globalConfig,
          mockInfo = globalConfig.mock,
          appConfig = globalConfig.app;

      // 在以下两种情况下不做任何处理
      // 1、 已http开头
      // 2、 baseUrl 与 isMock 都没传
      if (
        (baseUrl && baseUrl.indexOf('http') == 0) 
        || (baseUrl === undefined && isMock === undefined)
      ) {
        return baseUrl;
      }
      // mock接口地址
      var mockAndApi = mockInfo.url + baseUrl;

      // 使用接口模块私有
      if (mockInfo.status === 'private') {
        if (isMock === true) {
          return mockAndApi;
        } else if (isMock === false) {
          return getModuleOfHost(baseUrl);
        } else {

        }
        return mockAndApi
      } else if (mockInfo.status === true)  {
        // 全局使用mock
        return mockAndApi
      } else {
        return getModuleOfHost(baseUrl);
      }
    };

    // 获取请求模块的host地址
    var getModuleOfHost = function (url) {
      url = url || '';

      // var appConfig = window.globalConfig.app;

      // var pathParam = url.split('/'),
      //     // 如果是 / 开头下表为0的元素为空
      //     pathPrefix = pathParam[0] || pathParam[1],
      //     moduleInfo = appConfig[pathPrefix];

      // if (!moduleInfo) {
      //   throw new Error(`应用'${pathPrefix}'没有找到应用配置信息，请到'/framework/config/config.js'确认`);
      // }
      
      return (location.origin || '') + url;
      // return (moduleInfo.host || '') + url;
    }
  
    //请求拦截
    var beforeRequest = function () {
      this.client.interceptors.request.use(function (config) {
        // 判断当前请求接口是否为“登录接口”
        if (config.isLogin) {
          return config;
        }

        return UserManager.getUser()
                .then(_.bind(function (user) {
                  // return handleRequestCofnig(user, config);
                  if (user || globalConfig.mock.status || config.isLogin) {
                    return handleRequestCofnig(user, config);
                  } else {
                    if (config.cancelFn) {
                      config.cancelFn();
                    }
                    return config;
                  }
                }, this));
      }, function (error) {
        return Promise.reject(error);
      });
    }
    
    // 处理请求配置参数
    var handleRequestCofnig = function (user, config) {
      var user = user || {};
      config.headers.Authorization = user.Token;
      return config;
    }
  
    //响应拦截
    var afterResponse = function () {
      // code状态码200判断
      this.client.interceptors.response.use(function (res) {
        return afterResponseSuccess(res);
      }, function (error) {
        var errorMsg = '';
        // 请求已发出，但服务器响应的状态码不在 2xx 范围内
        if (error.response) {
          if (error.response.status === 401) {
            return $alert('登录超时，请重新登录！', '错误', {
              type: 'error'
            }).then(() => {
              UserManager.logout();
            });
          }
          errorMsg = handleHttpError(error);
        } else {
          // debugger;
          // axios 请求超时
          if (error) {
            if (typeof error === 'object') {
              if (error.message) {
                errorMsg = (error.message.indexOf('timeout') !== -1) ? '请求超时！' : '客户端错误！';
              }
            } else {
              errorMsg = error || 'error';
            }
          }
        }

        // storage不存在用户信息
        if (errorMsg === 'user not found in storage') {
          return $alert('登录信息失效，请重新登录！', '错误', {
            type: 'error',
            callback: function() {
              UserManager.logout();
            }
          });
        } else {
          
          errorMsg && $alert(errorMsg, '错误', {
            type: 'error'
          }).then(function() {
          });
        }
      
        return Promise.reject(errorMsg);
      });
    }
  
    // 处理http异常状态
    var handleHttpError = function (error) {
      var errorMsg,
          response = error.response,
          status = response.status;
  
      if (status >= 500) {
        errorMsg = (response.data['ResponseStatus'] && response.data.ResponseStatus.Message) || '服务器异常';
      } else if (status >= 300) {
        // http 请求超时
        if (status === 408) {
          errorMsg = '请求超时！';
        } else if (status === 401) {
          errorMsg = '授权失败！';
        } else {
          errorMsg = '请求错误！';
        }
      }
  
      return errorMsg;
    }
  
    // 处理http响应
    var afterResponseSuccess = function (res) {
      var data = res.data;
     
      if (data.ResponseStatus.ErrorCode != 0) {
        // 如果有错误码忽略，则返回完整响应
        if (handleBackendError(res)) {
          return Promise.reject(data);
        }
      } else {
        return Promise.resolve(data.Data);
      }
    }
  
    // 处理后端异常
    var handleBackendError = function (res) {
      var data = res.data,
          errCode = data.ResponseStatus.ErrorCode,
          errMsg = data.ResponseStatus.Message;
      // 忽略当前请求的部分异常错误码
      var ignoreErrCode = res.config.ignoreErrCode || [];
      if (ignoreErrCode.indexOf(errCode) < 0) {
        var tipErrorMsg = errMsg + '(' + errCode + ')';
        $alert( tipErrorMsg, '错误', { type: 'error'});

        return true;
      }

      return false;
    }
  
    return BaseModule;
  });