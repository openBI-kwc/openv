<template lang="pug">
  .user-group.box
    Loading(v-if="loading")
    template(v-else)
      //- 用户组的添加和编辑
      Modal.edit-user(:show="showUsersGroup", @close="closeAlert", @confrim="confrim", :text="isEdit ? '编辑用户组' : '添加用户组'")
        .users-group-box
          .required
            i.icon &#xe692;
            | 角色名称
          input.input-control(type="text", name="groupname", v-model="groupname", placeholder="例如：超级管理员")
          .item-name
            .important.icon &#xe692;
            .name 分配权限
          .assign-permissions
            .permission
              .character-item(v-for="(item, index) in characterList", :key="index")
                .lv1-wp
                  CheckBox.select-box(:value="item.check", :size="12", @input="checkItem(item)")
                  .text {{item.pname}}
                .lv2-wp(v-show="item.childs.length > 0")
                  .child(v-for="(child, cindex) in item.childs" :key="cindex")
                    CheckBox.select-box(:value="child.check", :size="12", @input="checkChild(item, child)")
                    .text {{child.pname}}
      BreadCrumbs
      .list-title
        .add-btn(@click="showMask = true; showUsersGroup = true") 添加
        .del-btn.delmore(v-if="this.cdGp.length > 0" @click="delMoreGroup") 批量删除
      .content-box
        .content-wp
          table.table-box.table-list(v-if="groupList && groupList.length")
            thead.list-header
              tr
                td.check-box
                  CheckBox(:value="checkAllUser", :size="12", @input="checkAll")
                td.number 序号
                td.character 角色
                td.option 操作
            tbody.list-body(v-for="(user, index) in groupList", :key="index")
              tr
                td.check-box
                  CheckBox(:value="user.check", :size="12", @input="checkUser(user)")
                td.number {{(currentPage-1)*pageSize+index+1}}
                td.character(@click="user.open = !user.open")
                  .arrow.icon(:class="{ open : user.open, close : !user.open, hide : !user.members.length }") &#xe672;
                  .character-name {{user.character}}
                td.option
                  .operate
                    .operate-item(@click="beforeEdit(user)") 修改
                    .operate-item(@click="delGroup(user)") 删除
              tr.opentrs(v-show="user.open")
                td(colspan="2")
                td
                  .opentr(v-for="(mem, menId) in user.members") {{mem.username}}
                td
          Nodata(v-else)
      Paging.page-box(:page-index="currentPage", :total="total", :page-size="pageSize", @change="pageChange")
</template>
<script>
import { Lodash } from '@public/utils'
import {
  GET_USER,
  GET_PERLIST,
  ADD_USERGROUP,
  QUERY_USERGROUP,
  DELETE_USERGROUP,
  UPDATE_USERGROUP
} from '@api/authority.js'
let allPerData = {}
let userPerData = {}
export default {
  data () {
    return {
      loading: true,
      groupname: '',
      pageSize: 10,
      currentPage: 1,
      total: 0,
      showMask: false,
      showUsersGroup: false,
      checkAllUser: false,
      // 是否为修改
      isEdit: false,
      // 全部权限列表
      characterList: [],
      // 用户组列表
      groupList: []
    }
  },
  created () {
    // 获取用户组列表
    this.getUsersGroup()
    // 获取角色列表
    this.getCharacterList()
  },
  activated () {
    if (this.$route.meta.isActive) {
      // 获取用户组列表
      this.getUsersGroup()
      // 获取角色列表
      this.getCharacterList()
    }
    this.$route.meta.isActive = true
  },
  computed: {
    // 选择的权限项
    cdAct () {
      let list = []
      for (const item of this.characterList) {
        if (item.check) list.push(item.pid)
        for (const citem of item.childs) {
          if (citem.check) list.push(citem.pid)
        }
      }
      return list
    },
    // 选择的组
    cdGp () {
      return this.groupList.filter(item => {
        return item.check
      }).map(item => {
        return item.rid
      })
    }
  },
  methods: {
    // 选择一级
    checkItem (item) {
      item.check = !item.check
      item.childs.forEach(c => {
        c.check = item.check
      })
    },
    // 选择二级
    checkChild(item, child) {
      child.check = !child.check
      item.check = item.childs.some(c => {
        return c.check
      })
    },
    // 查询分页用户组列表
    getUsersGroup () {
      let params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }
      GET_USER(params).then(res => {
        if (!res.err) {
          this.loading = false
          let data = res.data
          let role = data.role
          let user = data.user
          let arr = []
          this.total = data.total
          for (let rol of role) {
            let item = {
              character: rol.rolename,
              rid: rol.rid,
              check: false,
              open: false,
              members: []
            }
            for (let us of user) {
              if (us.rid === rol.rid) {
                item.members.push({
                  username: us.username,
                  uid: us.uid
                })
              }
            }
            arr.push(item)
          }
          this.groupList = arr
        }
      })
    },
    // 获取角色列表
    getCharacterList () {
      GET_PERLIST().then(res => {
        if (res.err) return
        let list = res.data.list
        let newList = list.map(item => {
          let lv0Item = {}
          // 一级
          if (item.lv === 0) {
            lv0Item.check = false
            lv0Item.pname = item.pname
            lv0Item.pid = item.pid
            lv0Item.childs = []
            return lv0Item
          }
        }).filter(item => {
          if (item) {
            return item
          }
        })
        for (const itemOld of list) {
          // 二级
          if (itemOld.lv === 1) {
            for (const itemNew of newList) {
              if (itemOld.parentid === itemNew.pid) {
                itemNew.childs.push({
                  check: false,
                  pname: itemOld.pname,
                  pid: itemOld.pid,
                  parentid: itemOld.parentid
                })
              }
            }
          }
        }
        this.characterList = newList
      })
    },
    // 变成一位数组
    changeOneArr (array) {
      let arr = []
      for (let item1 of array) {
        arr.push(item1.pid)
        if (item1.childs && item1.childs.length) {
          let array2 = item1.childs
          for (let item2 of array2) {
            arr.push(item2.pid)
            if (item2.childs && item2.childs.length) {
              let array3 = item2.childs
              for (let item3 of array3) {
                arr.push(item3.pid)
              }
            }
          }
        }
      }
      return arr
    },
    // 合并权限列表
    mergeCharacter (list) {
      let pidList = list.map(item => {
        return item.pid
      })
      for (const item of this.characterList) {
        item.check = item.childs.some(c => {
          return pidList.includes(c.pid)
        })
        for (const cItem of item.childs) {
          cItem.check = pidList.includes(cItem.pid)
        }
      }
    },
    // 添加用户组
    addGroup () {
      let data = {
        rolename: this.groupname,
        pid: this.cdAct
      }
      if (!this.groupname) {
        this.$toasting({
          type: 'warning',
          title: '警告',
          message: '角色名称不能为空'
        })
        return
      }
      ADD_USERGROUP(data).then(res => {
        if (!res.err) {
          this.getUsersGroup()
          this.closeAlert()
        }
      })
    },
    // 编辑用户组
    editGroup () {
      let data = {
        rid: this.rid,
        rolename: this.groupname,
        pid: this.cdAct
      }
      if (!this.groupname) {
        this.$toasting({
          type: 'warning',
          title: '警告',
          message: '角色名称不能为空'
        })
        return
      }
      if (!this.cdAct.length) return
      UPDATE_USERGROUP(data).then(res => {
        if (!res.err) {
          this.getUsersGroup()
          this.closeAlert()
        }
      })
    },
    // 编辑之前
    beforeEdit (user) {
      this.isEdit = true
      this.rid = user.rid
      this.queryGroup(user)
    },
    // 查询单个用户组信息
    queryGroup (user) {
      QUERY_USERGROUP({rid: user.rid}).then(res => {
        if (!res.err) {
          this.groupname = user.character
          this.mergeCharacter(res.data.list)
          this.showMask = true
          this.showUsersGroup = true
        }
      })
    },
    // 删除用户组(单个)
    delGroup (user) {
      if (user.members.length) {
        this.$toasting({
          type: 'success',
          message: '分组下存在用户无法删除'
        })
        return
      }
      this.$alert({type: 'warning', msg: '确定要删除吗'}, () => {
        DELETE_USERGROUP({rid: user.rid}).then(res => {
          if (!res.err) {
            this.getUsersGroup()
          }
        })
      })
    },
    // 删除用户组(多个)
    delMoreGroup () {
      this.$alert({type: 'warning', msg: '确定要删除吗'}, () => {
        DELETE_USERGROUP({rid: this.cdGp}).then(res => {
          if (!res.err) {
            this.getUsersGroup()
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
      this.showUsersGroup = false
      this.isEdit = false
      this.groupname = ''
      for (const item of this.characterList) {
        item.check = false
        if (item.childs && item.childs.length > 0) {
          for (const child of item.childs) {
            child.check = false
          }
        }
      }
    },
    // 分页
    pageChange (page) {
      this.currentPage = parseFloat(page)
      this.getUsersGroup()
    },
    // 全选
    checkAll () {
      this.checkAllUser = !this.checkAllUser
      this.groupList.forEach(user => {
        user.check = this.checkAllUser
      })
    },
    // 选择用户组
    checkUser (user) {
      user.check = !user.check
      let qx = true
      for (let user of this.groupList) {
        if (!user.check) {
          qx = false
          break
        }
      }
      this.checkAllUser = qx
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
  .users-group-box {
    margin-top: 20px;
    .item-name {
      .flex-center(flex-start);
      height: 30px;
      line-height: 30px;
      font-size: 12px;
      .important {
        color: rgba(255, 59, 59, 0.8);
        font-size: 15px;
        margin-right: 5px;
      }
      .name {
        font-size: 14px;
        color: #ffffff;
        display: flex;
        .err-msg {
          margin-left: 10px;
          color: #f00;
        }
      }
    }
    .input {
      width: 100%;
      height: 30px;
      margin-bottom: 20px;
      font-size: 12px;
      color: #333333;
      text-indent: 10px;
      border: 1px solid #dddddd;
    }
  }
  .assign-permissions {
    .down-up {
      color: #ffffff;
      cursor: pointer;
      transform: rotate(-90deg);
      font-size: 15px;
      &.down {
        transform: rotate(0deg);
        margin-top: 0;
      }
    }
    .permission {
      height: auto;
      width: auto;
      margin-bottom: 25px;
      .select-box {
        margin:  0 10px;
      }
      .text {
        font-size: 14px;
        color: #ffffff;
      }
      .character-item {
        .lv1-wp {
          .flex-center(flex-start);
          height: 30px;
          font-size: 12px;
          color: #333333;
        }
      }
      .lv2-wp .child {
        .flex-center(flex-start);
        height: 30px;
        font-size: 12px;
        color: #333333;
        margin-left: 25px;
      }
    }
  }
  .list-title, .list-delte {
    padding: 0 30px;
    height: 64px;
    .flex-center(flex-start);
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
      margin-right: 10px;
    }
    .search-bar {
      .flex-center(space-between);
      width: 180px;
      height: 26px;
      padding: 0 10px;
      background: #FFFFFF;
      border: 1px solid #E9E9E9;
      border-radius: 2px;
      .search-btn {
        width: 11px;
        height: 11px;
        color: #E9E9E9;
        font-size: 18px;
        line-height: 11px;
      }
      .search-input {
        width: 160px;
        height: 100%;
        line-height: 26px;
        border: none;
        font-size: 16px;
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
    padding-bottom: 50px;
    .content-wp {
      overflow: auto;
      height: 100%;
    }
    .table-box {
      tr {
        td:first-child {
          width: 50px;
          padding-left: 20px;
        }
        .character {
          cursor: pointer;
          width: calc(~"100% - 285px");
          display: flex;
          align-items: center;
          line-height: 42px;
          .arrow {
            cursor: pointer;
            width: 13px;
            height: 13px;
            transition: all 0.3s;
            margin-right: 10px;
            line-height: 13px;
            text-align: center;
            &.close {
              transform: rotate(-90deg);
            }
            &.open {
              transform: rotate(0deg);
            }
            &.hide {
              visibility: hidden;
            }
          }
        }
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
      .opentrs {
        .opentr {
          height: 42px;
          line-height: 42px;
          font-size: 12px;
          padding-left: 20px;
        }
      }
    }
  }
  .modal-content {
    height: 400px;
  }
</style>
