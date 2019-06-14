define([
  'components/area/area-data'
], function(
  areaData
) {
  'use strict';

  return {
    name: 'YchArea',

    inheritAttrs: false,

    created: function () {
      this.initData();
    },

    props: {
      value: Array
    },

    data: function () {
      return {
        optionsData: []
      };
    },

    computed: {
      localValue: {
        get: function () {
          return this.value;
        },

        set: function (val) {
          this.$emit('input', val);
        }
      }
    },

    methods: {
      initData: function () {
        const provinceList = areaData['province_list'];
        const cityList = areaData['city_list'];
        const countyList = areaData['county_list'];

        let opstions = [];

        let provinceMap = {};
        let cityMap = {};

        for (const key in provinceList) {
          if (provinceList.hasOwnProperty(key)) {
            const element = provinceList[key];
            let provinceItem = {
              value: key,
              label: element,
              children: []
            };

            provinceMap[key] = provinceItem;
            opstions.push(provinceItem);
          }
        }

        for (const cityKey in cityList) {
          if (cityList.hasOwnProperty(cityKey)) {
            const element = cityList[cityKey];
            let cityItem = {
              value: cityKey,
              label: element,
              children: []
            };

            let parentObj = provinceMap[`${cityKey.substr(0, 2)}0000`];

            if (parentObj && parentObj.children) {
              parentObj.children.push(cityItem);
            }

            cityMap[cityKey] = cityItem;
          }
        }

        for (const countyKey in countyList) {
          if (countyList.hasOwnProperty(countyKey)) {
            const element = countyList[countyKey];
            let countyItem = {
              value: countyKey,
              label: element
            };

            let parentObj = cityMap[`${countyKey.substr(0, 4)}00`];

            if (parentObj && parentObj.children) {
              parentObj.children.push(countyItem);
            }
          }
        }

        this.optionsData = opstions;
      }

    },

    template: `
      <el-cascader
        v-model="localValue"
        :options="optionsData"
        clearable
        change-on-select>
      </el-cascader>
    `
  };
});