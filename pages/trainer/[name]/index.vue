<script>
import GamifyButton from "~/components/GamifyButton.vue";
import { VITE_SERVER_ORIGIN } from "~/utils/env";
import trimAvoidCharacters from "~/utils/trimAvoidCharacters";

export default {
  async setup() {
    const route = useRoute();
    const router = useRouter();
    const { data: trainer, refresh } = await useAsyncData(
      `/trainer/${route.params.name}`,
      () => $fetch(`${VITE_SERVER_ORIGIN}/api/trainer/${route.params.name}`)
    );
    const onDelete = async () => {
      const response = await fetch(
        `${VITE_SERVER_ORIGIN}/api/trainer/${route.params.name}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) return;
      router.push("/");
    };
    const nickname = ref("");
    const onNickname = async (pokemon) => {
      const newTrainer = trainer.value;
      const index = newTrainer.pokemons.findIndex(
        ({ id }) => id === pokemon.id
      );
      newTrainer.pokemons[index].nickname = trimAvoidCharacters(nickname.value);
      nickname.value = "";
      const response = await fetch(
        `${VITE_SERVER_ORIGIN}/api/trainer/${route.params.name}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTrainer),
        }
      );
      if (!response.ok) return;
      await refresh();
      onCloseNickname();
    };
    const onRelease = async (pokemonName) => {
      const response = await fetch(
        `${VITE_SERVER_ORIGIN}/api/trainer/${route.params.name}/pokemon/${pokemonName}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) return;
      await refresh();
      onCloseRelease();
    };
    const {
      dialog: deleteDialog,
      onOpen: onOpenDelete,
      onClose: onCloseDelete,
    } = useDialog();
    const {
      dialog: nicknameDialog,
      onOpen: onOpenNickname,
      onClose: onCloseNickname,
    } = useDialog();
    const {
      dialog: releaseDialog,
      onOpen: onOpenRelease,
      onClose: onCloseRelease,
    } = useDialog();
    return {
      trainer,
      nickname,
      onDelete,
      onNickname,
      onRelease,
      deleteDialog,
      onOpenDelete,
      onCloseDelete,
      nicknameDialog,
      onOpenNickname,
      onCloseNickname,
      releaseDialog,
      onOpenRelease,
      onCloseRelease,
    };
  },
  components: { GamifyButton },
};
</script>

<template>
  <div>
    <BackButton @click="this.$router.go(-1)">??????????????????</BackButton>
    <h1>?????????????????????</h1>
    <div class="trainer-info">
      <img src="/avatar.png" />
      <span>{{ trainer.name }}</span>
    </div>
    <GamifyButton @click="onOpenDelete(true)"
      >??????????????????????????????</GamifyButton
    >

    <h2>?????????????????????</h2>
    <CatchButton :to="`/trainer/${trainer.name}/catch`"
      >??????????????????????????????</CatchButton
    >

    <GamifyList>
      <GamifyItem v-for="pokemon in trainer.pokemons" :key="pokemon.id">
        <img :src="pokemon.sprites.front_default" />
        <!-- {{ pokemon.id }} -->
        <span class="pokemon-name">{{ pokemon.nickname || pokemon.name }}</span>
        <GamifyButton @click="onOpenNickname(pokemon)"
          >??????????????????????????????</GamifyButton
        >
        <GamifyButton @click="onOpenRelease(pokemon)"
          >?????????????????????</GamifyButton
        >
      </GamifyItem>
    </GamifyList>
    <GamifyDialog
      v-if="deleteDialog"
      id="confirm-delete"
      title="????????????"
      description="??????????????????????????????????????????????????????????????????????????????????????????????????????????????????"
      @close="onCloseDelete"
    >
      <GamifyList :border="false" direction="horizon">
        <GamifyItem>
          <GamifyButton @click="onCloseDelete">?????????</GamifyButton>
        </GamifyItem>
        <GamifyItem>
          <GamifyButton @click="onDelete">??????</GamifyButton>
        </GamifyItem>
      </GamifyList>
    </GamifyDialog>
    <GamifyDialog
      v-if="nicknameDialog"
      id="confirm-nickname"
      title="??????????????????"
      :description="`${nicknameDialog.name}?????????????????????????????????`"
      @close="onCloseNickname"
    >
      <div class="item">
        <label for="name">??????????????????</label>
        <input
          id="name"
          @keydown.enter="onNickname(nicknameDialog)"
          v-model="nickname"
        />
      </div>
      <GamifyList :border="false" direction="horizon">
        <GamifyItem>
          <GamifyButton @click="onCloseNickname">???????????????</GamifyButton>
        </GamifyItem>
        <GamifyItem>
          <GamifyButton @click="onNickname(nicknameDialog)"
            >????????????</GamifyButton
          >
        </GamifyItem>
      </GamifyList>
    </GamifyDialog>
    <GamifyDialog
      v-if="releaseDialog"
      id="confirm-release"
      title="????????????"
      :description="`??????????????????${
        releaseDialog.nickname || releaseDialog.name
      }????????????????????????????????????????????????????????????????????????????????????????????????`"
      @close="onCloseRelease"
    >
      <GamifyList :border="false" direction="horizon">
        <GamifyItem>
          <GamifyButton @click="onCloseRelease">?????????</GamifyButton>
        </GamifyItem>
        <GamifyItem>
          <GamifyButton @click="onRelease(releaseDialog.id)">??????</GamifyButton>
        </GamifyItem>
      </GamifyList>
    </GamifyDialog>
  </div>
</template>

<style scoped>
.item > label {
  display: block;
  margin-bottom: 0.25rem;
}

.gamify-item:hover img {
  animation: bounce;
  animation-duration: 0.8s;
  animation-iteration-count: infinite;
}

.trainer-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.trainer-info > img {
  width: 3rem;
  height: 3rem;
}
</style>
