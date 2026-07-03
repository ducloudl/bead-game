<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>上传模板功能测试指南</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .step { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 8px; }
        .test-image { width: 200px; height: 200px; object-fit: cover; border-radius: 8px; }
    </style>
</head>
<body>
    <h1>📤 上传模板功能测试指南</h1>
    
    <div class="step">
        <h3>🎯 测试步骤：</h3>
        <ol>
            <li>打开 <a href="https://ducloudl.github.io/bead-game/" target="_blank">拼豆游戏</a></li>
            <li>点击工具栏中的 <strong>"📤 上传"</strong> 按钮</li>
            <li>选择一张图片（建议正方形图片）</li>
            <li>选择网格大小（20×20 推荐）</li>
            <li>查看预览并点击 "使用此模板"</li>
        </ol>
    </div>
    
    <div class="step">
        <h3>🔍 如果遇到问题：</h3>
        <ul>
            <li>按 F12 打开开发者工具</li>
            <li>切换到 Console 标签</li>
            <li>尝试上传并查看错误信息</li>
            <li>截图发给我</li>
        </ul>
    </div>
    
    <div class="step">
        <h3>📸 测试图片推荐：</h3>
        <ul>
            <li>正方形图片效果最好</li>
            <li>颜色鲜明的图片转换效果更好</li>
            <li>避免过于复杂的照片</li>
        </ul>
        <img src="https://via.placeholder.com/200" alt="测试图片" class="test-image">
    </div>
    
    <div class="step">
        <h3>⚙️ 技术细节：</h3>
        <ul>
            <li>自动颜色匹配：将图片颜色映射到35种拼豆颜色</li>
            <li>透明像素：自动跳过透明区域</li>
            <li>网格大小：支持15×15, 20×20, 25×25, 30×30</li>
        </ul>
    </div>
</body>
</html>
