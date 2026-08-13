const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
  // 允许跨域请求
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: '请提供藏宝阁链接' });
    }

    // 发起请求获取网页内容
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      },
      timeout: 10000 // 10秒超时
    });

    const html = response.data;
    
    // 使用 cheerio 解析 HTML
    const $ = cheerio.load(html);
    
    // 在这里编写你的具体提取逻辑
    // 下面是通用的数据提取示例（你可以根据藏宝阁实际页面结构调整）
    const result = {
      title: $('title').text().trim(),
      price: $('.price').text().trim(), // 示例：价格
      description: $('.desc').text().trim(), // 示例：描述
      details: []
    };

    // 示例：提取列表项
    $('.list-item').each((index, element) => {
      result.details.push({
        name: $(element).find('.name').text().trim(),
        value: $(element).find('.value').text().trim()
      });
    });

    // 返回解析后的 JSON 数据
    return res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('抓取失败:', error.message);
    return res.status(500).json({
      success: false,
      error: '抓取失败，请检查链接是否正确或目标网站是否可访问'
    });
  }
};
