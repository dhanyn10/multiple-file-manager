<template>
    <div>
        <b-container class="mt-4">
            <FormSearch
                @filepaths="filepathsVal"
                @error="errordataVal"
            />
            <ListFile
                @listDataValue="listdataVal"
                :listData="listData"
            />
            <Footer
                :fulldirHandler="fulldirHandler"
                :footerData="footerData"
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
            footerData: null,
            listData: null,
            listDataHandler: null,
            fulldirHandler: null
        }
    },
    methods: {
        /*
        * error return the error details that happen from FormSearch
        * error details data will forwarded to Footer.vue through FooterData
        */
        errordataVal (error) {
            this.footerData = error
        },
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
