<template>
    <div>
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
import { BListGroup, BListGroupItem } from 'bootstrap-vue'

Vue.component('b-list-group', BListGroup)
Vue.component('b-list-group-item', BListGroupItem)

export default {
    name: 'ListFile',
    props: {
        listData: {
            type: String
        }
    },
    data ()
    {
        return {
            listfile: []
        }
    },
    watch: {
        listData ()
        {            
            //electron filesystem
            let fs = require('fs')
            var dirLocation = this.listData.replace(/\\/g, "/")
            fs.readdir(dirLocation, (err, file)=> {
                file.forEach( (filename) => {
                    this.listfile.push({name: filename, selected: false})
                })
            })
        }
    },
    methods: {
        itemHandler (item)
        {
            if(item.selected == true)
                item.selected = false
            else
                item.selected = true
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