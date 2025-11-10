export class EndingScene extends Phaser.Scene {
    constructor() {
        super('ending');
    }

    create() {
        const { width, height } = this.game.canvas;

        this.add.image(width / 2, height / 2, 'title');

        // 開発者の名前を配列で定義
        const developers = [
            'Developer',
            'm10i'
        ];

        // スクロールテキストを作成（初期位置は画面下）
        const scrollText = this.add.text(width / 2, height + 50, developers.join('\n'), {
            fontSize: '32px',
            color: '#0004ffff',
            align: 'center'
        }).setOrigin(0.5);

        // Tweenで上へスクロール
        this.tweens.add({
            targets: scrollText,
            y: -scrollText.height,  // 画面上端まで移動
            duration: 10000,  // 10秒でスクロール
            ease: 'Linear',
            onComplete: () => {
                // スクロール完了後に画面を暗転
                this.cameras.main.fadeOut(2000, 0, 0, 0);  // 2秒で黒にフェードアウト
                this.cameras.main.once('camerafadeoutcomplete', () => {
                    // 暗転完了後にタイトルシーンへ遷移
                    this.scene.start('title');
                });
            }
        });
    }
}
