<template>
    <div>
        <Navbar/>
        <b-container class="mt-4">
            <FormSearch
                @filepaths="filepathsVal"
            />
            <ListFile
                @listDataValue="listdataVal"
                :listData="listData"
            />
            <Footer
                @refreshList="refreshListHandler"
                :fulldirHandler="fulldirHandler"
                :listDataHandler="listDataHandler"
            />
        </b-container>
    </div>
</template>

<script>
import Vue from 'vue'

import Navbar from './components/Navbar'
import FormSearch from './components/FormSearch'
import ListFile from './components/ListFile'
import Footer from './components/Footer'

import { BContainer } from 'bootstrap-vue'

Vue.component('b-container', BContainer)

export default {
    name: 'App',
    components: {
        Navbar,
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
        /*
        * listDataValue return the list of data from ListFile
        * the list data will send to Footer.vue through listDataHandler
        */
        listdataVal(listDataValue) {
            this.listDataHandler = listDataValue
        },
        refreshListHandler(rlHandler) {
            this.listData = rlHandler
        }
    }
}
</script>
