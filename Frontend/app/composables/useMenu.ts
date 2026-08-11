import { computed } from 'vue'
import { useRoute } from '#imports'
import { useAuth } from './useAuth'

export function useMenu() {
	const route = useRoute()
	const auth = useAuth()

	const items = computed(() => {
		const menuItems = [{
			label: 'ពាក្យចិន',
			to: '/',
			icon: 'i-lucide-book-open',
			active: route.path === '/'
		}, {
			label: 'ភីងអ៊ីន',
			to: '/Pinyin',
			icon: 'i-lucide-languages',
			active: route.path.startsWith('/Pinyin')
		}, {
			label: 'គំនូសចិន',
			to: '/Stocktype',
			icon: 'i-lucide-pen-tool',
			active: route.path.startsWith('/Stocktype')
		}]

		// Allow SSR to see these if cookies are present
		if (auth.isAdmin.value || auth.isEmployee.value) {
			menuItems.push({
				label: 'គ្រប់គ្រង',
				to: '/admin',
				icon: 'i-lucide-settings',
				active: route.path.startsWith('/admin')
			})
		}

		return menuItems
	})

	return {
		items
	}
}
