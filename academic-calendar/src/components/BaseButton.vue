<template>
    <button :type="type"> {{ label }} </button>
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