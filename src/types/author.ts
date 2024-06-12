export interface Author {
  id: string
  email: string
  nickname: string
  avatar: string
  profile: string
  gender: number
  career: string
  birthday: number
  degree: string
}

export interface AuthorForUpdate {
  nickname: string
  avatar: string
  profile: string
  gender: number
  career: string
  birthday: number
  degree: string
}

export interface AuthorForUpdatePassword {
  code: string
  password: string
  repeatPassword: string
}

export interface AuthorForUpdateEmail {
  code: string
  email: string
}

export class AuthorForLogin {
  email: string
  password: string

  constructor(email: string, password: string) {
    this.email = email
    this.password = password
  }
}

export class AuthorForRegister {
  email: string
  password: string
  repeatPassword: string

  constructor(email: string, password: string, repeatPassword: string) {
    this.email = email
    this.password = password
    this.repeatPassword = repeatPassword
  }
}
