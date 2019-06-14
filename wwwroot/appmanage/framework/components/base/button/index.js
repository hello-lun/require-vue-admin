define(function() {
    'use strict';

    var Button = {
        name: 'YchButton',

        functional: true,

        render: function (h, context) {
            var tempProps = _.extend({
                size: 'mini',
            }, context.props);

            return h('el-button', {
                props: tempProps,
                style: {
                    textDecoration: context.props.underline ? 'underline' : 'none'
                },
                on: context.listeners,
                ref: context.data.ref || null
            }, context.children);
        }
    };

    Button.install = function (Vue) {
        Vue.component(Button.name, Button);
    };
    
    return Button;
});