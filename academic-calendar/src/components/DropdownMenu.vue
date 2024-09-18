<template>
    <div class="dropdown">
        <div data-bs-toggle="dropdown" aria-expanded="false">
            <slot>
            
            </slot>
        </div>
        <ul class="dropdown-menu dropdown-menu-end bg-secondary">
            <slot name="options">

            </slot>
        </ul>
    </div>
</template>
<style scoped>
    .dropdown-menu {
        z-index: 2000;
    }
</style>