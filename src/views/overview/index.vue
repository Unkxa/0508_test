<template>
  <div class="main-container-content">
    <div class="content-wrap-no-border">
      <div class="content-wrap-header">
        <div></div>
      </div>
      <div class="content-wrap-footer">

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'overview',
  data:{
    return:{
        headerData:[
            {
                title:'区块高度',
                color:'#407FFF',
                value:'321,421',
                iconfont:"#xe7d6;",
            },
            {
                title:'累计交易数',
                color:'#FF706B',
                value:'126,560',
                iconfont:"&#xe676;",
            },
            {
                title:'已授权组织数',
                color:'#1FC240',
                value:'5',
                iconfont:"&#xe6dd;",
            },
            {
                title:'已授权用户数',
                color:'#FF9729',
                value:'409',
                iconfont:"&#xe798;",
            }
        ]
    }
  }
}
</script>
<style lang="less" scoped>
.content-wrap-no-border{
    display: flex;
    flex-direction: column;
    gap: 16px;
}
.content-wrap-header,
.content-wrap-footer {
  background-color: #fff;
  padding: 16px;
}
.content-wrap-header {
  height: 300px;
  display: flex;
  justify-content: center;
}
.content-wrap-footer {
  flex: 1;
}
</style>
