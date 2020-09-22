<template>
    <b-navbar toggleable="sm" type="dark" variant="info" class="mb-4">
        <b-navbar-nav>            
            <b-nav-text>Status : {{statusData}}
            </b-nav-text>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
            <b-nav-text>Action : </b-nav-text>
            <b-nav-item>
                <b-form-select
                size="sm"
                v-model="selected"
                v-on:change="onChange($event)"
                :options="options"
                id="actions"></b-form-select>
            </b-nav-item>
            <b-nav-item>
                <b-btn size="sm" v-on:click="run">Go</b-btn>
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
    BFormSelect,
    BButton
    } from 'bootstrap-vue'

import { Rename } from "../scripts/Rename.js"

Vue.component('b-navbar', BNavbar)
Vue.component('b-navbar-nav', BNavbarNav)
Vue.component('b-nav-text', BNavText)
Vue.component('b-nav-item', BNavItem)
Vue.component('b-form-select', BFormSelect)
Vue.component('b-btn', BButton)

export default {
    name: 'Footer',
    props: {
        footerData: {
            type: String
        },
        listDataHandler: {
            type: Array
        },
        fulldirHandler: {
            type: String
        }
    },
    data()
    {
        return {
            statusData: null,
            selected: null,
            options: [
                { value: null, text: 'select an option' },
                { value: '1', text: 'Rename File: delete' },
                { value: '2', text: 'Rename File: replace' },
                { value: '3', text: 'Rename File: insert' },
            ]
        }
    },
    watch: {
        footerData: function () {
            this.statusData = this.footerData
        }
    },
    methods: {
        onChange: function(event) {
            this.selected = event
        },
        run: function () {
            Rename.deleteFunc({
                fulldir: this.fulldirHandler,
                listfile: this.listDataHandler,
                deleteChar: ""
            })
        }
    }
}
</script>