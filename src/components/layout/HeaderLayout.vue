<template>
  <a-layout-header class="header">
    <div class="page-title">
      <router-link :to="{ name: 'home' }">
        <img alt="logo" src="../../assets/logo.svg" class="logo-img" />
      </router-link>
      <p class="logo-title">Monk</p>
    </div>
    <div class="header-right">
      <router-link :to="{ name: 'editor' }">
        <p class="editor-text">创建设计</p>
      </router-link>
      <a-button type="primary">登录</a-button>
    </div>
  </a-layout-header>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header .logo-img {
  height: 35px;
}
.page-title {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.logo-title {
  height: 35px;
  font-size: 24px;
  color: white;
  font-weight: bold;
  margin-left: 10px;
}
.header-right {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.editor-text {
  margin: 0 auto;
  margin-right: 50px;
}
</style>
