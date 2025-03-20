import type { User } from '@/types'

export async function fetchUsers(): Promise<User[]> {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users')
    return await response.json()
  } catch (error) {
    console.error('Error fetching users:', error)
    return []
  }
}
