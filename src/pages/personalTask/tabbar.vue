<template>
    <div class="tabbar">
        <div class="tab-item" 
            :class="showActive == index? 'active':''"
            v-for="(item,index) in tabData" 
            @click="changeKey(index)"
            :key="index">
            <div>{{item.text}}</div>
            <i></i>
        </div>
    </div>
</template>
<script>
export default {
    name:"tabbar",
    props:{
        tabData:{type:Array},
        showActive:{type:Number},
        changeKey:{type:Function}
    },
    data(){
        return{}
    },
    methods:{

    }
}
</script>
<style lang="less">
.tabbar{
    display: flex;
    position: relative;
    text-align: center;
    background: #ffffff;
    border-bottom: 2px solid #e8e8e8;
    .tab-item{
        width: 50%;
        height: 100px;
        display: flex;
        flex-direction: column;
        align-items: center;
        color: #999;
        div{
            padding-top:26px; 
            font-size: 30px;
        }
    }
    .tab-item.active{
        color: #333;
        i{
            width: 120px;
            margin-top: 10px;
            display: block;
            height: 6px;
            background: #28c76a;
        }
    }
}
</style>
