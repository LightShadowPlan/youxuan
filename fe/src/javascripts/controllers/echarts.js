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
      data: ['2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020']
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
        data: [2, 5, 3, 7, 1, 9, 4, 10, 8, 6, 2, 5, 3, 7, 1, 9, 4, 10, 8, 6]
      }
    ]
  };


  let data = [["2000-06-05", 116], ["2000-06-06", 129], ["2000-06-07", 135], ["2000-06-08", 86], ["2000-06-09", 73], ["2000-06-10", 85], ["2000-06-11", 73], ["2000-06-12", 68], ["2000-06-13", 92], ["2000-06-14", 130], ["2000-06-15", 245], ["2000-06-16", 139], ["2000-06-17", 115], ["2000-06-18", 111], ["2000-06-19", 309], ["2000-06-20", 206], ["2000-06-21", 137], ["2000-06-22", 128], ["2000-06-23", 85], ["2000-06-24", 94], ["2000-06-25", 71], ["2000-06-26", 106], ["2000-06-27", 84], ["2000-06-28", 93], ["2000-06-29", 85], ["2000-06-30", 73], ["2000-07-01", 83], ["2000-07-02", 125], ["2000-07-03", 107], ["2000-07-04", 82], ["2000-07-05", 44], ["2000-07-06", 72], ["2000-07-07", 106], ["2000-07-08", 107], ["2000-07-09", 66], ["2000-07-10", 91], ["2000-07-11", 92], ["2000-07-12", 113], ["2000-07-13", 107], ["2000-07-14", 131], ["2000-07-15", 111], ["2000-07-16", 64], ["2000-07-17", 69], ["2000-07-18", 88], ["2000-07-19", 77], ["2000-07-20", 83], ["2000-07-21", 111], ["2000-07-22", 57], ["2000-07-23", 55], ["2000-07-24", 60]];
  var dateList = data.map(function (item) {
    return item[0];
  });
  var valueList = data.map(function (item) {
    return item[1];
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
      data: valueList
    }, {
      type: 'line',
      showSymbol: false,
      data: valueList,
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
      data: valueList
    }, {
      type: 'line',
      showSymbol: false,
      data: valueList,
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
      data: valueList
    }, {
      type: 'line',
      showSymbol: false,
      data: valueList,
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