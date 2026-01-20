<template>
    <NCard title="Erreur 404" bordered embedded :style="{ width: 'min(400px, 90vw)' }">
        <template #default>
            Rien d'intéressant ici...
        </template>
        <template #footer>
            <NP :depth="3">
                Pour revenir à la page de départ,
                <RouterLink to="/">
                    <NA>
                        cliquez ici
                    </NA>
                </RouterLink>...
            </NP>
        </template>
    </NCard>
</template>
