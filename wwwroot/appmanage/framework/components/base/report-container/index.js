define([
], function() {
    'use strict';

    var ReportContainer = {
        name: 'YchReportContainer',

        functional: true,

        render: function (h, context) {
            var slots = context.slots();
            return h('el-container', {
                style: {
                    // backgroundColor: '#fff'
                    // display: 'flex',
                    // flex
                }
            }, [
                h('el-header', {
                    style: {
                        padding: 0,
                        height: 'auto'
                    }
                }, [
                    slots.header
                ]),
                h('el-main', {
                    style: {
                        padding: 0
                    }
                }, [
                    slots.main
                ]),

                h('el-footer', {
                    style: {
                        height: 'auto'
                    }
                }, [
                    h('el-row', {
                        style: {
                            padding: '5px 5px 0'
                        },
                        props: {
                            type: 'flex',
                            justify: 'space-between'
                        }
                    }, [
                        h('div', {}, [
                            slots.footerLeft
                        ]),
                        slots.footerRight
                    ]),
                    
                ])
            ])
        }
    }

    ReportContainer.install = function (Vue) {
        Vue.component(ReportContainer.name, ReportContainer);
    };

    return ReportContainer;
});