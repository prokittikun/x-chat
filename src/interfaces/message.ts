export interface MessageInterface {
    name: string
    uid: string
    avatar: any
    createdAt: MessageCreatedAt
    text: string
    id: string
  }
  
  export interface MessageCreatedAt {
    seconds: number
    nanoseconds: number
  }
  