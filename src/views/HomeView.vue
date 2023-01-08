<template>
  <div class="homepage-container">
    <div class="top-container">
      <div class="search-container">
        <p>海量精彩设计 一键生成</p>
        <a-input-search
          placeholder="搜索一下,快速找模版"
          enter-button="搜索"
          size="large"
        />
      </div>
    </div>
    <div class="template-container">
      <p class="template-title">热门海报</p>
      <p class="template-content">只需替换文字和图片，一键自动生成H5</p>
      <div class="template-list">
        <a-row :gutter="16">
          <a-col :span="6" v-for="n in 4" :key="n">
            <a-card hoverable>
              <template #cover>
                <img
                  alt="example"
                  src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                />
              </template>
              <a-card-meta title="Europe Street beat">
                <template #description>www.instagram.com</template>
              </a-card-meta>
            </a-card>
          </a-col>
        </a-row>
      </div>
      <a-button class="more-btn" type="primary" shape="round"
        >加载更多</a-button
      >
    </div>
  </div>
</template>

<style scoped>
.top-container {
  background-image: url("../assets/home-top-bg.jpg");
  background-repeat: no-repeat;
  height: 400px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.search-container {
  width: 400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}
.search-container > p {
  font-size: 24px;
  color: white;
  text-align: center;
}

.template-container {
  text-align: center;
  margin-top: 20px;
  margin-left: 80px;
  margin-right: 80px;
}
.template-title {
  font-size: 24px;
  color: black;
  font-weight: bold;
  margin-bottom: 10px;
}
.template-content {
  color: gray;
}
.more-btn {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
