<template>
    <div>
        <b-form class="mb-4">
            <b-form-row description="browse directory here">
                <b-col cols="9">
                    <b-form-input disabled></b-form-input>
                </b-col>
                <b-col cols="3">
                    <b-btn squared block variant="info">browse</b-btn>
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

export default {
    name: 'FormSearch'
}
</script>

<style scoped>
    .form-control:disabled{
        background: white;
    }
</style>