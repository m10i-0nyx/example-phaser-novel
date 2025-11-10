import { Choice, EventTypeEnum, Timeline } from '../types/timeline';
import { MessageDialog } from './message_dialog';

export class TimelinePlayer {
    private background_layer: Phaser.GameObjects.Container;
    private foreground_layer: Phaser.GameObjects.Container;
    private frame_layer: Phaser.GameObjects.Container;
    private ui_layer: Phaser.GameObjects.Container;
    private hit_area: Phaser.GameObjects.Zone;

    private timeline?: Timeline;
    private timeline_index = 0;

    private typing_timer: Phaser.Time.TimerEvent | undefined;  // タイマーを保存するプロパティ

    constructor(private scene: Phaser.Scene, private message_dialog: MessageDialog, private text_style: Phaser.Types.GameObjects.Text.TextStyle = {}) {
        // 背景レイヤー・前景レイヤー・UIレイヤーをコンテナを使って表現
        this.background_layer = this.scene.add.container(0, 0); // 背景用のレイヤー
        this.foreground_layer = this.scene.add.container(0, 0); // 前景用のレイヤー
        this.frame_layer = this.scene.add.container(0, 0); // 画面枠用のレイヤー
        this.scene.add.existing(this.message_dialog);  // ダイアログボックスは前景レイヤーとUIレイヤーの間に配置
        this.ui_layer = this.scene.add.container(0, 0);

        // クリック領域(hit_area)を画面全体に設定
        const { width, height } = this.scene.game.canvas;
        this.hit_area = new Phaser.GameObjects.Zone(this.scene, width / 2, height / 2, width, height);
        this.hit_area.setInteractive({
            useHandCursor: true
        });

        // hit_areaをクリックしたらnext()を実行
        this.hit_area.on('pointerdown', () => {
            this.next();
        });

        // hitAreaをUIレイヤーに追加
        this.ui_layer.add(this.hit_area);
    }

    // タイムラインの再生を開始
    public start(timeline: Timeline) {
        this.timeline = timeline;
        this.next();
    }

    // 背景画像をセット
    private setBackground(texture: string, x: number | undefined, y: number | undefined, effect: string | undefined) {
        // 背景レイヤーの子を全て削除
        this.background_layer.removeAll();
        const { width, height } = this.scene.game.canvas;
        if (x === undefined) {
            x = width / 2;
        }
        if (y === undefined) {
            y = height / 2;
        }
        // 背景画像のオブジェクトを作成
        const background_image = new Phaser.GameObjects.Image(this.scene, x, y, texture);

        switch (effect) {
            case 'fadein':
                // フェードインエフェクトの場合
                background_image.setAlpha(0);  // 初期透明度を0に設定

                // 背景レイヤーに画像オブジェクトを配置
                this.background_layer.add(background_image);

                // フェードインエフェクトを追加
                this.scene.tweens.add({
                    targets: background_image,
                    alpha: 1,  // 最終透明度を1に
                    duration: 1000,  // 1000msでフェードイン
                    ease: 'Linear'  // 線形補間
                });
                break;

            case 'fadeout':
                // フェードインエフェクトの場合
                background_image.setAlpha(100);  // 初期透明度を100に設定

                // 背景レイヤーに画像オブジェクトを配置
                this.background_layer.add(background_image);

                // フェードアウトエフェクトを追加
                this.scene.tweens.add({
                    targets: background_image,
                    alpha: 0,  // 最終透明度を0に
                    duration: 1000,  // 1000msでフェードアウト
                    ease: 'Linear'  // 線形補間
                });
                break;

            default:
                // 未知のエフェクトの場合はそのまま配置
                this.background_layer.add(background_image);
                break;
        }
    }

    // 画面枠をセット
    private setFrame(texture: string) {
        // 画面枠レイヤーの子を全て削除
        this.frame_layer.removeAll();
        const { width, height } = this.scene.game.canvas;
        // 画面枠画像のオブジェクトを作成
        const frame_image = new Phaser.GameObjects.Image(this.scene, width / 2, height / 2, texture);
        // 画面枠レイヤーに画像オブジェクトを配置
        this.frame_layer.add(frame_image);
    }

    // 前景画像を追加
    private addForeground(texture: string, x: number | undefined, y: number | undefined) {
        const { width, height } = this.scene.game.canvas;
        if (x === undefined) {
            x = width / 2;
        }
        if (y === undefined) {
            y = height / 2;
        }
        // 前景画像のオブジェクトを作成
        const foreground_image = new Phaser.GameObjects.Image(this.scene, x, y, texture);
        // 前景レイヤーに画像オブジェクトを配置
        this.foreground_layer.add(foreground_image);
    }

    // 前景をクリア
    private clearForeground() {
        // 前景レイヤーの子を全て削除
        this.foreground_layer.removeAll();
    }

    // 選択肢ボタンをセット
    private setChoiceButtons(choices: Choice[]) {
        if (choices.length === 0) {
            return;
        }
        this.hit_area.disableInteractive();  // hitAreaのクリックを無効化

        // ボタンを中央に配置するようにボタングループのY原点を計算
        const button_height = 40,
            button_margin = 40;
        const { width, height } = this.scene.game.canvas;
        const button_group_height = button_height * choices.length + button_margin * (choices.length - 1);
        const button_group_origin_y = height / 2 - button_group_height / 2;

        choices.forEach((choice, index) => {
            const y = button_group_origin_y + button_height * (index + 0.5) + button_margin * (index);

            // Rectangleでボタンを作成
            const button = new Phaser.GameObjects.Rectangle(this.scene, width / 2, y, width - button_margin * 2, button_height, 0x000000).setStrokeStyle(1, 0xffffff);
            button.setInteractive({
                useHandCursor: true
            });

            // マウスオーバーで色が変わるように設定
            button.on('pointerover', () => {
                button.setFillStyle(0x333333);
            });
            button.on('pointerout', () => {
                button.setFillStyle(0x000000);
            });

            // ボタンクリックでシーンをリスタートし、指定のタイムラインを実行する
            button.on('pointerdown', () => {
                // restart()の引数がシーンのinit()の引数に渡される
                this.scene.scene.restart({ id: choice.key });
            });

            // ボタンをUIレイヤーに追加
            this.ui_layer.add(button);

            // ボタンテキストを作成
            const button_text = new Phaser.GameObjects.Text(this.scene, width / 2, y, choice.text, this.text_style).setOrigin(0.5);

            // ボタンテキストをUIレイヤーに追加
            this.ui_layer.add(button_text);
        });
    }

    // Soundの再生
    private playSound(key: string, loop: boolean) {
        const sound = this.scene.sound.get(key) as Phaser.Sound.BaseSound;
        if (sound && sound.isPlaying) {
            return;
        }
        this.scene.sound.play(key, { loop: loop });
    }

    // Soundの再生を停止
    private clearSound(key: string) {
        const sound = this.scene.sound.get(key) as Phaser.Sound.BaseSound;
        if (sound && sound.isPlaying) {
            sound.destroy();
        }
    }

    // 次のタイムラインを実行
    private next() {
        if (!this.timeline) {
            return;
        }
        if (this.timeline_index >= this.timeline.length) {
            return;
        }

        // 既存のタイマーが存在し、全テキストが表示されていない場合、破棄してテキストを即座に完了させる
        if (this.typing_timer) {
            this.typing_timer.destroy();
            this.typing_timer = undefined;
            // テキストを全表示（タイピングエフェクトをスキップ）
            const currentEvent = this.timeline?.[this.timeline_index - 1];
            if (currentEvent?.event === EventTypeEnum.Dialog) {
                this.message_dialog.setText(currentEvent.text);
            }
        }

        // タイムラインのイベントを取得してから、timelineIndexをインクリメント
        const timeline_event = this.timeline[this.timeline_index++];

        switch (timeline_event.event) {
            case EventTypeEnum.Dialog:  // ダイアログイベント
                if (timeline_event.actor_name) {
                    // actorNameが設定されていたら名前を表示
                    this.message_dialog.setActorNameText(timeline_event.actor_name);
                } else {
                    // actorNameが設定されていなかったら名前を非表示
                    this.message_dialog.clearActorNameText();
                }
                // タイピングエフェクトを開始し、タイマーを保存
                this.typing_timer = this.message_dialog.setTextWithTypingEffect(timeline_event.text, 50);
                break;

            case EventTypeEnum.SetBackground:  // 背景設定イベント
                this.setBackground(timeline_event.key, timeline_event.x, timeline_event.y, timeline_event.effect);
                this.next();  // すぐに次のタイムラインを実行する
                break;

            case EventTypeEnum.SetFrame:  // 画面枠設定イベント
                this.setFrame(timeline_event.key);
                this.next();  // すぐに次のタイムラインを実行する
                break;

            case EventTypeEnum.AddForeground:  // 前景追加イベント
                this.addForeground(timeline_event.key, timeline_event.x, timeline_event.y);
                this.next();  // すぐに次のタイムラインを実行する
                break;

            case EventTypeEnum.ClearForeground:  // 前景クリアイベント
                this.clearForeground();
                this.next();  // すぐに次のタイムラインを実行する
                break;

            case EventTypeEnum.TimelineTransition:  // タイムライン遷移イベント
                // シーンをリスタートし、指定のタイムラインを実行する
                // restart()の引数がシーンのinit()の引数に渡される
                this.scene.scene.restart({ id: timeline_event.key });
                break;

            case EventTypeEnum.SceneTransition:  // シーン遷移イベント
                // 指定のシーンに遷移する
                // start()の第2引数がシーンのinit()の引数に渡される
                this.scene.scene.start(timeline_event.key, timeline_event.data);
                break;

            case EventTypeEnum.Choice:  // 選択肢イベント
                this.setChoiceButtons(timeline_event.choices);
                break;

            case EventTypeEnum.PlaySound:  // Sound再生イベント
                this.playSound(timeline_event.key, timeline_event.loop ?? false);
                this.next();  // すぐに次のタイムラインを実行する
                break;

            case EventTypeEnum.ClearSound:  // Soundクリアイベント
                this.clearSound(timeline_event.key);
                this.next();  // すぐに次のタイムラインを実行する
                break;

            default:
                break;
        }
    }
}
