/**
 * Created by qiangxl on 2019/3/24.
 */
import echarts from 'echarts'

const showData = () => {
  let myChart1 = echarts.init(document.getElementById('echarts1'));
  let myChart2 = echarts.init(document.getElementById('echarts2'));
  let myChart3 = echarts.init(document.getElementById('echarts3'));
  let myChart4 = echarts.init(document.getElementById('echarts4'));
  let myChart5 = echarts.init(document.getElementById('echarts5'));
  let myChart6 = echarts.init(document.getElementById('echarts6'));
  let myChart7 = echarts.init(document.getElementById('echarts7'));

  //商城访问量
  let option1 = {
    tooltip: {
      trigger: 'axis',
      position: function (pt) {
        return [pt[0], '10%'];
      }
    },
    title: {
      left: 'center',
      text: '商城访问量(单位: 次/每日)',
    },
    toolbox: {
      feature: {
        restore: {},
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20']
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%']
    },
    dataZoom: [{
      type: 'inside',
      start: 0,
      end: 50
    }, {
      start: 0,
      end: 50,
      handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
      handleSize: '80%',
      handleStyle: {
        color: '#fff',
        shadowBlur: 3,
        shadowColor: 'rgba(0, 0, 0, 0.6)',
        shadowOffsetX: 2,
        shadowOffsetY: 2
      }
    }],
    series: [
      {
        name: '访问量',
        type: 'line',
        smooth: true,
        symbol: 'none',
        sampling: 'average',
        itemStyle: {
          color: 'rgb(255, 70, 131)'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: 'rgb(255, 158, 68)'
          }, {
            offset: 1,
            color: 'rgb(255, 70, 131)'
          }])
        },
        data: [20, 51, 32, 73, 21, 69, 74, 100, 89, 120, 135, 115, 160, 147, 113, 159,164, 103, 129, 178]
      }
    ]
  };


  let data = [["2019-04-01", 16], ["2019-04-02", 29], ["2019-04-03", 35], ["2019-04-04", 36], ["2019-04-05", 23], ["2019-04-06", 25], ["2019-04-07", 33], ["2019-04-08", 48], ["2019-04-09", 52], ["2019-04-10", 60], ["2019-04-11", 45], ["2019-04-12", 39], ["2019-04-13", 15], ["2019-04-14", 51], ["2019-04-15", 39], ["2019-04-16", 26], ["2019-04-17", 37], ["2019-04-18", 28], ["2019-04-19", 64], ["2019-04-20", 54], ["2019-04-21", 71], ["2019-04-22", 86], ["2019-04-23", 44], ["2019-04-24", 73], ["2019-04-25", 45], ["2019-04-26", 63], ["22019-04-27", 53], ["2019-04-28", 55], ["2019-04-29", 77]];
  let dateList = data.map(function (item) {
    return item[0];
  });
  let valueList1 = [], valueList2 = [], sum = 0
  data.forEach(function (item) {
    sum += item[1]
    valueList1.push(item[1])
    valueList2.push(sum)
  });

  //用户数增长
  let option2 = {

    // Make gradient line here
    visualMap: [{
      show: false,
      type: 'continuous',
      seriesIndex: 0,
      min: 0,
      max: 400
    }, {
      show: false,
      type: 'continuous',
      seriesIndex: 1,
      dimension: 0,
      min: 0,
      max: dateList.length - 1
    }],


    title: [{
      left: 'center',
      text: '用户增长量(单位：人/每日)'
    }, {
      top: '55%',
      left: 'center',
      text: '用户总量(单位：人)'
    }],
    tooltip: {
      trigger: 'axis'
    },
    toolbox: {
      show: true,
      feature: {
        saveAsImage: {show: true}
      }
    },
    xAxis: [{
      data: dateList
    }, {
      data: dateList,
      gridIndex: 1
    }],
    yAxis: [{
      splitLine: {show: false}
    }, {
      splitLine: {show: false},
      gridIndex: 1
    }],
    grid: [{
      bottom: '60%'
    }, {
      top: '60%'
    }],
    series: [{
      type: 'line',
      showSymbol: false,
      data: valueList1
    }, {
      type: 'line',
      showSymbol: false,
      data: valueList2,
      xAxisIndex: 1,
      yAxisIndex: 1
    }]
  };
  //用户分类
  let option3 = {
    title: {
      text: '用户分类'
    },
    legend: {
      data: ['普通用户', '只出售过闲置物品', '只购买过闲置物品', '既出售过又购买过']
    },
    tooltip: {
      trigger: 'item',
      formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    toolbox: {
      show: true,
      feature: {
        saveAsImage: {show: true}
      }
    },
    series: [
      {
        name: '访问来源',
        type: 'pie',
        radius: '75%',
        data: [
          {value: 100, name: '普通用户'},
          {value: 50, name: '只出售过闲置物品'},
          {value: 60, name: '只购买过闲置物品'},
          {value: 20, name: '既出售过又购买过',},
        ]
      }
    ]
  };
  //上传待交易物品的数量
  let option4 = {

    visualMap: [{
      show: false,
      type: 'continuous',
      seriesIndex: 0,
      min: 0,
      max: 400
    }, {
      show: false,
      type: 'continuous',
      seriesIndex: 1,
      dimension: 0,
      min: 0,
      max: dateList.length - 1
    }],


    title: [{
      left: 'center',
      text: '上传交易物品量(单位：件/每日)'
    }, {
      top: '55%',
      left: 'center',
      text: '交易物品总量(单位：件)'
    }],
    tooltip: {
      trigger: 'axis'
    },
    toolbox: {
      show: true,
      feature: {
        saveAsImage: {show: true}
      }
    },
    xAxis: [{
      data: dateList
    }, {
      data: dateList,
      gridIndex: 1
    }],
    yAxis: [{
      splitLine: {show: false}
    }, {
      splitLine: {show: false},
      gridIndex: 1
    }],
    grid: [{
      bottom: '60%'
    }, {
      top: '60%'
    }],
    series: [{
      type: 'line',
      showSymbol: false,
      data: valueList1
    }, {
      type: 'line',
      showSymbol: false,
      data: valueList2,
      xAxisIndex: 1,
      yAxisIndex: 1
    }]
  };
  //种类占比
  let option5 = {
    title: {
      text: '商品种类'
    },
    legend: {
      data: ['书籍/资料', '笔/文具', '化妆品', '日常用品', '球/球拍', '自行车/健身卡', '手机/电脑', '电子产品'],
      type: 'scroll',
      orient: 'vertical',
      right: 20,
      top: 20,
      bottom: 20,
    },
    tooltip: {
      trigger: 'item',
      formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    toolbox: {
      show: true,
      feature: {
        saveAsImage: {show: true}
      }
    },
    series: [
      {
        name: '访问来源',
        type: 'pie',
        roseType: 'angle',
        radius: '75%',
        center: ['40%', '50%'],
        data: [
          {value: 30, name: '书籍/资料'},
          {value: 10, name: '笔/文具'},
          {value: 20, name: '化妆品',},
          {value: 40, name: '日常用品'},
          {value: 15, name: '球/球拍'},
          {value: 10, name: '自行车/健身卡'},
          {value: 15, name: '手机/电脑'},
          {value: 18, name: '电子产品'}
        ]
      }
    ]
  };
  //交易总览
  let option6 = {
    title: {
      text: '四月份商品交易种类总览'
    },
    tooltip: {},
    toolbox: {
      show: true,
      feature: {
        restore: {},
        saveAsImage: {show: true}
      }
    },
    legend: {
      data: ['上新', '卖出']
    },
    xAxis: {
      data: ["书籍/资料", "笔/文具", "化妆品", "日常用品", "球/球拍", '自行车/健身卡', '手机/电脑', '电子产品']
    },
    yAxis: {},
    dataZoom: [
      {
        type: 'slider',
        xAxisIndex: 0,
        start: 0,
        end: 100
      },
      {
        type: 'inside',
        xAxisIndex: 0,
        start: 0,
        end: 100
      }
    ],
    series: [
      {
        name: '上新',
        type: 'bar',
        data: [30, 10, 20, 40, 15, 10, 15, 18]
      },
      {
        name: '卖出',
        type: 'bar',
        data: [20, 5, 20, 30, 12, 8, 11, 15]
      }
    ]

  };


  let option7 = {

    visualMap: [{
      show: false,
      type: 'continuous',
      seriesIndex: 0,
      min: 0,
      max: 400
    }, {
      show: false,
      type: 'continuous',
      seriesIndex: 1,
      dimension: 0,
      min: 0,
      max: dateList.length - 1
    }],


    title: [{
      left: 'center',
      text: '交易量(单位：单/每日)'
    }, {
      top: '55%',
      left: 'center',
      text: '交易总量(单位：单)'
    }],
    tooltip: {
      trigger: 'axis'
    },
    toolbox: {
      show: true,
      feature: {
        saveAsImage: {show: true}
      }
    },
    xAxis: [{
      data: dateList
    }, {
      data: dateList,
      gridIndex: 1
    }],
    yAxis: [{
      splitLine: {show: false}
    }, {
      splitLine: {show: false},
      gridIndex: 1
    }],
    grid: [{
      bottom: '60%'
    }, {
      top: '60%'
    }],
    series: [{
      type: 'line',
      showSymbol: false,
      data: valueList1
    }, {
      type: 'line',
      showSymbol: false,
      data: valueList2,
      xAxisIndex: 1,
      yAxisIndex: 1
    }]
  };
  // 指定图表的配置项和数据


  // 使用刚指定的配置项和数据显示图表。
  myChart1.setOption(option1);
  myChart2.setOption(option2);
  myChart3.setOption(option3);
  myChart4.setOption(option4);
  myChart5.setOption(option5);
  myChart6.setOption(option6);
  myChart7.setOption(option7);
}

export default {
  showData
}