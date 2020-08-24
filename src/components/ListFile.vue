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
        <b-list-group id="listfile" class="mb-4">
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
import {
    BListGroup,
    BListGroupItem,
    BButton
    } from 'bootstrap-vue'

Vue.component('b-list-group', BListGroup)
Vue.component('b-list-group-item', BListGroupItem)
Vue.component('b-btn', BButton)

function getInitialData()
{
    return {
        listfile: [],
        isActive: false,
        isDataExist: false,
        countfile: 0
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
            isDataExist: false,
            countfile: 0
        }
    },
    watch: {
        listData: function () {
            //electron filesystem
            const fs = require('fs')
            var dirLocation = this.listData.replace(/\\/g, "/")
            fs.readdir(dirLocation, (err, file) => {
                file.forEach( (filename) => {
                    this.listfile.push({name: filename, selected: false})
                })
                // console.log(this.listfile.length)
                this.countfile = this.listfile.length
                
                if(this.countfile > 0)
                    this.isDataExist = true

            })
            Object.assign(this.$data, getInitialData())
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
    max-height: 300px;
    overflow: auto;
}
</style>