export class TitleScene extends Phaser.Scene {
    constructor() {
        super('title');
    }

    // TweenをPromiseでラップするユーティリティ関数
    private createTweenPromise(targets: any, config: Phaser.Types.Tweens.TweenBuilderConfig): Promise<void> {
        return new Promise((resolve) => {
            this.tweens.add({
                ...config,
                targets,
                onComplete: (_tween: Phaser.Tweens.Tween) => resolve()
            });
        });
    }

    create() {
        const { width, height } = this.game.canvas;

        // タイトル画像を追加（初期透明度を0に設定）
        const logo_image = this.add.image(width / 2, height / 2, 'logo');
        logo_image.setAlpha(0);

        // スキップフラグ
        let is_skipped = false;
        let can_skip = false;  // フェードイン完了後にスキップ可能にするフラグ

        // 画面を埋めるようなZoneを作成
        const zone = this.add.zone(width / 2, height / 2, width, height);

        // Zoneをクリックできるように設定
        zone.setInteractive({
            useHandCursor: true
        });

        // Zoneをクリックしたらスキップ
        zone.on('pointerdown', () => {
            if (!is_skipped && can_skip) {  // canSkip をチェック
                is_skipped = true;
                // 現在のTweenを破棄
                this.tweens.killTweensOf(logo_image);
                logo_image.setAlpha(0);  // logo_imageを非表示
                // title_imageを表示
                const title_image = this.add.image(width / 2, height / 2, 'title');
                title_image.setAlpha(1);

                // フェードアウトしてからMainSceneに遷移
                this.cameras.main.fadeOut(3000, 0, 0, 0);  // 3秒で黒にフェードアウト
                this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.scene.start('main', { id: 'start' });
                });
            }
        });

        // TweenをPromiseでラップしてチェーン
        this.createTweenPromise(logo_image, {
            targets: logo_image,
            alpha: 1,
            duration: 3000,
            ease: 'Linear'
        }).then(() => {
            if (is_skipped) return;  // スキップ済みなら中断
            can_skip = true;  // フェードイン完了後にスキップ可能
            // フェードアウト
            return this.createTweenPromise(logo_image, {
                targets: logo_image,
                alpha: 0,
                duration: 3000,
                ease: 'Linear'
            });
        }).then(() => {
            if (is_skipped) return;  // スキップ済みなら中断
            logo_image.destroy();

            const bgm = this.sound.add('bgm_title', { volume: 0 });
            // fade in
            this.tweens.add({
                targets: bgm,
                volume: { from: 0, to: 1 },
                duration: 2000,
            });
            bgm.play({ loop: true });

            // 2枚目を処理
            const title_image = this.add.image(width / 2, height / 2, 'title');
            title_image.setAlpha(0);
            return this.createTweenPromise(title_image, {
                targets: title_image,
                alpha: 1,
                duration: 2000,
                ease: 'Linear'
            });
        }).then(() => {
            if (is_skipped) return;  // スキップ済みなら中断
            // フェードイン完了後、クリックで遷移可能（既にZoneは作成済み）
        });
    }
}
