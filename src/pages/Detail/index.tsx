import React, { useState, useEffect, useMemo } from 'react';
import IceContainer from '@icedesign/container';
import {
  Form, 
  Grid
} from '@alifd/next';

import './index.scss';
import Coverage from './coverage'
import { getDistrictName} from '../../lib/addr';

const { Row, Col } = Grid;

export default () => {
  const [init, setInit] = useState(true);

  const [areaChoice, setAreaChoice] = useState();
  const [coverageCity, setCoverageCity] = useState();
  const [wholecountry, setWholecountry] = useState(false);
  const [ifWholecountryChoice, setIfWholecountryChoice] = useState(false);
  const [areaModuleChoice, setAreaModuleChoice] = useState();

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

  return (
    <div className="warehouse-detail-wrap">
      <IceContainer>
        <Form>
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
        </Form>
      </IceContainer>
    </div>
  )
}