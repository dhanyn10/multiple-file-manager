<template>
    <div>
        <div v-for="(item, i) in reportList" :key="i" class="mt-2">
            <b-alert variant="info">
                <div v-html="item.message">{{ item.message }}</div>
            </b-alert>
        </div>
    </div>
</template>
<script>
import Vue from 'vue'
import { BAlert, BFormGroup } from 'bootstrap-vue'

Vue.component('b-alert', BAlert)
Vue.component('b-form-group', BFormGroup)

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
                //reset the reportlist data to prevent duplicate alert
                if(this.reportList.length > 0)
                    this.reportList = []
                for(var i = 0; i < this.resultHandler.length; i++)
                {
                    this.reportList.push({message: this.resultHandler[i]})
                }
            }
        }
    }
}
</script>
