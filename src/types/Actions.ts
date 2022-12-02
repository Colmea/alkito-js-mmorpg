export enum ActionType {
    ENTITY_GO_TO = 'action.entity.go-to',
    ENTITY_SELECT = 'action.entity.select',
    RESOURCE_COLLECT_BEGIN = 'action.resource.collect-begin',
    RESOURCE_COLLECT = 'action.resource.collect',
    ACTION_PROGRESS = 'action.progress',
    SKILL_INCREASE = 'action.skill.increase',
    SKILL_LEVEL_UP = 'action.skill.level-up',
    CHAT_SEND_MESSAGE = 'chat.message.send',
    OPEN_MENU = 'menu.open',
    CLOSE_MENU = 'menu.close',
};

export enum ServerEvent {
    CHAT_NEW_MESSAGE = 'server.chat.new-message',
    ENTITY_MOVED = 'server.entity.move',
}