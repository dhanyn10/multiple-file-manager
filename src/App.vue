<template>
    <div>
        <Navbar/>
        <b-container>
            <FormSearch
                @filepaths="filepathsVal"
                @error="errorData"
            />
            <ListFile :listData="listData"/>
            <Footer :footerData="footerData"/>
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
            footerData: null,
            listData: null
        }
    },
    methods: {
        errorData (error)
        {
            this.footerData = error
        },
        filepathsVal (filepaths)
        {
            this.listData = filepaths
        }
    }
}
</script>

<style>
</style>
