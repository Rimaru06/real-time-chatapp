export enum SupportedMessage {
    addChat = "ADD_CHAT",
    UpdateChat = "UPDATE_CHAT"
}

type MessagePayload = {
    roomId : string,
    message : string,
    name : string,
    chatId : string
}

export type OutgoingMessage = {
    type : SupportedMessage.addChat,
    payload : MessagePayload
} | {
    type : SupportedMessage.UpdateChat,
    payload : Partial<MessagePayload>
}