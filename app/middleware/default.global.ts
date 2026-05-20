export default defineNuxtRouteMiddleware((to, from) => {
    if (import.meta.client) {
        const isTransition = useState('isTransition', () => true)
        isTransition.value = true

        return new Promise((resolve) => setTimeout(resolve, 250))
    }
})
