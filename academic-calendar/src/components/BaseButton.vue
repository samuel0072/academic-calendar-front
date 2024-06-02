<template>
    <button :type="type" @click="$emit( 'baseButtonClick' )"> {{ label }} </button>
</template>

<script>
    export default {
        name: 'BaseButton',
        props: {
            label: {
                type: String,
                required: true
            },
            type: {
                type: String,
                required: true
            }
        }
    }
</script>