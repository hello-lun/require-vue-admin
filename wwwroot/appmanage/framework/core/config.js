!(function (require) {
  'use strict';

  var frameworkPath = '/framework/';
  // APP站点的服务 与 静态文件目录 配置
  var APP_CONFIG = [
    'framework',
    'customer',
    'organization',
    'workbentch'
  ]

  Object.defineProperties(window, {
    'HOST_CONFIG': {
      value: {
        framework: '',
        id: location.origin
      }
    }
  });

  var requireConfigPaths = {
    // 目录
    'css': frameworkPath + 'css/',
    'lib': frameworkPath + 'lib/',
    'util': frameworkPath + 'util/',
    'class': frameworkPath + 'class/',
    'components': frameworkPath + 'components/',
    'mixins': frameworkPath + 'mixins/',
    'directive': frameworkPath + 'directive/',
    'js': 'js/',

    // 框架基础
    'global': 'core/global',
    'http': 'core/http',
    'user-manager': 'core/usermanager',

    // 第三方库
    'vue': frameworkPath + 'lib/vue/vue',
    'axios': frameworkPath + 'lib/axios.min',
    '_': frameworkPath + 'lib/lodash.min',
    'es6-promise': frameworkPath + 'lib/es6-promise.auto.min',
    'oidc': frameworkPath + 'lib/oidc-client',
    'quill-editor': frameworkPath + 'lib/quill-editor/vue-quill-editor',
    'quill': frameworkPath + 'lib/quill-editor/quill.min',

    // 第三方UI库
    'ELEMENT': frameworkPath + 'lib/element-ui/js/index',

    // 组件 和 控件
    'custom-report': frameworkPath + 'lib/custom-report/js/ych-custom-report',
    'side-bar': frameworkPath + 'components/side-bar/index',
  }

  for (var i = 0; i < APP_CONFIG.length; i++) {
    var item = APP_CONFIG[i];
    requireConfigPaths[item] = (item === 'framework') ? '/framework' : 'modules/' + item + '/v1';
  }

  require.config({
    // baseUrl: requireConfigPaths.framework,
    map: {
      '*': {
          'incss': frameworkPath + '/lib/require/css.min.js',
          'json': frameworkPath + '/lib/require/json.js'
      }
    },
  
    paths: requireConfigPaths,
  
    shim: {
      ELEMENT: [
        'vue',
        'incss!framework/lib/element-ui/css/index.css'
      ],

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

})(require)
