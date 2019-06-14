define(function() {
  'use strict';
  
  var SidebarForm = {
    name: 'side-bar-form',
    functional: true,

    render: function (h, context) {
      return h('el-form', {
        ref: context.data.ref || _.uniqueId('sidebar_form_'),
        on: context.listeners,
        props: {
          model: context.props.model,
          rules: context.props.rules,
          inline: context.props.inline === undefined ? true : context.props.inline,
          size: 'mini',
          labelWidth: context.props.labelWidth === undefined ? '7em' : context.props.labelWidth
        }
      }, [context.children])
    }
  }

  SidebarForm.install = function (Vue) {
    Vue.component(SidebarForm.name, SidebarForm);
  };

  return SidebarForm;
});