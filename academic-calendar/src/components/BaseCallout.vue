<template>
    <div class="callout">
        <slot></slot>
    </div>
</template>
<style scoped>
    .callout {
        --bs-link-color-rgb: var(--bd-callout-link);
        --bs-code-color: var(--bd-callout-code-color);
        padding: 1.25rem;
        margin-top: 1.25rem;
        margin-bottom: 1.25rem;
        color: var(--bd-callout-color, inherit);
        background-color: var(--bd-callout-bg, var(--bs-gray-100));
        border-left: 0.25rem solid var(--bd-callout-border, var(--bs-gray-300));
    }
    .callout-info {
        --bd-callout-color: var(--bs-info-text-emphasis);
        --bd-callout-bg: var(--bs-info-bg-subtle);
        --bd-callout-border: var(--bs-info-border-subtle);
    }
    .callout-warning {
        --bd-callout-color: var(--bs-warning-text-emphasis);
        --bd-callout-bg: var(--bs-warning-bg-subtle);
        --bd-callout-border: var(--bs-warning-border-subtle);
    }
    .callout-danger {
        --bd-callout-color: var(--bs-danger-text-emphasis);
        --bd-callout-bg: var(--bs-danger-bg-subtle);
        --bd-callout-border: var(--bs-danger-border-subtle);
    }
</style>