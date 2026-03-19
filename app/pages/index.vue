<script setup lang="ts">
import Student from "@/components/home/student/index.vue";
import Teacher from "@/components/home/teacher/index.vue";

const session = useSession()
</script>

<template>
    <Student v-if="session?.type == 'student'" />
    <Teacher v-if="session?.type == 'teacher'" />
</template>