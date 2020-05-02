<template>
    <div>
        <b-navbar toggleable="sm" type="dark" variant="info">
            <b-navbar-nav class="ml-auto">
                <b-nav-item href="#">link 1</b-nav-item>
                <b-nav-item href="#">link 2</b-nav-item>
            </b-navbar-nav>
        </b-navbar>
    </div>
</template>

<script>
import Vue from 'vue'
import { BNavbar, BNavbarNav, BNavbarItem } from 'bootstrap-vue'

Vue.component('b-navbar', BNavbar)
Vue.component('b-navbar-nav', BNavbarNav)
Vue.component('b-navbar-item', BNavbarItem)

export default {
    name: 'Navbar'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
