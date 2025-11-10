import { EventTypeEnum } from '../../src/types/timeline';
import { PreloadFileDict, Timelines } from '../../src/types/timelines';

export const illustrationFiles: PreloadFileDict = {
    'frame': 'assets/image/common/frame.png',
    '001': 'assets/image/illustration/001.png',
    '002': 'assets/image/illustration/002.png',
};

export const musicFiles: PreloadFileDict = {
    'bgm_title': 'assets/sound/music/orc01.mp3',
    'bgm_battle01': 'assets/sound/music/battle01.mp3',
    'effect_poison': 'assets/sound/effect/poison.wav',
};

export const senarioData: Timelines = {
    start: [
        { event: EventTypeEnum.ClearSound, key: 'bgm_title' },
        { event: EventTypeEnum.ClearForeground },
        { event: EventTypeEnum.SetFrame, key: 'frame' },
        { event: EventTypeEnum.Dialog, text: '・・・・・・ ▼', actor_name: '???' },
        { event: EventTypeEnum.Dialog, text: 'う、うーん・・・ ▼', actor_name: '???' },
        { event: EventTypeEnum.SetBackground, key: '001', effect: 'fadein' },
        { event: EventTypeEnum.PlaySound, key: 'bgm_battle01', loop: true },
        { event: EventTypeEnum.Dialog, text: 'お、目が覚めた？ ▼', actor_name: '謎の娘' },
        { event: EventTypeEnum.Dialog, text: 'な、なにしてるの？！ ▼', actor_name: '???' },
        { event: EventTypeEnum.ClearSound, key: 'bgm_battle01' },
        { event: EventTypeEnum.SceneTransition, key: 'ending' }
    ]
}
