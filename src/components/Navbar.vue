<template>
    <div>
        <b-navbar toggleable="sm" type="dark" variant="info">
            <b-navbar-nav>
                <b-nav-item v-on:click="visitGithub">Github</b-nav-item>
                <b-nav-item-dropdown text="Help">
                    <b-dropdown-item v-on:click="visitIssues">Report Issue</b-dropdown-item>
                    <b-dropdown-item v-on:click="toggleDevtools">Toggle Developer Tools</b-dropdown-item>
                </b-nav-item-dropdown>
            </b-navbar-nav>
        </b-navbar>
    </div>
</template>

<script>
import Vue from 'vue'
import { BNavbar, BNavbarNav, BNavItem, BNavItemDropdown, BDropdownItem } from 'bootstrap-vue'

let shell = require('electron').shell
let remote = require('electron').remote

Vue.component('b-navbar', BNavbar)
Vue.component('b-navbar-nav', BNavbarNav)
Vue.component('b-nav-item', BNavItem)
Vue.component('b-nav-item-dropdown', BNavItemDropdown)
Vue.component('b-dropdown-item', BDropdownItem)
export default {
    name: 'Navbar',
    methods: {
        visitGithub() {
            shell.openExternal('https://github.com/dhanyn10/multiple-file-manager')
        },
        visitIssues() {
            shell.openExternal('https://github.com/dhanyn10/multiple-file-manager/issues')
        },
        toggleDevtools() {
            remote.getCurrentWindow().toggleDevTools()
        }
    }
}
</script>