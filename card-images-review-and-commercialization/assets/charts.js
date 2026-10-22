(function() {
  var style = getComputedStyle(document.documentElement);
  var accent = style.getPropertyValue('--accent').trim();
  var accent2 = style.getPropertyValue('--accent2').trim();
  var ink = style.getPropertyValue('--ink').trim();
  var muted = style.getPropertyValue('--muted').trim();
  var rule = style.getPropertyValue('--rule').trim();
  var bg2 = style.getPropertyValue('--bg2').trim();
  var warn = style.getPropertyValue('--warn').trim();
  var danger = style.getPropertyValue('--danger').trim();

  // --- Chart 1: 服务端工程化评分雷达图 ---
  var radarEl = document.getElementById('chart-radar');
  if (radarEl) {
    var radar = echarts.init(radarEl, null, { renderer: 'svg' });
    radar.setOption({
      animation: false,
      tooltip: {
        appendToBody: true,
        trigger: 'item'
      },
      radar: {
        indicator: [
          { name: '项目结构', max: 10 },
          { name: '代码质量', max: 10 },
          { name: '错误处理', max: 10 },
          { name: '安全性', max: 10 },
          { name: '可观测性', max: 10 },
          { name: '配置管理', max: 10 },
          { name: '并发队列', max: 10 },
          { name: 'API 设计', max: 10 },
          { name: '数据持久化', max: 10 },
          { name: '测试覆盖', max: 10 },
          { name: '可扩展性', max: 10 },
          { name: '商业化就绪', max: 10 }
        ],
        radius: '65%',
        splitNumber: 5,
        axisName: {
          color: ink,
          fontSize: 12
        },
        splitLine: {
          lineStyle: { color: rule }
        },
        splitArea: {
          areaStyle: {
            color: [bg2, 'rgba(109,94,247,0.02)']
          }
        },
        axisLine: {
          lineStyle: { color: rule }
        }
      },
      series: [{
        type: 'radar',
        data: [{
          value: [7, 6, 7.5, 4, 5, 6, 6.5, 6.5, 1, 2, 5, 1.5],
          name: '当前评分',
          areaStyle: {
            color: 'rgba(109, 94, 247, 0.15)'
          },
          lineStyle: {
            color: accent,
            width: 2
          },
          itemStyle: {
            color: accent
          },
          label: {
            show: true,
            color: ink,
            fontSize: 11,
            fontWeight: 600
          }
        }]
      }]
    });
    window.addEventListener('resize', function() { radar.resize(); });
  }

  // --- Chart 2: 月收入预测柱状图 ---
  var revEl = document.getElementById('chart-revenue');
  if (revEl) {
    var rev = echarts.init(revEl, null, { renderer: 'svg' });
    rev.setOption({
      animation: false,
      tooltip: {
        appendToBody: true,
        trigger: 'axis',
        formatter: function(params) {
          var s = params[0].name + '<br/>';
          params.forEach(function(p) {
            s += p.marker + ' ' + p.seriesName + ': ¥' + p.value + '<br/>';
          });
          return s;
        }
      },
      legend: {
        data: ['保守(月增2000注册)', '乐观(月增1万注册)'],
        bottom: 0,
        textStyle: { color: muted, fontSize: 12 }
      },
      grid: {
        left: '8%',
        right: '5%',
        top: '10%',
        bottom: '15%'
      },
      xAxis: {
        type: 'category',
        data: ['第1月', '第2月', '第3月', '第4月', '第5月', '第6月'],
        axisLine: { lineStyle: { color: rule } },
        axisLabel: { color: muted, fontSize: 12 }
      },
      yAxis: {
        type: 'value',
        name: '月收入(¥)',
        nameTextStyle: { color: muted, fontSize: 11 },
        axisLine: { show: false },
        axisLabel: { color: muted, fontSize: 11 },
        splitLine: { lineStyle: { color: rule, type: 'dashed' } }
      },
      series: [
        {
          name: '保守(月增2000注册)',
          type: 'bar',
          data: [180, 380, 650, 950, 1250, 1600],
          itemStyle: {
            color: accent,
            borderRadius: [4, 4, 0, 0]
          },
          barWidth: '30%'
        },
        {
          name: '乐观(月增1万注册)',
          type: 'bar',
          data: [900, 1900, 3200, 4800, 6800, 9000],
          itemStyle: {
            color: accent2,
            borderRadius: [4, 4, 0, 0]
          },
          barWidth: '30%'
        }
      ]
    });
    window.addEventListener('resize', function() { rev.resize(); });
  }
})();
