define([
  'framework/css/icon/iconfont'
], function() {
  'use strict';
  
  var SvgIcon = {
    name: 'YchSvgIcon',

    props: {
      icon: String
    },

    template: `
      <svg  class="ych-color-icon" aria-hidden="true">
          <use :xlink:href="'#' + icon"></use>
      </svg>
    `
  }

  SvgIcon.install = function (Vue) {
    Vue.component(SvgIcon.name, SvgIcon);
  };

  return SvgIcon;
});