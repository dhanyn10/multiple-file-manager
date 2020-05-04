<template>
    <div>
        <Navbar/>
        <b-container>
            <FormSearch @formData="outFormData"/>
            <ListFile/>
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
            outFooterData: ""
        }
    },
    methods: {
        outFormData (variable) {
            this.outFooterData = variable
        }
    }
}
</script>

<style>
</style>
