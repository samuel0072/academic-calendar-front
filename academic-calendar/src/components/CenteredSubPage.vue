<template>
    <div class="d-flex align-items-center justify-content-center ">
        <div class="subpage  d-flex align-items-center justify-content-center text-center">
            <slot></slot>
        </div>
    </div>
</template>
<style scoped>
.subpage {
    height: calc(100vh - 4rem);
}
</style>