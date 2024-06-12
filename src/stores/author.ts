import type { Author } from '@/types/author'
import { defineStore } from 'pinia'

interface State {
  author: Author | null
}

export const useAuthorStore = defineStore('author', {
  state: (): State => {
    return {
      author: null
    }
  },
  persist: true,
  actions: {
    setAuthor(author: Author) {
      this.author = author
    },
    clear() {
      this.author = null
    }
  },
  getters: {
    getAuthor(): Author {
      return this.author!
    },
    isLogin(): boolean {
      return this.author !== null
    },
    authorId(): string | null {
      return this.author?.id ?? null
    },
    email(): string {
      return this.author?.email ?? ''
    },
    avatar(): string {
      return this.author?.avatar ?? '/default_header.png'
    },
    nickname(): string {
      return this.author?.nickname ?? ''
    },
    profile(): string {
      return this.author?.profile ?? ''
    },
    gender(): number {
      return this.author?.gender ?? 0
    },
    career(): string {
      return this.author?.career ?? ''
    },
    birthday(): number {
      return this.author?.birthday ?? 0
    },
    degree(): string {
      return this.author?.degree ?? ''
    }
  }
})
