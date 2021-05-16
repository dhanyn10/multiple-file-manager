<template>
    <div>
        <Navbar/>
        <b-container class="mt-4">
            <FormSearch
                @filepaths="filepathsVal"
            />
            <ListFile
                @listDataValue="listdataVal"
                :lfdirHandler="lfdirHandler"
            />
            <Footer
                @reportResult="reportResultHandler"
                @refreshList="refreshListHandler"
                :fulldirHandler="fulldirHandler"
                :listDataHandler="listDataHandler"
            />
            <ReportResult
                :resultHandler="resultHandler"
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
import ReportResult from './components/ReportResult'

import { BContainer } from 'bootstrap-vue'

Vue.component('b-container', BContainer)

export default {
    name: 'App',
    components: {
        Navbar,
        FormSearch,
        ListFile,
        Footer,
        ReportResult
    },
    data () {
        return {
            lfdirHandler: null,     //directory data for ListFile component
            listDataHandler: null,  //list files data for Footer component
            fulldirHandler: null,   //directory data for Footer component
            resultHandler: []       //result data for ReportResult component
        }
    },
    methods: {
        /**
         * filepaths return the data path,
         * then lfdirhandler will save the value and send it to ListFile.vue
         */
        filepathsVal (filepaths) {
            this.lfdirHandler = filepaths,
            this.fulldirHandler = filepaths
        },
        /**
         * listDataValue return the list of data from ListFile
         * the list data will send to Footer.vue through listDataHandler
         */
        listdataVal(listDataValue) {
            this.listDataHandler = listDataValue
        },
        /**
         * rlHandler return the directory data followed by random string in
         * prefix so vuejs wacther will not detect the data as the same directory
         */
        refreshListHandler(rlHandler) {
            this.lfdirHandler = rlHandler
        },
        /**
         * rrHandler return the report data that collected from Rename.js or
         * Manage.js and send the report to ReportResult.vue that previously
         * displayed using console log/error
         */
        reportResultHandler(rrHandler) {
            this.resultHandler = rrHandler
        }
    }
}
</script>
