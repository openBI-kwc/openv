<template lang="pug">
  .group-box.box
    Loading(v-if="loading")
    template(v-else)
      Modal.group-alert-box(:show="showGroup", @close="closeAlert", @confrim="confrim", :text="'新建分类'")
        .content
          .required
            i.icon &#xe692;
            | 分类名称
          input.input-control(type="text", placeholder="请输入分类名称", v-model="groupName")
          .required
            i.icon &#xe692;
            | 备注
          textarea.input.remarks(v-model="remarks", @focus="errRemarks = '' ", placeholder="请输入备注信息")
      BreadCrumbs
      .list-title
        .add-btn(@click="showMask = true; showGroup = true") 添加
      .content-box
        .content-wp
          table.table-box.table-list(v-if="groupList && groupList.length")
            thead.list-header
              tr
                td.groupname 分类名称
                td.page-num 页面数量
                td.remarks 备注
                td.option 操作
            tbody.list-body
              tr(v-for="(group, index) in groupList", :key="index")
                td.group-name
                  .icon.group-icon(v-html="group.groupIcon")
                  .name {{group.name}}
                td.page-num {{group.num}}
                td.remarks {{group.remarks}}
                td.option
                  .operate
                    .operate-item(@click="beforeEdit(group)") 重命名
                    .operate-item(@click="delGroup(group.sid)") 删除
          Nodata(v-else)
      .list-delte
        Paging.page-box(:page-index="currentPage", :total="total", :page-size="pageSize", @change="pageChange")
</template>

<script>
import {
  GET_CLASS,
  ADD_CLASS,
  RENAME_CLASS,
  QUERY_CLASS,
  DELETE_CLASS
} from '@api/authority.js'
import { Lodash } from '@public/utils'
export default {
  data () {
    return {
      loading: true,
      groupName: '',
      remarks: '',
      pageSize: 10,
      currentPage: 1,
      total: 0,
      showMask: false,
      showGroup: false,
      isEdit: false,
      groupList: []
    }
  },
  created () {
    // 获取分类列表
    this.getGroupList()
  },
  activated () {
    // 获取分类列表
    this.$route.meta.isActive && this.getGroupList()
    this.$route.meta.isActive = true
  },
  methods: {
    // 分页
    pageChange (page) {
      this.currentPage = parseFloat(page)
      this.getGroupList()
    },
    // 获取分类列表
    getGroupList () {
      let params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }
      GET_CLASS(params).then(res => {
        if (!res.err) {
          this.loading = false
          let data = res.data
          let list = data.list
          this.total = data.total
          let arr = []
          for (let item of list) {
            let obj = {
              name: item.screenname,
              num: item.number || 0,
              remarks: item.remarks,
              groupIcon: '&#xe616;',
              sid: item.sid
            }
            arr.push(obj)
          }
          this.groupList = arr
        }
      })
    },
    // 增加
    addGroup () {
      let data = {
        screenname: this.groupName,
        remarks: this.remarks
      }
      if (!data.screenname) {
        this.$toasting({
          type: 'warning',
          title: '警告',
          message: '分类名称不能为空'
        })
        return
      }
      if (!data.remarks) {
        this.$toasting({
          type: 'warning',
          title: '警告',
          message: '备注不能为空'
        })
        return
      }
      ADD_CLASS(data).then(res => {
        if (!res.err) {
          this.getGroupList()
          this.closeAlert()
        } else {
          this.$toasting({
            type: 'warning',
            title: '警告',
            message: res.data
          })
        }
      })
    },
    // 修改
    editGroup () {
      let data = {
        sid: this.sid,
        screenname: this.groupName,
        remarks: this.remarks
      }
      if (!data.screenname) {
        this.$toasting({
          type: 'warning',
          title: '警告',
          message: '分类名称不能为空'
        })
        return
      }
      if (!data.remarks) {
        this.$toasting({
          type: 'warning',
          title: '警告',
          message: '备注不能为空'
        })
        return
      }
      RENAME_CLASS(data).then(res => {
        if (!res.err) {
          this.getGroupList()
          this.closeAlert()
        } else {
          this.$toasting({
            type: 'warning',
            title: '警告',
            message: res.data
          })
        }
      })
    },
    // 查询单个
    queryGroup (sid) {
      QUERY_CLASS({sid}).then(res => {
        if (!res.err) {
          let data = res.data
          this.remarks = data.remarks
          this.groupName = data.screenname
          this.showMask = true
          this.showGroup = true
        }
      })
    },
    // 编辑之前
    beforeEdit (group) {
      this.isEdit = true
      this.sid = group.sid
      this.queryGroup(this.sid)
    },
    // 删除用户组(单个)
    delGroup (sid) {
      this.$alert({type: 'warning', msg: '确定要删除吗'}, () => {
        DELETE_CLASS({sid}).then(res => {
          if (!res.err) {
            this.getGroupList()
          }
        })
      })
    },
    // 确认
    confrim () {
      this.isEdit ? this.editGroup() : this.addGroup()
    },
    // 关闭弹框
    closeAlert () {
      this.showMask = false
      this.showGroup = false
      this.isEdit = false
      this.groupName = ''
      this.remarks = ''
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
  .group-alert-box .content {
    height: 360px;
    margin-top: 20px;
    .item-name {
      .flex-center(flex-start);
      height: 30px;
      line-height: 30px;
      font-size: 12px;
      .important {
        text-align: center;
        color: #ff0000;
        width: 5px;
        height: 5px;
        line-height: 5px;
        font-size: 10px;
        transform: scale(0.7);
      }
      .name {
        color: #666666;
        margin-left: 10px;
        display: flex;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        .err-msg {
          margin-left: 10px;
          color: #f00;
        }
      }
      .parentName {
        margin-left: 10px;
        font-size: 13px;
      }
    }
    .input {
      width: 100%;
      height: 30px;
      margin-bottom: 20px;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.8);
      text-indent: 10px;
      border: 1px solid #dddddd;
      &.remarks {
        width: 100%;
        height: 240px;
        line-height: 30px;
        background: #003567;
        border: 1px solid rgba(0, 71, 157, 0.7);
        font-size: 14px;
        resize: none;
      }
    }
  }
  .list-title, .list-delte {
    padding: 0 30px;
    height: 64px;
    .flex-center(space-between);
    .add-btn, .del-btn {
      width:80px;
      height:30px;
      background:rgba(24,145,255,0.5);
      border:1px solid rgba(0, 174, 255, 1);
      line-height: 30px;
      text-align: center;
      user-select: none;
      cursor: pointer;
      font-size:14px;
      color:rgba(255,255,255,0.8);
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
        .group-name {
          display: flex;
          .group-icon {
            color:  #009BF9;
            font-size: 16px;
            margin-right: 10px;
            line-height: 40px;
          }
          .name {
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            line-height: 40px;
          }
        }
      }
    }
  }
</style>
