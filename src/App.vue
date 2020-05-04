<template>
    <div>
        <Navbar/>
        <b-container>
            <FormSearch @filepaths="outfilepaths" @errorData="outErrorData"/>
            <ListFile :listData="outListData"/>
            <Footer :footerData="outFooterData"/>
        </b-container>
    </div>
</template>

<script>
import Vue from 'vue'

import Navbar from './components/Navbar.vue'
import FormSearch from './components/FormSearch.vue'
import ListFile from './components/ListFile.vue'
import Footer from './components/Footer.vue'

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
    data: function () {
        return {
            outFooterData: null,
            outListData: null
        }
    },
    methods: {
        outErrorData (error) {
            this.outFooterData = error
        },
        outfilepaths (filepaths) {
            this.outListData = filepaths
        }
    }
}
</script>

<style>
</style>
