<template>
    <b-navbar toggleable="sm" type="dark" variant="info" class="mb-4">
        <b-navbar-toggle target="navbar-toggle-collapse">
            <template v-slot:default="{ expanded }">
                <b-icon v-if="expanded" icon="list">
                </b-icon>
                <b-icon v-else icon="list">
                </b-icon>
            </template>
        </b-navbar-toggle>
        <b-collapse id="navbar-toggle-collapse" is-nav>
            <b-navbar-nav class="ml-auto">
                <b-nav-item href="#">link 1</b-nav-item>
                <b-nav-item href="#">link 2</b-nav-item>
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
</template>

<script>
import Vue from 'vue'
import {
    BNavbar,
    BNavbarNav,
    BNavItem,
    BIcon
    } from 'bootstrap-vue'
Vue.component('b-navbar', BNavbar)
Vue.component('b-navbar-nav', BNavbarNav)
Vue.component('b-nav-item', BNavItem)
Vue.component('b-icon', BIcon)

export default {
    name: 'Navbar'
}
</script>