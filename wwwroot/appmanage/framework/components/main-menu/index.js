define(function(require) {
  'use strict';
  
  return {
    name: 'MainMenu',

    props: {
      menuDatas: Array
    },

    methods: {
      handleMenuClick: function(pageName) {
        this.$router.push(pageName);

        this.$emit('select', pageName);
      },

      handleMenuDingClickEvent: function () {
        console.log('click');
      }
    },

    template: `
      <el-menu 
        @select="handleMenuClick"
        :collapse="true"
        style="width:180px; height: calc(100vh - 40px)"
        width=""
        background-color="#364051"
        text-color="#fff"
        active-text-color="#fff" router>

        <template v-for="(spuer, index) in menuDatas">

          <el-submenu 
            v-if="spuer.SubMenus"
            class="first-menus"
            :key="spuer.Title"
            :index="spuer.Path || spuer.Name">
            <template slot="title">
              <i :class="spuer.Icon || 'el-icon-menu'"></i>
              {{ spuer.Title }}
            </template>
            
              <template 
                v-for="(second, ndIndex) in spuer.SubMenus">
                
                <el-submenu 
                  class="second-menus"
                  v-if="second.SubMenus"
                  :key="second.Title"
                  :index="second.Name">
                  <template slot="title">
                    {{ second.Title }}
                  </template>
                  <el-menu-item
                    v-for="(third, rdIndex) in second.SubMenus"
                    class="third-menus"
                    :key="third.Pagename"
                    :index="third.Path || ''">
                    {{ third.Title }}
                    <i @click.stop="handleMenuDingClickEvent" class="menu-ding ych-icon-dingzi"></i>
                  </el-menu-item>
                </el-submenu>

                <el-menu-item 
                  v-else 
                  class="second-menus"
                  :key="second.Pagename"
                  :index="second.Path || ''">
                  {{ second.Title }}
                  <i @click.stop="handleMenuDingClickEvent"  class="menu-ding ych-icon-dingzi"></i>
                </el-menu-item>
              </template>
              
          </el-submenu>

          <el-menu-item 
            v-else 
            class="first-menus"
            :key="spuer.Title"
            :index="spuer.Path">
           
            <i :class="spuer.Icon || 'el-icon-menu'"></i>
            {{ spuer.Title }}

          </el-menu-item>

        </template>
        
      </el-menu>
    `
  }
});