<template>
    <div>
        <b-form class="mb-4">
            <b-form-row>
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
import { FormPlugin, BButton } from 'bootstrap-vue'

Vue.use(FormPlugin)

Vue.component('b-btn', BButton)

//electron dialog
const { dialog } = require('electron').remote

export default {
    name: 'FormSearch',
    data () {
        return {
            dirLocation: null
        }
    },
    methods: {
        browse () {
            //reset directory and file list when user click browse button
            this.dirLocation = null
            this.$emit("filepaths", '')
            dialog.showOpenDialog({
                properties: ['openDirectory']
            }).then(result => {
                //when user doesnt cancel opendirectory
                if(result.canceled == false)
                {
                    let filePaths = result.filePaths[0]
                    this.dirLocation = filePaths
                    this.$emit("filepaths", filePaths)
                }
            }).catch( error => {
                console.error(`error : ${error}`)
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
