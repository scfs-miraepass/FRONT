<script setup lang="ts">
import Group from "./days.vue";
import Obj from "./object.vue";
</script>

<template>
    <div class="w-full px-6 py-7 light:bg-default dark:bg-muted rounded-2xl flex-1 flex flex-col gap-y-6">
        <Group date="3월 18일">
            <Obj :user_id="1" :changed_amount="100000000" reason="홍길동"/>
            <Obj :user_id="1" :changed_amount="-100" reason="홍길동"/>
        </Group>
    </div>
</template>