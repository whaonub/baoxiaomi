<template>
    <div class="dt-pages fastLogin">
        <div class="dt-header">
            <dtHeader title="邀好友，开宝箱" rightIcon="" :leftIcon="true" :leftBack="true"></dtHeader>
        </div>
        <div class="dt-content">
            <div class="title">
                <span>快捷登录</span>
            </div>
            <div class="loginBox">
                <group>
                    <x-input ref="mobile" name="mobile" v-model="mobile" is-type="china-mobile" required placeholder="请输入手机号"></x-input>
                </group>
                <div class="verification">
                    <group>
                        <x-input type="number" v-model="verification" required placeholder="请输入验证码"></x-input>
                    </group>
                    <button>
                        <span v-if="show" @click="getVerification">获取验证码</span>
                        <span v-else>{{count}}s后重新获取</span>
                    </button>
                </div>
                <div class="tip">新用户输入手机号即可完成注册</div>
                <div class="submit" @click="submit">
                    立即注册
                </div>
                <div class="agree">
                    <CheckIcon :value.sync="agree" type="plain" ></CheckIcon>
                    登录保小秘，表示您同意平台
                    <span>《用户协议》</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import dtHeader from "@/components/dtHeader";
import { XInput } from 'vux'
import { Group } from 'vux'
import { CheckIcon } from 'vux'
export default {
    name:"fastLogin",
    components:{
        dtHeader,
        Group,
        XInput,
        CheckIcon
    },
    data(){
        return{
            mobile:"",
            verification:"",
            show: true,
            count:"",
            timer:null,
            agree:true
        }
    },
    methods:{
        getVerification(){
            const TIME_COUNT = 60;
            if (!this.timer) {
            this.count = TIME_COUNT;
            this.show = false;
            this.timer = setInterval(() => {
            if (this.count > 0 && this.count <= TIME_COUNT) {
                this.count--;
                } else {
                this.show = true;
                clearInterval(this.timer);
                this.timer = null;
                }
            }, 1000)
            }
        },
        submit(){
            if(!this.$refs.mobile.valid && this.agree){
                console.log(this.agree)
            }else{
                // this.showDialog = !this.showDialog
            }
        },
        
    }
}
</script>
<style lang="less">
    .fastLogin{
        .dt-content{
            background: #fff;
            padding: 0 75px;
            .title{
                text-align: center;
                font-size: 30px;
                padding-top: 60px;
                color: #28c76a;
                letter-spacing: 4px;
                font-weight: 900;
                span{
                    padding-bottom: 10px;
                    border-bottom: 4px solid #28c76a;
                }
            }
            .loginBox{
                margin-top: 100px;
                .weui-cells{
                    margin: 0;
                    .weui-cell{
                        border:1px solid #fff;
                    }
                }
                .verification{
                    display: flex;
                    button{
                        width: 400px;
                        background: none;
                        border-bottom:1px solid #F1F1F1; 
                        span{
                            border: 2px solid #d8d8d8;
                            border-radius: 29px;
                            padding: 10px 30px;
                        }
                    }
                }
                .tip{
                    font-size: 24px;
                    color: #999;
                    text-indent: 20px;
                    line-height: 60px;
                }
                .submit{
                    text-align: center;
                    background: #28c76a;
                    height: 80px;
                    font-size: 28px;
                    border-radius: 40px;
                    margin-top: 80px;
                    line-height: 80px;
                    color: #fff;
                }
                .agree{
                    font-size: 24px;
                    margin-top: 40px;
                    line-height: 46px;
                    span{
                        color: #28c76a;
                    }
                }
            }
        }
    }
</style>
