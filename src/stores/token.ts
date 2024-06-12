import { defineStore } from 'pinia'
import type { Token } from '../types/token'

export const useTokenStore = defineStore('token', {
  state: () => {
    return {
      token: null as Token | null
    }
  },
  persist: true,
  actions: {
    setToken(token: Token) {
      this.token = token
    },
    clear() {
      this.token = null
    }
  },
  getters: {
    accessToken(): string {
      return this.token?.accessToken ?? ''
    },
    refreshToken(): string {
      return this.token?.refreshToken ?? ''
    }
  }
})
