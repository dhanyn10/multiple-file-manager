<template>
    <div>
        <div v-show="isDataExist">
            <b-btn
                variant="info rounded-0"
                v-on:click="toggleSelectAll"
                v-show="isActive"
            >Select None
            </b-btn>
            <b-btn
                variant="secondary rounded-0"
                v-on:click="toggleSelectAll"
                v-show="!isActive"
            >Select All
            </b-btn>
        </div>
        <b-list-group id="listfile" class="mb-2">
            <b-list-group-item
                v-for="(item, index) in listfile" :key="index"
                v-on:click="itemHandler(item)"
                v-bind:class="{ active: item.selected }"
            >
                {{item.name}}
            </b-list-group-item>
        </b-list-group>
    </div>
</template>

<script>
import Vue from 'vue'
import { BListGroup, BListGroupItem, BButton } from 'bootstrap-vue'

import { Utils } from '../scripts/Utils.js'

Vue.component('b-list-group', BListGroup)
Vue.component('b-list-group-item', BListGroupItem)
Vue.component('b-btn', BButton)

function getInitialData()
{
    return {
        listfile: [],
        isActive: false,
        isDataExist: false
    }
}

export default {
    name: 'ListFile',
    props: {
        listData: {
            type: String
        }
    },
    data () {
        return {
            listfile: [],
            isActive: false,
            isDataExist: false
        }
    },
    watch: {
        listData: function () {
            //reset data from previous action
            Object.assign(this.$data, getInitialData())

            //electron filesystem
            const fs = require('fs')
            if(this.listData.length > 0)
            {
                let dirLocation = Utils.fulldirFunc(this.listData)
                let rdir = fs.readdirSync(dirLocation)
                var countList = 0
                rdir.forEach((filename) => {
                    this.listfile.push({name: filename, selected: false})
                    countList++
                })
                if(countList > 0)
                    this.isDataExist = true
            }
        },
        listfile: {
            handler: function () {
                this.$emit("listDataValue", this.listfile)
            },
            deep: true
        },
        deep: true
    },
    methods: {
        itemHandler (item) {
            if(item.selected == true)
                item.selected = false
            else
                item.selected = true
        },
        toggleSelectAll () {
            this.isActive = !this.isActive
            if(this.isActive)
            {
                //get listfile length
                const dataLength = this.listfile.length
                for(var j = 0; j < dataLength; j++)
                {
                    this.listfile[j].selected = true
                }
            }
            else
            {
                //get listfile length
                const dataLength = this.listfile.length
                for(var k = 0; k < dataLength; k++)
                {
                    this.listfile[k].selected = false
                }
            }
        }
    }
}
</script>

<style scoped>
#listfile{
    min-height: 300px;
    height: 300px;
    overflow: auto;
    resize: vertical;
}
</style>