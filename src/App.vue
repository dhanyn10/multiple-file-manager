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
    data ()
    {
        return {
            outFooterData: null,
            outListData: null
        }
    },
    methods: {
        outErrorData (error)
        {
            this.outFooterData = error
        },
        outfilepaths (filepaths)
        {
            this.outListData = filepaths
        }
    }
}
</script>

<style>
</style>
