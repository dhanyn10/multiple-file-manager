<template>
    <b-navbar toggleable="sm" type="dark" variant="info" class="mb-4">
        <b-navbar-nav class="ml-auto">
            <b-nav-text>Action : </b-nav-text>
            <b-nav-item>
                <b-form-select size="sm" v-model="selected" :options="options" id="actions"></b-form-select>
            </b-nav-item>
        </b-navbar-nav>
    </b-navbar>
</template>

<script>
import Vue from 'vue'
import {
    BNavbar,
    BNavbarNav,
    BNavText,
    BNavItem,
    BFormSelect
    } from 'bootstrap-vue'

Vue.component('b-navbar', BNavbar)
Vue.component('b-navbar-nav', BNavbarNav)
Vue.component('b-nav-text', BNavText)
Vue.component('b-nav-item', BNavItem)
Vue.component('b-form-select', BFormSelect)
export default {
    name: 'Footer',
    data()
    {
        return {
            selected: null,
            options: [
                { value: null, text: 'select an option' },
                { value: '1', text: 'Rename File: delete' },
                { value: '2', text: 'Rename File: replace' },
                { value: '3', text: 'Rename File: insert' },

            ]
        }
    },
}
</script>