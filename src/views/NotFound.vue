<template lang="pug">
  .not-found
    .info-content
      img.p404-img(src="@assets/img/notfound.svg")
      .p404-text
        .code 404
        .msg 抱歉，页面不存在或您没有权限访问
        .link-box
          a.link(href="javascript:;" onClick="javascript :history.back(-1);") 返回上页
          router-link.link(:to="{path: 'login'}") 重新登录
</template>
<style lang="less" scoped>
  .not-found {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background:linear-gradient(135deg,#071628 0%,#243650 100%);
  }
  .info-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .p404-text {
      width: 600px;
      height: 100%;
      user-select: none;
      color:rgba(255, 255, 255, .8);
      margin-left: 30px;
      .code {
        font-size: 70px;
        letter-spacing: 25px;
      }
      .msg {
        font-size: 20px;
        line-height: 30px;
        margin: 20px 0;
      }
      .link-box {
        width: 100%;
        height: 30px;
        display: flex;
        align-items: center;
        .link {
          height: 30px;
          line-height: 30px;
          border: 1px solid #1890ff;
          font-size: 14px;
          color: #ffffff;
          text-align: center;
          cursor: pointer;
          margin-right: 20px;
          user-select: none;
          padding: 0 10px;
        }
      }
    }
  }
</style>
