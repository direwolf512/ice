import data from './data';
/*
华北地区：北京市、天津市、河北省、山西省、内蒙古自治区；
东北地区：辽宁省、吉林省、黑龙江省；
华东地区：上海市、江苏省、浙江省、安徽省、福建省、江西省、山东省、台湾省；
华中地区：河南省、湖北省、湖南省；
华南地区：广东省、广西壮族自治区、海南省、香港特别行政区、澳门特别行政区；
西南地区：重庆市、四川省、贵州省、云南省、西藏自治区；
西北地区：陕西省、甘肃省、青海省、宁夏回族自治区、新疆维吾尔自治区
*/

export const getAreas = () => {
  return [
    {
      districtIds:[
        {
          id: 110000,
          name: '北京市'
        }, {
          id: 120000,
          name: '天津市'
        }, {
          id: 130000,
          name: '河北省'
        }, {
          id: 140000,
          name: '山西省'
        }, {
          id: 150000,
          name: '内蒙古自治区'
        }
      ],
      id: 1,
      name:'华北'
    },
    {
      districtIds: [
        {
          id: 210000,
          name: '辽宁省'
        }, {
          id: 220000,
          name: '吉林省'
        }, {
          id: 230000,
          name: '黑龙江省'
        }
      ],
      id: 2,
      name:'东北'
    },
    {
      districtIds:[
        {
          id: 310000,
          name: '上海市'
        }, {
          id: 320000,
          name: '江苏省'
        }, {
          id: 330000,
          name: '浙江省'
        }, {
          id: 340000,
          name: '安徽省'
        }, {
          id: 350000,
          name: '福建省'
        }, {
          id: 360000,
          name: '江西省'
        }, {
          id: 370000,
          name: '山东省'
        }, {
          id: 710000,
          name: '台湾省'
        }
      ],
      id: 3,
      name:'华东'
    },
    {
      districtIds:[
        {
          id: 410000,
          name: '河南省'
        }, {
          id: 420000,
          name: '湖北省'
        }, {
          id: 430000,
          name: '湖南省'
        }
      ],
      id: 4,
      name:'华中'
    },
    {
      districtIds:[
        {
          id: 440000,
          name: '广东省'
        }, {
          id: 450000,
          name: '广西壮族自治区'
        }, {
          id: 460000,
          name: '海南省'
        }, {
          id: 810000,
          name: '香港特别行政区'
        }, {
          id: 820000,
          name: '澳门特别行政区'
        }
      ],
      id: 5,
      name:'华南'
    },
    {
      districtIds:[
        {
          id: 500000,
          name: '重庆市'
        }, {
          id: 510000,
          name: '四川省'
        }, {
          id: 520000,
          name: '贵州省'
        }, {
          id: 530000,
          name: '云南省'
        }, {
          id: 540000,
          name: '西藏自治区'
        }
      ],
      id: 6,
      name:'西南'
    },
    {
      districtIds:[
        {
          id: 610000,
          name: '陕西省'
        }, {
          id: 620000,
          name: '甘肃省'
        }, {
          id: 630000,
          name: '青海省'
        }, {
          id: 640000,
          name: '宁夏回族自治区'
        }, {
          id: 650000,
          name: '新疆维吾尔自治区'
        }
      ],
      id: 7,
      name:'西北'
    },
  ]
}

let mapData;
export const getMapData = () => {
  if(!mapData) {
    mapData = new Map(Object.keys(data).map(id => {
      return [
        id,
        data[id]
      ]
    }));
  }
  return mapData;
}

/**
 * 根据父级id 筛选
 */
export const districtFilter = (parentId?:number):Array<{
  parentId:number,
  id:number,
  name:string
}> => {
  let items = [];
  if(!parentId) return items;
  for(let [key,value] of getMapData()) {
    if(value[1] !== parentId) continue;
    items.push({
      parentId: parentId,
      id: key,
      name: value[0],
    })
  }
  return items;
}

/**
 * 获取当前国家下所有的省
 * @param contryId 
 */
export const getProvinces = (contryId?:number):Array<{
  id:number,
  name:string
}> => {
  return districtFilter(contryId || 1);
}

/**
 * 获取id对应的城市名称
 * @param id 
 */
export const getDistrictName = (id: any): string => {
  let resultName: string = '';
  for(let [key, value] of getMapData()) {
    if (key === id) {
      resultName = value[0];
    }
  }
  return resultName;
}