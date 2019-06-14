(function() {
  var _notification =  {
    template: `
        <el-popover
          v-model="popverVisible"
          placement="top"
          width="265">
          <div class="notification-container">
            <div class="notify-header">
              <span class="header-text">文件下载</span>
              
              <el-popover
                ref="popover"
                placement="bottom"
                width="160">
                <div>
                  <p>确定清除已导出成功的记录？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button type="primary" size="mini" @click="deleteFile">确定</el-button>
                  </div>
                </div>
                <el-button
                  slot="reference"
                  class="clear-btn"
                  :disabled="finishList.length === 0"
                  type="text"
                  size="mini">
                  清除记录
                </el-button>
              </el-popover>

            </div>
            <div
                v-if="finishList.length === 0 && queue.length === 0"
                class="no-report">
              <img src="../img/no-notity.png">
              <span>没有导出报表</span>
            </div>
            <el-scrollbar tag="ul" wrapClass="notify-list">
              <li
                v-for="(item, index) in queue"
                :key="item.HashCode"
                class="notify-item">
                <div class="notify-item-left">
                  <img src="../img/excel.png">
                </div>
                <div class="notify-item-right">
                  <div class="notify-item-info">
                    <!--el-tooltip placement="top" :content="item.Name"-->
                      <span class="item-filename" v-text="item.Name"></span>
                    <!--/el-tooltip-->
                    <span v-if="item.Status === 0" class="item-state">等待中...</span>
                    <span v-else-if="item.Status === 1" class="item-state">准备文件中...</span>
                    <span v-else-if="item.Status === 2" class="item-state">正在导出中...</span>
                    <el-tooltip v-else-if="item.Status === 3" placement="top" :content="item.Message">
                      <span class="item-state">{{ item.Message }}</span>
                    </el-tooltip>
                  </div>
                  <div class="notify-item-operate">
                    <img @click="deleteCache(item, index)" style="width: 20px; cursor: pointer;" src="../img/close.png">
                  </div>
                </div>
              </li>
              <li
                v-for="item in finishList"
                :key="item.FileName"
                class="notify-item">
                <div class="notify-item-left">
                  <img src="../img/excel.png">
                </div>
                <div class="notify-item-right">
                  <div class="notify-item-info">
                    <el-tooltip placement="top" :content="item.FileName">
                      <span class="item-filename" v-text="item.FileName"></span>
                    </el-tooltip>
                    <span class="item-state">
                      <i style="color:#18a658;" class="el-icon-circle-check"></i>
                      文件已准备好
                    </span>
                  </div>
                  <div class="notify-item-operate">
                    <el-button @click="downloadFile(item)" type="text" size="mini">下载</el-button>
                  </div>
                </div>
              </li>
            </el-scrollbar>
          </div>

          <el-badge
            :value="didNotDownloadNum"
            slot="reference"
            class="ych-notification-badge">
            <el-button
              class="ych-notification"
              type="primary">
            </el-button>
          </el-badge>
        </el-popover>`,
    mounted: function() {
      this.refresh();
      window.$ExportRefresh = this.refresh;
    },
    data: function () {
      return {
        popverVisible: false,
        finishList: [],
        queue: [],
        refreshTimer: 0,
        // 已下载过的报表
        haveDownloaded: JSON.parse(localStorage.getItem('downloadReports')) || []
      };
    },
    methods: {
      // 刷新导出报表列表
      refresh: function() {
        var self = this;
        _ajaxCustom('/api/customquery/exportlist', null, function(res) {
          if (res.ResponseStatus.ErrorCode != 0) return;

          self.finishList = res.FileList;
          self.queue = res.Queue;

          // 清空已下载过的报表
          if (res.FileList.length === 0 && self.haveDownloaded.length > 0) {
            self.haveDownloaded = [];
          }

          // 移除定时器
          var clear = function() {
            clearInterval(self.refreshTimer);
            self.refreshTimer = 0;
          };

          if (res.Queue.length > 0) {
            // 判断返回的队列列表是否有错误记录，
            // 若有，并且错误条数等于队列条数，则移除定时器
            var errorNum = 0;
            for (var i = 0; i < res.Queue.length; i++) {
              res.Queue[i].Status === 3 && errorNum++;
            }
            if (res.Queue.length > 0 && res.Queue.length === errorNum) {
              return clear();
            }

            // 如果有报表正在导出，并且没有启动定时器
            if (!self.refreshTimer) {
              self.refreshTimer = setInterval(function() {
                self.refresh();
              }, 2000);
            }
          } else if (res.Queue.length === 0) {
            // 队列为空，移除定时器
            clear();
          }

        });
      },
      downloadFile: function(item) {
        location.href = '/api/customquery/exportdowload?FileName=' + item.FileName;
        // 把当前下载的报表增加的已下载的数组中
        this.haveDownloaded.push(item.FileName);
      },
      // 移除或终止队列中的导出记录
      deleteCache: function(item, index) {
        var self = this;
        _ajaxCustom('/api/customquery/exportlogdelete', {
          Dtype: 0,
          FileOrhasCode: item.HashCode
        }, function(res) {
          if (res.ResponseStatus.ErrorCode != 0) return;
          // 为了用户立刻看到移除效果，手动移除
          self.queue.splice(index, 1);
        });
      },
      // 清空服务器已成功导出的报表
      deleteFile: function() {
        this.$refs.popover.showPopper = false;
        var self = this;
        _ajaxCustom('/api/customquery/exportlogdelete', {
          Dtype: 1
        }, function(res) {
          if (res.ResponseStatus.ErrorCode != 0) return;
          self.finishList = [];
        });
      }
    },
    computed: {
      // 已成功导出未下载过的报表数量
      didNotDownloadNum: function() {
        var num = 0;
        for (var i = 0; i < this.finishList.length; i++) {
          var item = this.finishList[i];
          if (this.haveDownloaded.indexOf(item.FileName) < 0) {
            num++;
          };
        }
        return num;
      }
    },
    watch: {
      // 为了同步本地存储的数据
      haveDownloaded: function(val) {
        window.localStorage.setItem('downloadReports', JSON.stringify(val));
      }
    }
  };

  var _ajaxCustom = function (url, postData, success, error) {
    $.ajax({
      type: 'POST',
      url: url || _customApi,
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(postData),
      dataType: "json",
      success: success,
      error: error
    });
  };

  var NotificationConstructor = Vue.extend(_notification);
  var notification = new NotificationConstructor().$mount('#export-notification');

  window.$ExportPopoverClose = function() {
    notification.popverVisible = false;
  }

})();
