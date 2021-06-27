<template>
    <div>
        <div v-for="item in reportList" :key="item" class="mt-2">
            <b-alert variant="info" show dismissible>
                <div v-html="item">{{ item }}</div>
            </b-alert>
        </div>
    </div>
</template>
<script>
import Vue from 'vue'
import { BAlert, BFormGroup } from 'bootstrap-vue'

Vue.component('b-alert', BAlert)
Vue.component('b-form-group', BFormGroup)

//this will save result log as array
var tempResData = []
export default {
    name: 'ReportResult',
    props: {
        resultHandler: {
            type: Array
        }
    },
    data () {
        return {
            reportList: []
        }
    },
    watch: {
        resultHandler: function () {
            if(this.resultHandler.length > 0)
            {
                for(var i = 0; i < this.resultHandler.length; i++)
                {
                    tempResData.push(this.resultHandler[i])
                }
                //array distinct to prevent redundant data
                this.reportList = [...new Set(tempResData)]
            }
        }
    }
}
</script>
