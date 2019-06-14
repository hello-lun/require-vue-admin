define([
    'incss!components/base/form/styles/index.css'
], function() {
    'use strict';

    var Form = {
        name: 'YchForm',

        functional: true,

        render: function (h, context) {
            var tempProps = _.extend({}, context.props);
            // 改变默认值
            tempProps.inline = tempProps.inline === undefined ? true : tempProps.inline;
            tempProps.size = tempProps.size || 'mini';
            // tempProps.labelWidth = tempProps.inline ? null : (tempProps.labelWidth || '80px');
            tempProps.labelWidth = tempProps.labelWidth || '85px';

            return h('el-form', {
                props: tempProps,
                on: context.listeners,
                ref: context.data.ref || null
            }, [context.children]);
        }
    }

    Form.install = function (Vue) {
        Vue.component(Form.name, Form);
    };

    return Form;
});