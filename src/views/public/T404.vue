<template>
    <NResult status="404" title="404 - Ressource introuvable">
        <template #footer>
            <NP :depth="3">Il semblerait que ce lien ne mène nulle part...</NP>
            <NButton @click="onReturnToHomeClick">
                Retourner à la page d'accueil
            </NButton>
        </template>
    </NResult>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const onReturnToHomeClick = () => {
    router.push("/");
};
</script>
