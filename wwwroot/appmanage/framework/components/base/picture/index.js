define([
    'incss!components/base/picture/styles/index.css'
], function() {
    'use strict';
    
    var Picture = {
        name: 'YchPicture',

        props: {
            width: {
                type: Number,
                default: 200
            },

            height: {
                type: Number,
                default: 200
            },

            border: {
                type: Boolean,
                default: true
            },

            src: {
                type: String
            }
        },

        data: function () {
            return {
                imgError: false
            };
        },

        methods: {
            error: function () {
                console.log('error');
            }
        },

        template: `
            <div 
                class="ych-picture"
                :style="{
                    width: width + 'px',
                    height: height + 'px'
                }">
                <img :src="src"/>
            </div>
        `
    }

    Picture.install = function (Vue) {
        Vue.component(Picture.name, Picture);
    };

    return Picture;
});