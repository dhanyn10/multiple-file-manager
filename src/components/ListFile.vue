<template>
    <div>
        <b-list-group class="mb-4">
            <b-list-group-item>list 1</b-list-group-item>
            <b-list-group-item>list 2</b-list-group-item>
            <b-list-group-item>list 3</b-list-group-item>
        </b-list-group>
    </div>
</template>

<script>
import Vue from 'vue'
import { BListGroup, BListGroupItem } from 'bootstrap-vue'

Vue.component('b-list-group', BListGroup)
Vue.component('b-list-group-item', BListGroupItem)

export default {
    name: 'ListFile'
}
</script>