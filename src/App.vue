<template>
    <div>
        <b-container class="mt-4">
            <FormSearch
                @filepaths="filepathsVal"
            />
            <ListFile
                @listDataValue="listdataVal"
                :listData="listData"
            />
            <Footer
                :fulldirHandler="fulldirHandler"
                :listDataHandler="listDataHandler"
            />
        </b-container>
    </div>
</template>

<script>
import Vue from 'vue'

import FormSearch from './components/FormSearch'
import ListFile from './components/ListFile'
import Footer from './components/Footer'

import { BContainer } from 'bootstrap-vue'

Vue.component('b-container', BContainer)

export default {
    name: 'App',
    components: {
        FormSearch,
        ListFile,
        Footer
    },
    data () {
        return {
            listData: null,
            listDataHandler: null,
            fulldirHandler: null
        }
    },
    methods: {
        /*
        * filepaths return the data path,
        * then listData will save the value and send it to ListFile.vue
        */
        filepathsVal (filepaths) {
            this.listData = filepaths,
            this.fulldirHandler = filepaths
        },
        listdataVal(listDataValue) {
            this.listDataHandler = listDataValue
        }
    }
}
</script>

<style>
</style>
