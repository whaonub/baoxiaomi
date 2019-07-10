<template>
    <div class="actionsheet">
        <div class="menus">
            <div class="menu" v-for="(item,index) in menus" :key="index" @click="handleClick(index)">
                <icon :name="item.name" class="dt-icon" :class="item.class"></icon>
                <div>{{item.text}}</div>
            </div>
        </div>
        <div class="exitBtn" @click="changeStatus">
            {{btnText}}
        </div>
    </div>
</template>

<script>
export default {
    props:{
            menus:{type: Array},
            btnText:{type:String}
        },
    data(){
        return{}
    },
    methods:{
        handleClick(index){
            this.$emit("getId",index)
        },
        changeStatus(){
            this.$emit("hideBottom")
        }
    }
}
</script>

<style lang="less">
    .actionsheet{
        position: absolute;
        bottom: 0;
        background: #fff;
        width: 100%;
        z-index: 100;
        text-align: center;
        .menus{
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            padding-top:40px; 
            .menu{
                width: 25%;
                height: 160px;
                font-size: 28px;
                color: #999999;
                .dt-icon{
                    width: 92px;
                    height: 92px;
                    margin-bottom: 10px;
                }
            }
        }
        .exitBtn{
            height: 90px;
            font-size: 28px;
            border-top: 2px solid #e8e8e8;
            color: #666666;
            line-height: 80px;
        }
    }
    
</style>


