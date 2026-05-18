<script setup lang="ts">
import Student from "@/components/home/student.vue";
import Teacher from "@/components/home/teacher.vue";
import Service from "@/components/home/service.vue";

const session = useSession()
</script>

<template>
    <Student v-if="session?.type == 'student'" />
    <Teacher v-if="session?.type == 'teacher'" />
    <Service v-if="session?.type == 'service'" />
</template>