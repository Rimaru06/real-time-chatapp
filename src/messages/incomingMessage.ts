import z from 'zod';

export enum SupportMessage {
    JoinRom = "JOIN_ROOM",
    SendMessage = "SEND_MESSAGE"
}

export type IncomingMessage = {
    type : SupportMessage.JoinRom,
    payload : InitMessageType
} | {
    type : SupportMessage.SendMessage,
    payload : UserMessageType
}

export const InitMessage =  z.object({
    name : z.string(),
    userId : z.string(),
    roomId : z.string()
})
export type InitMessageType = z.infer<typeof InitMessage>;


export const UserMessage = z.object({
    userId : z.string(),
    roomId : z.string(),
    message : z.string()
})

export type UserMessageType = z.infer<typeof UserMessage>;