<template>
    <ul class="dropdown-menu">
        <li v-for="option in options" @click="$emit('click', option.value)" class="dropdown-item"> 
            <span type="button"> {{option.label}} </span>
        </li>
    </ul>
</template>
<script>
    export default {
        props: {
            options: {
                required: true
            }
        }
    }
</script>