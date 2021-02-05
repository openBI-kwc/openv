<template lang="pug">
  .userlog-box.box
    Loading(v-if="loading")
    template(v-else)
      BreadCrumbs
      .main-container
        .list-title
          .tap-box
            .user-login(:class="{active : logType === 0}", @click="changeLog(0)") 用户登录日志
            .user-opera(:class="{active : logType === 1}", @click="changeLog(1)") 用户操作日志
        //- 登录日志
        template(v-if="logType === 0")
          .content-wp
            table.table-box.table-list(v-if="loginLogList && loginLogList.length")
              thead.list-header
                tr
                  td.number 序号
                  td.username 用户名
                  td.character 角色
                  td.time 最近登录时间
                  td.status 状态
                  td.option-record 操作记录
              tbody.list-body
                tr(v-for="(loginLog, index) in loginLogList", :key="index")
                  td.number {{(currentPage-1)*pageSize+index+1}}
                  td.username {{loginLog.username}}
                  td.character {{loginLog.character}}
                  td.time {{loginLog.time | dateFormat}}
                  td.status
                    .icon(:class="{'success': loginLog.status, 'fail': !loginLog.status}" v-html="loginLog.status ? '&#xe8df;' : '&#xe614;'")
                  td.option-record {{loginLog.record}}
            Nodata(v-else)
        template(v-if="logType === 1")
          //- 操作日志
          .content-wp
            table.table-box.table-list(v-if="opLogList && opLogList.length")
              thead.list-header
                tr
                  td.number 序号
                  td.username 用户名
                  td.name 姓名
                  td.character 角色
                  td.time 最近登录时间
                  td.IP 操作IP
                  td.option-record 操作记录
              tbody.list-body
                tr(v-for="(opLog, index) in opLogList", :key="index")
                  td.number {{(currentPage-1)*pageSize+index+1}}
                  td.username {{opLog.username}}
                  td.name {{opLog.name}}
                  td.character {{opLog.character}}
                  td.time {{opLog.time | dateFormat}}
                  td.IP {{opLog.ip}}
                  td.option-record {{opLog.record}}
            Nodata(v-else)
      Paging.page-box(:page-index="currentPage", :total="total", :page-size="pageSize", @change="pageChange")
</template>
<script>
import Utils from '@public/utils'
import {
  LOGUSER_LIST,
  LOGLIST
} from '@api/authority.js'
export default {
  data () {
    return {
      loading: true,
      pageSize: 10,
      currentPage: 1,
      total: 0,
      logType: 0,
      loginLogList: [],
      opLogList: []
    }
  },
  created () {
    this.userLoginLogs()
  },
  activated () {
    this.$route.meta.isActive && this.userLoginLogs()
    this.$route.meta.isActive = true
  },
  methods: {
    // 切换
    changeLog (type) {
      this.logType = type
      this.total = 0
      this.currentPage = 1
      if (this.logType === 0) {
        this.userLoginLogs()
      } else {
        this.userOptLogs()
      }
    },
    pageChange (page) {
      this.currentPage = page
      if (this.logType === 0) {
        this.userLoginLogs()
      } else {
        this.userOptLogs()
      }
    },
    // 用户登录日志
    userLoginLogs () {
      let params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }
      LOGUSER_LIST(params).then(res => {
        if (!res.err) {
          this.loading = false
          this.total = res.data.total
          this.loginLogList = res.data.list || []
        }
      })
    },
    userOptLogs () {
      let params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }
      LOGLIST(params).then(res => {
        if (!res.err) {
          this.total = res.data.total
          this.opLogList = res.data.list || []
        }
      })
    }
  },
  filters: {
    dateFormat (value) {
      if (!value) return ''
      return Utils.timeFormat(value, 'Y年m月d日 H:i')
    }
  }
}
</script>
<style lang="less" scoped>
  // 垂直两端对齐
  .flex-center (@fa) {
    display: flex;
    justify-content: @fa;
    align-items: center;
  }
  .page-box {
    position: absolute;
    bottom: 20px;
    right: 30px;
  }
  .table-box {
    tr {
      td.status {
        width: 50px;
        .icon {
          line-height: 46px;
          &.success {
            color: #219AF2;
          }
          &.fail {
            color: #219AF2;
          }
        }
      }
    }
  }
  .list-title, .list-delte {
    height: 64px;
    .flex-center(space-between);
    .tap-box {
      width: 202px;
      height: 32px;
      .flex-center(space-between);
      background: rgba(0,0,0,0);
    }
    .user-login, .user-opera {
      width: 100px;
      height: 32px;
      background: rgba(0,0,0,0);
      text-align: center;
      line-height: 32px;
      font-size: 14px;
      color: rgba(255, 255, 255, .4);
      border-bottom: 1px solid rgba(255, 255, 255, .4);
      cursor: pointer;
      user-select: none;
      &.active {
        border-bottom: 1px solid #219af2;
        color: #219af2;
      }
    }
  }
  .content-box {
    padding: 0 30px;
    padding-bottom: 50px;
    position: relative;
    display: flex;
    flex-direction: column;
    flex: 1;
    position: relative;
    overflow: hidden;
    .content-wp {
      overflow: auto;
      height: 100%;
    }
  }
  .list-box {
    width: calc(~"100% - 2px");
    margin: 0 auto;
    overflow: auto;
    max-height: calc(~"100% - 158px");
    box-shadow: 0 0 1px 0 rgba(67, 87, 101, 0.3);
    background: #FDFDFD;
    .item {
      padding: 0 20px;
      height: 42px;
      .flex-center(space-between);
      border-bottom: 1px solid #e9e9e9;
      font-size: 12px;
      color: #666666;
      &.title {
        font-size: 12px;
        color: #999999;
      }
      &:nth-child(11) {
        border-bottom: none;
      }
      .number {
        width: 50px;
      }
      .username {
        width: 10%;
      }
      .name {
        width: 5%;
      }
      .character {
        width: 10%;
      }
      .time {
        width: 15%;
      }
      .status {
        width: 50px;
        text-align: center;
        &.success {
          color: #219AF2;
          font-size: 16px;
        }
        &.fail {
          color: #f14d06;
          font-size: 16px;
        }
      }
      .IP {
        width: 10%;
      }
      .option-record {
        width: calc(~"50% - 100px");
      }
    }
  }
</style>
