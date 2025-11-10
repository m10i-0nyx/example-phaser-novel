// イベントタイプのenum定義
export enum EventTypeEnum {
    Dialog = 'dialog',
    SetBackground = 'set_background',
    SetFrame = 'set_frame',
    AddForeground = 'add_foreground',
    ClearForeground = 'clear_foreground',
    TimelineTransition = 'timeline_transition',
    SceneTransition = 'scene_transition',
    Choice = 'choice',
    PlaySound = 'play_sound',
    ClearSound = 'clear_sound'
}

// ダイアログ表示イベント
type DialogEvent = {
    event: EventTypeEnum.Dialog,
    text: string,
    actor_name?: string
};

// 背景設定イベント
type SetBackgroundEvent = {
    event: EventTypeEnum.SetBackground,
    x?: number,
    y?: number,
    key: string,
    effect?: string
};

// 背景設定イベント
type SetFrameEvent = {
    event: EventTypeEnum.SetFrame,
    x?: number,
    y?: number,
    key: string
};

// 前景追加イベント
type AddForegroundEvent = {
    event: EventTypeEnum.AddForeground,
    x?: number,
    y?: number,
    key: string
};

// 前景クリアイベント
type ClearForegroundEvent = {
    event: EventTypeEnum.ClearForeground
};

// タイムライン遷移イベント
type TimelineTransitionEvent = {
    event: EventTypeEnum.TimelineTransition,
    key: string
};

// シーン遷移イベント
type SceneTransitionEvent = {
    event: EventTypeEnum.SceneTransition,
    key: string,
    data?: object
};

// 選択肢イベント
type ChoiceEvent = {
    event: EventTypeEnum.Choice,
    choices: Choice[]
};

export type Choice = {
    text: string,
    key: string
};

type PlaySoundEvent = {
    event: EventTypeEnum.PlaySound,
    key: string,
    loop?: boolean
};

type ClearSoundEvent = {
    event: EventTypeEnum.ClearSound,
    key: string
};

// Timelineはイベントの配列
export type Timeline = (
    DialogEvent |
    SetBackgroundEvent |
    SetFrameEvent |
    AddForegroundEvent |
    ClearForegroundEvent |
    TimelineTransitionEvent |
    SceneTransitionEvent |
    ChoiceEvent |
    PlaySoundEvent |
    ClearSoundEvent
)[];
