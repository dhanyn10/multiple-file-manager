<template>
    <b-navbar toggleable="sm" type="dark" variant="info">
        <b-navbar-nav class="ml-auto">
            <b-nav-text>Action : </b-nav-text>
            <b-nav-item>
                <b-form-select size="sm" v-model="selected" v-on:change="onChange($event)" :options="options" id="actions"></b-form-select>
            </b-nav-item>
            <b-nav-item>
                <b-modal v-model="modalForm" title="Options" @ok="handleOk">
                    <div v-if="selected == 1">
                        <b-row>
                            <b-col>
                                <b-form-input class="form-control form-control-sm" v-model="name1" placeholder="from"></b-form-input>
                            </b-col>
                            <b-col>
                                <b-form-input class="form-control form-control-sm" v-model="name2" placeholder="to"></b-form-input>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col>
                                <b-table :items="dataPreview" sticky-header="true"></b-table>
                            </b-col>
                        </b-row>
                    </div>
                    <div v-else-if="selected == 2">
                        <b-row>
                            <b-col>
                                <b-form-input class="form-control form-control-sm" v-model="name1" placeholder="before"></b-form-input>
                            </b-col>
                            <b-col>
                                <b-form-input class="form-control form-control-sm" v-model="name2" placeholder="after"></b-form-input>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col>
                                <b-table :items="dataPreview" sticky-header="true"></b-table>
                            </b-col>
                        </b-row>
                    </div>
                    <div v-else-if="selected == 3">
                        <p class="text-center">Are you sure?<br/>Here the data list that will be moved to recycle bin</p>
                        <b-table :items="dataPreview" sticky-header="true"></b-table>
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
        footerData: String,
        listDataHandler: Array,
        fulldirHandler: String
    },
    data()
    {
        return {
            name1: '',
            name2: '',
            selected: null,
            modalForm: false,
            options: [
                { value: null, text: 'select an option' },
                { value: '1', text: 'Rename : replace' },
                { value: '2', text: 'Rename : insert' },
                { value: '3', text: 'Manage : delete duplicated' },
                { value: '4', text: 'Manage : run command' }
            ],
            dataPreview: []
        }
    },
    methods: {
        onChange (event) {
            this.selected = event
        },
        setEditing () {
            if(this.selected == 3)
            {
                const tempPrev = Manage.prevDuplicated(this.fulldirHandler, this.listDataHandler)
                if(tempPrev.type == 'array')
                {
                    // reset modal input form
                    this.name1 = ''
                    this.name2 = ''
                    // show modal
                    this.modalForm = true
                    // show preview table
                    this.dataPreview = tempPrev.data
                }
                else if(tempPrev.type == 'report')
                    this.$emit('reportResult', tempPrev.data)
            }
            else if(this.selected > 0 && this.selected != 3)
            {
                // reset modal input form
                this.name1 = ''
                this.name2 = ''
                // show modal
                this.modalForm = true
                // show preview table
                this.dataPreview = Rename.prevRename(this.selected, this.name1, this.name2, this.listDataHandler)
            }
        },
        afterFunction (reportResult) {
            const rresult = reportResult
            const fillDir = Utils.generateTime() + Utils.randomString(4) + "_refresh_" + this.fulldirHandler
            this.$emit('reportResult', rresult)
            this.$emit('refreshList', fillDir)
            this.name1 = ''
            this.name2 = ''
        },
        handleOk () {
            if(this.selected == 1)
            {
                const rresult = Rename.replaceFunc(this.fulldirHandler, this.listDataHandler, this.name1, this.name2)
                this.afterFunction(rresult)
            }
            if(this.selected == 2)
            {
                const rresult = Rename.insertFunc(this.fulldirHandler, this.listDataHandler, this.name1, this.name2)
                this.afterFunction(rresult)
            }
            if(this.selected == 3)
            {
                const rresult = Manage.deleteDuplicated(this.fulldirHandler, this.listDataHandler)
                this.afterFunction(rresult)
            }
        }
    },
    watch: {
        name1 () {
            this.dataPreview = Rename.prevRename(this.selected, this.name1, this.name2, this.listDataHandler)
        },
        name2 () {
            this.dataPreview = Rename.prevRename(this.selected, this.name1, this.name2, this.listDataHandler)
        }
    }
}
</script>
