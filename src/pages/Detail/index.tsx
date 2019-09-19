import React, { useState, useEffect, useMemo } from 'react';
import IceContainer from '@icedesign/container';
import {
  Breadcrumb,
  Button,
  Input,
  Select,
  Checkbox,
  Form, 
  Grid,
  Message
} from '@alifd/next';

import './index.scss';
import Coverage from './coverage'
import { warehouseTypes, saleModes, storageCharacteristics, businessCharacteristics } from '../../constant';
import { districtFilter, getProvinces, getDistrictName, getAreas } from '../../lib/addr';
// import { createWarehouse, getWarehouseDetail, editWarehouse } from '../../../service';
// import { getQueryVariable } from '../../../utils';

const FormItem = Form.Item;
const Option = Select.Option;
const { Group: CheckboxGroup } = Checkbox;
const { Row, Col } = Grid;

export default () => {
  const [init, setInit] = useState(true);
  const [warehouseData, setWarehouseData] = useState({
    typeId: warehouseTypes[0].value,
    merchantId: saleModes[0].value,
    name: '',
    provinceId: undefined,
    cityId: undefined,
    areaId: undefined,
    address: '',
    contact: {
      name: '',
      tel: undefined
    },
    contact2: {
      name: '',
      tel: undefined
    },
    returnGoodscontact: {
      name: '',
      tel: undefined
    },
    remark: '',
    characteristics: {
      store: [],
      business: []
    }
  });
  const [provinceData, setProvinceData] = useState(getProvinces(1));
  const [cityData, setCityData] = useState();
  const [regionData, setRegionData] = useState();
  const [areaChoice, setAreaChoice] = useState();
  const [coverageCity, setCoverageCity] = useState();
  const [wholecountry, setWholecountry] = useState(false);
    const [ifWholecountryChoice, setIfWholecountryChoice] = useState(false);
    const [areaModuleChoice, setAreaModuleChoice] = useState();

//   let detailId = getQueryVariable('id', window.location.href);

  interface Area {
    checkedAll: boolean;
    districts: any[];
    [propName: string]: any;
  }

  useEffect(() => {
    let areas = {}
    for (let i = 0; i < 7; i++) {
      let area: Area;
      area = {
        checkedAll: false,
        districts: []
      }
      areas[i] = area;
    }
    setAreaChoice(areas);
    // if (detailId) {
    //   getWarehouseDetail({id: detailId}).then(({error, result}) => {
    //     if (error) {
    //       Message.error(error.message);
    //     } else {
    //       let data = {
    //         typeId: result.typeId || warehouseTypes[0].value,
    //         merchantId: result.merchantId || saleModes[0].value,
    //         name: result.name || '',
    //         provinceId: result.provinceId || undefined,
    //         cityId: result.cityId || undefined,
    //         areaId: result.areaId || undefined,
    //         address: result.address || '',
    //         contact: {
    //           name: result.firstContact || '',
    //           tel: result.firstContactTel || undefined
    //         },
    //         contact2: {
    //           name: result.secondContact || '',
    //           tel: result.secondContactTel || undefined
    //         },
    //         returnGoodscontact: {
    //           name: result.returnContact || '',
    //           tel: result.returnContactTel || undefined
    //         },
    //         remark: result.remark || '',
    //         characteristics: {
    //           store: result.characteristics.store && result.characteristics.store.split(',').map(i => Number(i)) || [],
    //           business: result.characteristics.business && result.characteristics.business.split(',').map(i => Number(i)) || []
    //         }
    //       }
    //       if (result.coverage.type === 0) {
    //         setWholecountry(true);
    //       } else {
    //         let coverageData = result.coverage.data;
    //         let areaChoiceMid = areaChoice && JSON.parse(JSON.stringify(areaChoice));
    //         let areaModule: number[] = [];
    //         if (areaChoiceMid) {
    //           for (let i in coverageData) {
    //             let regionId = +i;
    //             let districts: any[] = [];
    //             let keys = Object.keys(coverageData[i]);
    //             areaModule.push(regionId);
    //             keys.forEach((key) => {
    //               districts.push({
    //                 id: regionId + '-' + key,
    //                 districts: coverageData[i][key].map(i => {return regionId + '-' + key + '-' + i})
    //               })
    //             })

    //             areaChoiceMid[i] = {
    //               checkedAll: keys.length === getAreas()[regionId].districtIds.length ? true : false,
    //               districts: districts
    //             }
    //           }
    //         }
    //         setAreaChoice(areaChoiceMid);
    //         setAreaModuleChoice(areaModule);
    //       }
    //       setWarehouseData(data);
    //     }
    //   })
    // }
    setInit(false);
  }, [init]);

  useMemo(() => {
    let coverageCityResultIds: string[] = [];
    let coverageCityResultNames: string[] = [];
    for (let i in areaChoice) {
      areaChoice[i].districts.forEach((item) => {
        coverageCityResultIds.push(item.id)
      })
    }
    coverageCityResultIds.forEach((id) => {
      let ids = id.split('-');
      let cityId = ids[1];
      coverageCityResultNames.push(getDistrictName(cityId));
    })
    setCoverageCity(coverageCityResultNames);
  }, [areaChoice])

  const onChange = (type, value) => {
    let dataMid = JSON.parse(JSON.stringify(warehouseData));
    if (type.indexOf('-') > -1) {
      let arr = type.split('-');
      dataMid[arr[0]][arr[1]] = value;
    } else {
      dataMid[type] = value;
    }
    setWarehouseData(dataMid);
  }

  const addressChange = (v, item, type) => {
    let dataMid = JSON.parse(JSON.stringify(warehouseData));
    let id = +v;
    if (type === 'provinceId') {
      dataMid.cityId= undefined;
      dataMid.areaId = undefined;
      setCityData(districtFilter(id));
      setRegionData([]);
      if (districtFilter(id).length === 1) {
        let cityId = +districtFilter(id)[0].id;
        dataMid.cityId= cityId;
        setRegionData(districtFilter(cityId));
      }
    } else if (type === 'cityId') {
      dataMid.areaId = undefined;
      setRegionData(districtFilter(id));
    }
    dataMid[type] = id;
    setWarehouseData(dataMid);
  }

  const filterDistricts = (coverageData, item) => {
    let ids = item.id.split('-');
    let regionId = ids[0];
    let proviceId = ids[1];
    let districts: any[] = [];
    coverageData[regionId] = coverageData[regionId] || {};
    item.districts.forEach((item) => {
      districts.push(item.split('-')[2])
    })
    coverageData[regionId][proviceId] = districts;
    return coverageData;
  }

  const testSubmitData = (data) => {
    let result = true;
    if (!data.name) {
      Message.warning('请输入仓库名称');
      result = false;
    } else if (!data.firstContact) {
      Message.warning('请输入联系人姓名');
      result = false;
    } else if (!data.firstContactTel) {
      Message.warning('请输入联系人电话');
      result = false;
    }
    return result;
  }

  const submit = () => {
    interface CoverageData {
      [propName: number]: any;
    }
    let coverageData: CoverageData = {};
    if (!ifWholecountryChoice) {
      for (let i in areaChoice) {
        if (areaChoice[i].districts.length > 0) {
          areaChoice[i].districts.forEach((item) => {
            coverageData = filterDistricts(coverageData, item);
          })
        }
      }
    }
    let data = {
      typeId: warehouseData.typeId,
      merchantId: warehouseData.merchantId,
      name: warehouseData.name,
      provinceId: warehouseData.provinceId,
      cityId: warehouseData.cityId,
      areaId: warehouseData.areaId,
      address: warehouseData.address,
      firstContact: warehouseData.contact.name,
      firstContactTel: warehouseData.contact.tel,
      secondContact: warehouseData.contact2.name,
      secondContactTel: warehouseData.contact2.tel,
      returnContact: warehouseData.returnGoodscontact.name,
      returnContactTel: warehouseData.returnGoodscontact.tel,
      remark: warehouseData.remark,
      coverage: {
        type: ifWholecountryChoice ? 0 : 1,
        data: coverageData
      },
      characteristics: {
        store: warehouseData.characteristics.store.join(','),
        business: warehouseData.characteristics.business.join(',')
      }
    }
    if (testSubmitData(data)) {
    //   if (detailId) {
    //     editWarehouse({data, id: detailId}).then(({error, result}) => {
    //       if (error) {
    //         Message.error(error.message);
    //       } else {
    //         // location.reload();
    //         window.location.href="/#/warehouse/manage";
    //         console.log(result);
    //       }
    //     })
    //   } else {
    //     createWarehouse({data}).then(({error, result}) => {
    //       if (error) {
    //         Message.error(error.message);
    //       } else {
    //         // location.reload();
    //         window.location.href="/#/warehouse/manage";
    //         console.log(result);
    //       }
    //     })
    //   }
    }
  }

  return (
    <div className="warehouse-detail-wrap">
      <IceContainer>
        <Breadcrumb>
          <Breadcrumb.Item link="/#/warehouse/manage">仓库管理 </Breadcrumb.Item>
          <Breadcrumb.Item>登记新仓库</Breadcrumb.Item>
        </Breadcrumb>
        <Form>
          <h6>基础信息</h6>
          <FormItem label="仓库类型：" labelCol={{ span: 2 }} wrapperCol={{ span: 6 }}>
            <Select value={warehouseData.typeId} placeholder="请选择仓库类型" onChange={(value) => onChange('typeId', value)}>
              {warehouseTypes.map((item, index) => {
                return (
                  <Option value={item.value} key={index.toString()}>{item.label}</Option>
                )
              })}
            </Select>
          </FormItem>
          <FormItem label={warehouseData.typeId === 1 ? '商家：' : '供应商：'} labelCol={{ span: 2 }} wrapperCol={{ span: 6 }}>
            <Select value={warehouseData.merchantId} placeholder="请选择" onChange={(value) => onChange('merchantId', value)}>
              {saleModes.map((item, index) => {
                return (
                  <Option value={item.value} key={index.toString()}>{item.label}</Option>
                )
              })}
            </Select>
          </FormItem>
          <FormItem label={<span className="required"><i style={{color: 'red'}}>*</i>&nbsp;仓库名称：</span>} labelCol={{ span: 2 }} wrapperCol={{ span: 6 }}>
            <Input name="name" value={warehouseData.name} placeholder="请输入仓库名称" onChange={(value) => onChange('name', value)} />
          </FormItem>
          <FormItem className="address-module" label="地址：" labelCol={{ span: 2 }} wrapperCol={{ span: 10 }}>
            <Select placeholder="请选择省份"
              value={warehouseData.provinceId}
              onChange={(value, actionType, item) => addressChange(value, item, 'provinceId')}>
              {provinceData && provinceData.map((province) => {
                return (
                  <Option key={province.id} value={province.id}>{province.name}</Option>
                )
              })}
            </Select>
            {
              cityData && cityData.length > 0 ? (
                <Select placeholder="请选择城市" 
                  value={warehouseData.cityId} 
                  onChange={(value, actionType, item) => addressChange(value, item, 'cityId')}>
                  {cityData && cityData.map((city, i) => {
                    return (
                      <Option key={city.id} value={city.id}>{city.name}</Option>
                    )
                  })}
                </Select>
              ) : ''
            }
            {
              regionData && regionData.length > 0 ? (
                <Select placeholder="请选择城区" 
                  value={warehouseData.areaId} 
                  onChange={(value, actionType, item) => addressChange(value, item, 'areaId')}>
                  {regionData && regionData.map((region, i) => {
                    return (
                      <Option key={region.id} value={region.id}>{region.name}</Option>
                    )
                  })}
                </Select>
              ) : ''
            }
            <Input name="address" value={warehouseData.address} placeholder="请输入详细地址" onChange={(value) => onChange('address', value)} />
          </FormItem>
          <FormItem className="contact" label={<span className="required"><i style={{color: 'red'}}>*</i>&nbsp;联系人：</span>} labelCol={{ span: 2 }} wrapperCol={{ span: 10 }}>
            <Input name="contactName" value={warehouseData.contact.name} placeholder="请输入姓名" onChange={(value) => onChange('contact-name', value)} />
            <Input name="contactTel" value={warehouseData.contact.tel} placeholder="请输入电话" onChange={(value) => onChange('contact-tel', value)} />
          </FormItem>
          <FormItem className="contact" label="联系人2：" labelCol={{ span: 2 }} wrapperCol={{ span: 10 }}>
            <Input name="contact2Name" value={warehouseData.contact2.name} placeholder="请输入姓名" onChange={(value) => onChange('contact2-name', value)} />
            <Input name="contact2Tel" value={warehouseData.contact2.tel} placeholder="请输入电话" onChange={(value) => onChange('contact2-tel', value)} />
          </FormItem>
          <FormItem className="contact" label="退货联系人：" labelCol={{ span: 2 }} wrapperCol={{ span: 10 }}>
            <Input name="returnGoodscontactName" value={warehouseData.returnGoodscontact.name} placeholder="请输入姓名" onChange={(value) => onChange('returnGoodscontact-name', value)} />
            <Input name="returnGoodscontactTel" value={warehouseData.returnGoodscontact.tel} placeholder="请输入电话" onChange={(value) => onChange('returnGoodscontact-tel', value)} />
          </FormItem>
          <FormItem label="备注：" labelCol={{ span: 2 }} wrapperCol={{ span: 16 }}>
            <Input.TextArea placeholder="请输入备注信息" value={warehouseData.remark} name="remark" onChange={(value) => onChange('remark', value)} />
          </FormItem>

          <h6>覆盖范围</h6>
          <div className="coverage-module">
            <Row className="coverage-cities-name">
              <Col span="2"></Col>
              <Col span="20">覆盖范围：{coverageCity && coverageCity.join('，') || '暂无'}</Col>
            </Row>
            <Coverage 
              ifWholecountryChoice={ifWholecountryChoice} 
              setIfWholecountryChoice={setIfWholecountryChoice} 
              areaModuleChoice={areaModuleChoice} 
              setAreaModuleChoice={setAreaModuleChoice} 
              wholecountry={wholecountry} 
              setWholecountry={setWholecountry} 
              areaChoice={areaChoice} 
              setAreaChoice={setAreaChoice} />
          </div>

          <h6>仓库特征</h6>
          <FormItem label="存储特性：" labelCol={{ span: 2 }} wrapperCol={{ span: 10 }}>
            <CheckboxGroup value={warehouseData.characteristics.store} dataSource={storageCharacteristics} onChange={(value) => onChange('characteristics-store', value)} />
          </FormItem>
          <FormItem label="业务特性：" labelCol={{ span: 2 }} wrapperCol={{ span: 10 }}>
            <CheckboxGroup value={warehouseData.characteristics.business} dataSource={businessCharacteristics} onChange={(value) => onChange('characteristics-business', value)} />
          </FormItem>
          <FormItem label="">
            <Button type="primary" htmlType="submit" onClick={() => submit()}>保存</Button>
          </FormItem>
        </Form>
      </IceContainer>
    </div>
  )
}