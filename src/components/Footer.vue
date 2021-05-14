<template>
    <b-navbar toggleable="sm" type="dark" variant="info">
        <b-navbar-nav class="ml-auto">
            <b-nav-text>Action : </b-nav-text>
            <b-nav-item>
                <b-form-select size="sm" v-model="selected" v-on:change="onChange($event)" :options="options" id="actions"></b-form-select>
            </b-nav-item>
            <b-nav-item>
                <b-modal v-model="modaleditingshow" title="Options" @ok="handleOk">
                    <div v-if="selected == 1">
                        <b-form-input class="form-control form-control-sm" v-model="name1" placeholder="delete"></b-form-input>
                    </div>
                    <div v-else-if="selected == 2">
                        <b-row>
                            <b-col>
                                <b-form-input class="form-control form-control-sm" v-model="name1" placeholder="from"></b-form-input>
                            </b-col>
                            <b-col>
                                <b-form-input class="form-control form-control-sm" v-model="name2" placeholder="to"></b-form-input>
                            </b-col>
                        </b-row>
                    </div>
                    <div v-else-if="selected == 3">
                        <b-row>
                            <b-col>
                                <b-form-input class="form-control form-control-sm" v-model="name1" placeholder="before"></b-form-input>
                            </b-col>
                            <b-col>
                                <b-form-input class="form-control form-control-sm" v-model="name2" placeholder="after"></b-form-input>
                            </b-col>
                        </b-row>
                    </div>
                    <div v-else-if="selected == 4">
                        Are You Sure?
                    </div>
                </b-modal>
                <b-btn size="sm" v-on:click="setEditing">Go</b-btn>
            </b-nav-item>
        </b-navbar-nav>
    </b-navbar>
</template>

<script>
import Vue from 'vue'
import { NavbarPlugin, BForm, BFormSelect, BButton, VBModal, BRow, BCol } from 'bootstrap-vue'

import { Rename } from "../scripts/Rename.js"
import { Manage } from "../scripts/Manage.js"
import { Utils } from '../scripts/Utils.js'

Vue.use(NavbarPlugin)

Vue.component('b-form', BForm)
Vue.component('b-form-select', BFormSelect)
Vue.component('b-btn', BButton)
Vue.component('b-row', BRow)
Vue.component('b-col', BCol)

Vue.directive('b-modal', VBModal)

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
            name1: '',
            name2: '',
            selected: null,
            modaleditingshow: false,
            options: [
                { value: null, text: 'select an option' },
                { value: '1', text: 'Rename File: delete' },
                { value: '2', text: 'Rename File: replace' },
                { value: '3', text: 'Rename File: insert' },
                { value: '4', text: 'Manage File: delete duplicated' }
            ]
        }
    },
    methods: {
        onChange: function(event) {
            this.selected = event
        },
        setEditing () {
            if(this.selected > 0) this.modaleditingshow = true
        },
        handleOk () {
            const fillDir = Utils.generateTime() + Utils.randomString(4) + "_refresh_" + this.fulldirHandler
            if(this.selected == 1)
            {
                Rename.deleteFunc({
                    fulldir: this.fulldirHandler,
                    listfile: this.listDataHandler,
                    deleteChar: this.name1
                })
                this.$emit('refreshList', fillDir)
            }
            else if(this.selected == 2)
            {
                Rename.replaceFunc({
                    fulldir: this.fulldirHandler,
                    listfile: this.listDataHandler,
                    repfrom: this.name1,
                    repto: this.name2
                })
                this.$emit('refreshList', fillDir)
            }
            else if(this.selected == 3)
            {
                Rename.insertFunc({
                    fulldir: this.fulldirHandler,
                    listfile: this.listDataHandler,
                    before: this.name1,
                    after: this.name2
                })
                this.$emit('refreshList', fillDir)
            }
            else if(this.selected == 4)
            {
                Manage.deleteDuplicated({
                    listfile: this.listDataHandler,
                    fulldir: this.fulldirHandler
                })
                this.$emit('refreshList', fillDir)
            }
        }
    }
}
</script>
