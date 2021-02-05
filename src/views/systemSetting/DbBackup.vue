<template lang="pug">
  .backup-box
    Loading(v-if="loading")
    template(v-else)
      BreadCrumbs
      .main-container
        .add-new-backup(@click="newBackup")      
          .text 添加备份
        .content-box
          .content-wp
            table.table-box.table-list(v-if="backupList && backupList.length > 0", cellspacing="0")
              thead.list-header
                tr
                  td.name 名称
                  td.time 备份时间
                  td.operation 操作
              tbody.list-body
                tr(v-for="item in backupList")
                  td {{item.dataname}}
                  td {{new Date(item.backtime * 1000).toLocaleString()}}
                  td.operation
                    .operate
                      .operate-item(@click="deleteBackup(item.bid)") 删除
                      a.operate-item(:href="setting.server + backupdownLink + item.dataname") 下载
            Nodata(v-else)
          Paging.page-box(:page-index="currentPage", :total="total", :page-size="pageSize", @change="pageChange")
</template>
<script>
import { mapState } from 'vuex'
import {
  ADD_BACKUP,
  DELETE_BACKUP,
  GET_BACKUPLIST
} from '@api/system.js'
export default {
  computed: {
    ...mapState({
      setting: state => state.setting
    })
  },
  data () {
    return {
      loading: true,
      newBackupType: '',
      publishPicked: 'publish',
      isCheckAll: true,
      backupList: [],
      backupdownLink: '/index/backdown/backupdown?dataname=',
      currentPage: 1,
      pageSize: 10,
      total: 0
    }
  },
  created () {
    this.getBackupList()
  },
  activated () {
    this.$route.meta.isActive && this.getBackupList()
    this.$route.meta.isActive = true
  },
  methods: {
    pageChange (page) {
      this.currentPage = page
      this.getBackupList()
    },
    newBackup () {
      ADD_BACKUP().then((value) => {
        if (!value.err) {
          this.$toasting({
            type: 'success',
            message: '已向后台发出备份请求'
          })
          this.getBackupList()
        }
      })
    },
    deleteBackup (bid) {
      this.$alert({type: 'warning', msg: '确定要删除吗!'}, () => {
        DELETE_BACKUP({bid}).then((value) => {
          if (!value.err) {
            this.getBackupList()
          }
        })
      })
    },
    getBackupList () {
      let params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }
      GET_BACKUPLIST(params).then((value) => {
        if (!value.err) {
          this.loading = false
          this.backupList = value.data.list
          this.total = value.data.total
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .backup-box {
    height: 100%;
    position: relative;
  }
  .add-new-backup {
    width: 80px;
    height: 30px;
    margin: 20px 0;
    background:rgba(24,145,255,0.5);
    border: 1px solid rgba(0, 174, 255, 1);
    line-height: 30px;
    text-align: center;
    user-select: none;
    cursor: pointer;
    font-size: 14px;
    color:rgba(255,255,255,0.8);
  }
  .table-box {
    tr {
      .operate {
        min-width: 100px;
        display: flex;
        justify-content: flex-end;
        .operate-item {
          color: #258AD7;
          cursor: pointer;
          margin-left: 15px;
          line-height: 40px;
          font-size: 12px;
        }
      }
    }
  }
  .page-box {
    position: absolute;
    bottom: 20px;
    right: 30px;
  }
</style>
