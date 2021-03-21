//テスト動作開始
//browser-sync start --server --files *
// メイン処理
phina.main(function() {
  // アプリケーション生成
  var app = GameApp({
    // メインシーンから開始する
    startLabel: 'title',
    //アセット
    assets: mainImg,
    //シーン管理
    scenes: [
        //タイトル
        {
          label: 'title',
          className: 'TitleScene',
        },
        //ステージセレクト
        {
          label: 'select',
          className: 'StageSelect',
          nextLabel: 'game',
        },
        //メイン
        {
          label: 'game',
          className: 'GameScene',
          nextLabel: 'title',
        }
    ]
  });
  // アプリケーション実行
  app.run();
});
