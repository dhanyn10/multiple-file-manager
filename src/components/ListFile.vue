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
            <b-list-group-item class="no-highlight"
                v-for="(item, index) in listfile" :key="index"
                v-on:click="itemHandler(item)"
                @click.shift="selectMultiple"
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
        isDataExist: false,
        arrayIdx: []
    }
}

export default {
    name: 'ListFile',
    props: {
        lfdirHandler: {
            type: String
        }
    },
    data () {
        return {
            listfile: [],
            isActive: false,
            isDataExist: false,
            arrayIdx: []
        }
    },
    watch: {
        lfdirHandler: function () {
            //reset data from previous action
            Object.assign(this.$data, getInitialData())

            //electron filesystem
            const fs = require('fs')
            if(this.lfdirHandler.length > 0)
            {
                let dirLocation = Utils.fulldirFunc(this.lfdirHandler)
                let rdir = fs.readdirSync(dirLocation)
                var countList = 0
                rdir.forEach((filename) => {
                    this.listfile.push({
                            id: countList,
                            name: filename,
                            selected: false
                        })
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
            {
                item.selected = true
                this.arrayIdx.push(item.id)
                if(this.arrayIdx.length > 2)
                    this.arrayIdx = this.arrayIdx.slice(1,3)
            }
        },
        selectMultiple () {
            if(this.arrayIdx.length == 2)
            {
                const low = Math.min.apply(null, this.arrayIdx)
                const high = Math.max.apply(null, this.arrayIdx)
                for(var i = low; i <= high; i++)
                    this.listfile[i].selected = true
            }
        },
        toggleSelectAll () {
            this.isActive = !this.isActive
            if(this.isActive)
            {
                //get listfile length
                const dataLength = this.listfile.length
                for(var j = 0; j < dataLength; j++)
                    this.listfile[j].selected = true
            }
            else
            {
                //get listfile length
                const dataLength = this.listfile.length
                for(var k = 0; k < dataLength; k++)
                    this.listfile[k].selected = false
            }
        }
    }
}
</script>

<style scoped>
.no-highlight{
    user-select: none;
}
#listfile{
    min-height: 300px;
    height: 300px;
    overflow: auto;
    resize: vertical;
}
</style>
