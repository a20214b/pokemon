<script>
export default {
  async setup() {
    const { data: trainers } = await useTrainers();
    return { trainers };
  },
};
</script>

<template>
  <div>
    <h1>つづきからはじめる</h1>
    <BackButton @click="this.$router.go(-1)">まえにもどる</BackButton>
    <GamifyList>
      <GamifyItem v-for="trainer in trainers" :key="trainer">
        <NuxtLink :to="`/trainer/${trainer}`">{{ trainer }}</NuxtLink>
      </GamifyItem>
    </GamifyList>
  </div>
</template>