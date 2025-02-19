<script setup lang="ts"></script>

<template>
    <div class="loader"></div>
</template>

<style scoped>
.loader {
    width: 120px;
    height: 60px;
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    background: #fff;
    filter: blur(5px) contrast(10) hue-rotate(60deg);
    mix-blend-mode: darken;
}

.loader:before,
.loader:after {
    content: "";
    width: 40px;
    border-radius: 50%;
    background: #76abae;
    animation: l3 1s infinite alternate;
}

.loader:after {
    --s: -1;
}

@keyframes l3 {

    90%,
    100% {
        transform: translate(calc(var(--s, 1)*30px))
    }
}
</style>