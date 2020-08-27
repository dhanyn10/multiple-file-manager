<template>
    <div>
        <b-container class="mt-4">
            <FormSearch
                @filepaths="filepathsVal"
                @error="errordataVal"
            />
            <ListFile :listData="listData"/>
            <Footer :footerData="footerData"/>
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
            listData: null
        }
    },
    methods: {
        errordataVal (error) {
            this.footerData = error
        },
        filepathsVal (filepaths) {
            this.listData = filepaths
        }
    }
}
</script>

<style>
</style>
