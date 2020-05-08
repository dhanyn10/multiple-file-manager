<template>
    <div>
        <b-form class="mb-4">
            <b-form-row description="browse directory here">
                <b-col cols="9">
                    <b-form-input v-model="dirLocation" disabled></b-form-input>
                </b-col>
                <b-col cols="3">
                    <b-btn squared block variant="info" @click="browse">browse</b-btn>
                </b-col>
            </b-form-row>
        </b-form>
    </div>
</template>

<script>
import Vue from 'vue'
import { BForm, BFormGroup, BFormInput, BButton } from 'bootstrap-vue'

Vue.component('b-form', BForm)
Vue.component('b-form-group', BFormGroup)
Vue.component('b-form-input', BFormInput)
Vue.component('b-btn', BButton)

//electron
const electron = require('electron')
let remote = electron.remote
let dialog = remote.dialog

export default {
    name: 'FormSearch',
    data () {
        return {
            dirLocation: null
        }
    },
    methods: {
        browse () {
            dialog.showOpenDialog({
                properties: ['openDirectory']
            }).then(result => {
                if(result.canceled == false) //make sure user doesnt cancel opendirectory
                {
                    let filePaths = result.filePaths[0]
                    this.dirLocation = filePaths
                    this.$emit("filepaths", filePaths)
                }
            }).catch( error => {
                this.$emit("error", error)
                console.log(error)
            })
        }
    }
}
</script>

<style scoped>
    .form-control:disabled{
        background: white;
    }
</style>