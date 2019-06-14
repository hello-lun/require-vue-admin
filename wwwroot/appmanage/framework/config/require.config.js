!(function (require, globalConfig) {
  'use strict';

  // APP站点的服务 与 静态文件目录 配置
  var APP_CONFIG = globalConfig.app;
  var CORE_PATH = globalConfig.baseUrl;
  
  var FRAMEWORK_PATH = 'framework/';

  var requireConfigPaths = {
    // 目录
    'css': FRAMEWORK_PATH + 'css/',
    'lib': FRAMEWORK_PATH + 'lib/',
    'util': FRAMEWORK_PATH + 'util/',
    'class': FRAMEWORK_PATH + 'class/',
    'components': FRAMEWORK_PATH + 'components/',
    'mixins': FRAMEWORK_PATH + 'mixins/',
    'directive': FRAMEWORK_PATH + 'directive/',
    'filter': FRAMEWORK_PATH + 'filter/',
    'api': FRAMEWORK_PATH + 'api/',

    // 框架基础
    'global': 'core/global',
    'http': 'core/http',
    'user-manager': 'core/usermanager',

    // 第三方库
    'vue': FRAMEWORK_PATH + 'lib/vue/vue',
    'vue-router': FRAMEWORK_PATH + 'lib/vue-router.min',
    'axios': FRAMEWORK_PATH + 'lib/axios',
    '_': FRAMEWORK_PATH + 'lib/lodash.min',
    'es6-promise': FRAMEWORK_PATH + 'lib/es6-promise.auto.min',
    'oidc': FRAMEWORK_PATH + 'lib/oidc-client',
    'quill-editor': FRAMEWORK_PATH + 'lib/quill-editor/vue-quill-editor',
    'quill': FRAMEWORK_PATH + 'lib/quill-editor/quill.min',
    'moment': FRAMEWORK_PATH + 'lib/moment.min',
    'numeral': FRAMEWORK_PATH + 'lib/numeral.min',
    'fabric': FRAMEWORK_PATH + 'lib/fabric.min',

    // 第三方UI库
    'ELEMENT': FRAMEWORK_PATH + 'lib/element-ui/js/index',

    // 组件 和 控件
    'custom-report': FRAMEWORK_PATH + 'lib/custom-report/js/ych-custom-report',
    'side-bar': FRAMEWORK_PATH + 'components/side-bar/index',
  }

  // 处理前端版本问题
  // 具体方法后期完善
  for (var key in APP_CONFIG) {
    var moduleInfo = APP_CONFIG[key],
        pathname = moduleInfo.pathname;
    requireConfigPaths[pathname] = ((key === 'framework') ? 'framework' : 'modules/' + pathname + '/v1');
  }

  // for (var i = 0; i < APP_CONFIG.length; i++) {
  //   var item = APP_CONFIG[i];
  //   requireConfigPaths[item] = (item === 'framework') ? '/framework' : 'modules/' + item + '/v1';
  // }

  require.config({
    baseUrl: globalConfig.baseUrl,
    // baseUrl: requireConfigPaths.framework,
    map: {
      '*': {
          'incss': globalConfig.baseUrl + '/' + FRAMEWORK_PATH + '/lib/require/css.min.js',
          'json': globalConfig.baseUrl + '/' + FRAMEWORK_PATH + '/lib/require/json.js'
      }
    },
  
    paths: requireConfigPaths,
  
    shim: {
      'quill-editor': [
        // 'framework/lib/quill-editor/quill.min',
        'incss!framework/lib/quill-editor/quill.core.css',
        'incss!framework/lib/quill-editor/quill.snow.css'
      ],
  
      _: {
        exports: '_'
      },
  
      'custom-report': [
        'lib/custom-report/js/ych-report-global.conf',
        'incss!/framework/lib/custom-report/css/index.css'
      ],
    }
  });

})(require, window.globalConfig);
