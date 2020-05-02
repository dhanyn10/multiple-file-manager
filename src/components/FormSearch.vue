<template>
    <div>
        <b-form>
            <b-form-row description="browse directory here">
                <b-col cols="8">
                    <b-form-input disabled></b-form-input>
                </b-col>
                <b-col cols="4">
                    <b-button block variant="info">browse</b-button>
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
Vue.component('b-button', BButton)

export default {
    name: 'FormSearch'
}
</script>