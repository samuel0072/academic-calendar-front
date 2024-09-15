<template>
    <div class="dropdown">
        <button class="btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <slot>
            
            </slot>
        </button>
        <ul class="dropdown-menu dropdown-menu-end">
            <slot name="options">

            </slot>
        </ul>
    </div>
</template>
<style scoped>
    button {
        border: 0;
    }
</style>