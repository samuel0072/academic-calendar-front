<template>
    <header class="navbar navbar-expand-lg bd-navbar sticky-top bg-secondary-subtle" ref="header">
      <nav class="container-xxl bd-gutter flex-wrap flex-lg-nowrap">
        <slot></slot>

      </nav>
    </header>
</template>
<script>
    export default {
        data: function() {
            return {
                opacity: 1,
                lastScrollPos: 0
            }
        },
        methods: {
            changeHeaderOpacity() {
                if ((document.documentElement.scrollTop - this.lastScrollPos ) > 0) {
                    this.decraseOpacity()
                } 
                else if((document.documentElement.scrollTop - this.lastScrollPos) < 0) {
                    this.incraseOpacity() 
                }
                this.$refs.header.style.opacity = this.opacity;
                this.lastScrollPos = document.documentElement.scrollTop;
            },
            incraseOpacity() {
                this.opacity = Math.min(1, this.opacity + 0.1)
            },
            decraseOpacity() {
                this.opacity = Math.max(0, this.opacity - 0.1)
            }
        },
        created: function() {
            window.addEventListener('scroll', this.changeHeaderOpacity)
        },
        destroyed: function(){
            window.removeEventListener('scroll', this.changeHeaderOpacity)
        }
    }
</script>