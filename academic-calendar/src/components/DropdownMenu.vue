<template>
    <div class="dropdown">
        <div data-bs-toggle="dropdown" aria-expanded="false">
            <slot>
            
            </slot>
        </div>
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