<template>
    <div>
        <div v-for="(item, i) in reportList" :key="i">
            {{ item.message }}
        </div>
    </div>
</template>
<script>
export default {
    name: 'ReportResult',
    props: {
        resultHandler: {
            type: Array
        }
    },
    data () {
        return {
            reportList: []
        }
    },
    watch: {
        resultHandler: function () {
            if(this.resultHandler.length > 0)
            {
                for(var i = 0; i < this.resultHandler.length; i++)
                {
                    this.reportList.push({message: this.resultHandler[i]})
                }
            }
        }
    }
}
</script>