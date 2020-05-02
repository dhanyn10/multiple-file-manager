<template>
    <b-navbar toggleable="sm" type="dark" variant="info" class="mb-4">
        <b-navbar-nav class="ml-auto">
            <b-nav-item href="#">link 1</b-nav-item>
            <b-nav-item href="#">link 2</b-nav-item>
        </b-navbar-nav>
    </b-navbar>
</template>

<script>
import Vue from 'vue'
import { BNavbar, BNavbarNav, BNavItem } from 'bootstrap-vue'

Vue.component('b-navbar', BNavbar)
Vue.component('b-navbar-nav', BNavbarNav)
Vue.component('b-nav-item', BNavItem)

export default {
    name: 'Navbar'
}
</script>