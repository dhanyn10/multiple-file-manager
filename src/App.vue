<template>
    <div>
        <Navbar/>
        <b-container>
            <FormSearch/>
            <ListFile/>
        </b-container>
    </div>
</template>

<script>
import Vue from 'vue'

import Navbar from './components/Navbar.vue'
import FormSearch from './components/FormSearch.vue'
import ListFile from './components/ListFile.vue'

import { BContainer } from 'bootstrap-vue'

Vue.component('b-container', BContainer)

export default {
    name: 'App',
    components: {
        Navbar,
        FormSearch,
        ListFile
    }
}
</script>

<style>
</style>
