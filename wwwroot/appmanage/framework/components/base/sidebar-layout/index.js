define([
    'incss!framework/components/base/sidebar-layout/styles/index.css'
], function() {
    'use strict';
    
    var SidebarLayout = {
        name: 'YchSidebarLayout',

        functional: true,

        render: function (h, context) {
            var slots = context.slots(),
                props = context.props,
                // 设置hander下分割线默认为true
                headerDivider = props.headerDivider === undefined ? false : props.headerDivider;
                
            var defaultSlot = slots.default || null,
                titleSlot = slots.title || null,
                // tipsSlot = slots.tips || null,
                subTitleSlot = slots.subtitle || null,
                extraSlot = slots.extra || null,
                footerSlot = slots.footer || null;

            var titleDom = titleSlot || h('span', {
                    domProps: {
                        textContent: props.title
                    }
                }),
                subTitleDom = subTitleSlot ? null : {
                    textContent: props.subTitle
                };
                

            // 右上角扩展
            var extra = h('span', {
                class: ['ych-sidebar-layout__extra'],
            }, [extraSlot]);
            
            // 正标题
            var title = h('div', {
                class: {
                    'ych-sidebar-layout__title': true,
                    'no-title': !titleSlot && !props.title
                },
            }, [titleDom, extra]);

            // 副标题
            var subtitle = h('div', {
                class: ['ych-sidebar-layout__sub-title'],
                domProps: subTitleDom
            }, [subTitleSlot]);


            var headerChild = [];

            // if (props.title || titleSlot) {
            headerChild.push(title);
            // }

            if (props.subTitle || subTitleSlot) {
                headerChild.push(subtitle);
            }

            // extraSlot && headerChild.push(extra);

            // 头部
            var header = h('div', {
                class: {
                    'ych-sidebar-layout__header': true,
                    'ych-sidebar-layout__header--text': !titleSlot
                },
                slot: 'header'
            }, headerChild);

            // body默认样式
            var tempProps = _.extend({
                shadow: 'never',
                bodyStyle: {
                    'padding': '5px 20px 0 20px'
                }
            }, context.props);

            var tipsContainer = h('div', {
                class: {
                    'ych-sidebar-layout__tips-container': true
                }
            }, footerSlot);

            var cardChilds = [defaultSlot];

            footerSlot && cardChilds.push(tipsContainer);

            headerChild.length > 0 && cardChilds.unshift(header);

            return h('el-card', {
                class: {
                    'ych-sidebar-layout': true,
                    'ych-sidebar-layout--header-divider': headerDivider
                },
                props: tempProps,
                ref: context.data.ref || null
            }, cardChilds);
        }
    }

    SidebarLayout.install = function (Vue) {
        Vue.component(SidebarLayout.name, SidebarLayout);
    };

    return SidebarLayout;
});