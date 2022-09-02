<script>
import { VITE_SERVER_ORIGIN } from "~/utils/env";

export default {
  async setup() {
    const route = useRoute();
    const router = useRouter();
    const page = ref(0);
    const limit = ref(20);
    const offset = computed(() => page.value * limit.value);
    const { data: pokemons, refresh } = await useAsyncData(
      "/pokeapi/pokemon",
      () =>
        $fetch(`${VITE_SERVER_ORIGIN}/api/pokeapi/pokemon`, {
          params: { offset: offset.value, limit: limit.value },
        })
    );
    const hasPrev = computed(() => page.value > 0);
    const maxPage = computed(() =>
      Math.floor(pokemons.value.count / limit.value)
    );
    const hasNext = computed(() => page.value < maxPage.value);
    const onPrev = async () => {
      page.value--;
      await refresh();
    };
    const onNext = async () => {
      page.value++;
      await refresh();
    };
    const onMaxPage = async () => {
      maxPage.value;
      await refresh();
    };
    const onCatch = async (pokemon) => {
      const response = await fetch(
        `${VITE_SERVER_ORIGIN}/api/trainer/${route.params.name}/pokemon/${pokemon.name}`,
        {
          method: "PUT",
        }
      );
      if (!response.ok) return;
      router.push(`/trainer/${route.params.name}`);
    };
    const { dialog, onOpen, onClose } = useDialog();
    return {
      page,
      maxPage,
      pokemons,
      hasPrev,
      hasNext,
      onPrev,
      onNext,
      onMaxPage,
      onCatch,
      dialog,
      onOpen,
      onClose,
    };
  },
};
</script>

<template>
  <div>
    <BackButton @click="this.$router.go(-1)">まえにもどる</BackButton>
    <h1>ポケモンをつかまえる</h1>
    <p>{{ pokemons.count }} しゅるいのポケモン</p>

    <GamifyList direction="horizon">
      <GamifyItem>
        <GamifyButton :disabled="!hasPrev" @click="onPrev">まえへ</GamifyButton>
      </GamifyItem>
      <GamifyItem>
        <GamifyButton :disabled="!hasNext" @click="onNext">つぎへ</GamifyButton>
      </GamifyItem>
      <p v-if="page + 1 === maxPage + 1" text-align:center>
        {{ page + 1 }} / {{ maxPage + 1 }} もうぽけもんはいないよ！
      </p>
      <p v-else text-align: center>{{ page + 1 }} / {{ maxPage + 1 }} ページ</p>
    </GamifyList>
    <GamifyList>
      <GamifyItem v-for="pokemon in pokemons.results" :key="pokemon.id">
        <img :src="pokemon.sprites.front_default" />
        <span class="pokemon-name">{{ pokemon.name }}</span>
        <GamifyButton @click="onOpen(pokemon)">つかまえる</GamifyButton>
      </GamifyItem>
    </GamifyList>
    <GamifyDialog
      v-if="dialog"
      id="confirm-catch"
      title="かくにん"
      :description="`ほう！　${dialog.name}　にするんじゃな？`"
      @close="onClose"
    >
      <GamifyList :border="false" direction="horizon">
        <GamifyItem>
          <GamifyButton @click="onClose">いいえ</GamifyButton>
        </GamifyItem>
        <GamifyItem>
          <GamifyButton @click="onCatch(dialog)">はい</GamifyButton>
        </GamifyItem>
      </GamifyList>
    </GamifyDialog>
  </div>
</template>
