import React, { useState, useEffect, useMemo } from 'react';
import {
	Checkbox,
	Form,
	Icon,
	Overlay
} from '@alifd/next';
import { districtFilter, getAreas } from '../../../lib/addr';

const { Group: CheckboxGroup } = Checkbox;
const FormItem = Form.Item;
const { Popup } = Overlay;

export default (props) => {
	let initChoice = {
		0: undefined,
		1: undefined,
		2: undefined,
		3: undefined,
		4: undefined,
		5: undefined,
		6: undefined
	};
	const [init, setInit] = useState(true);
	const [allCitiesLen, setAllCitiesLen] = useState(0);
	const [allChoiceData, setAllChoiceData] = useState(initChoice);
	const [areasData, setAreasData] = useState(getAreas());
	const [showId, setShowId] = useState();
	const [previousProvinces, setPreviousProvinces] = useState({
		0: undefined,
		1: undefined,
		2: undefined,
		3: undefined,
		4: undefined,
		5: undefined,
		6: undefined
	});
	const [previousCities, setPreviousCities] = useState();
	const { areaChoice, setAreaChoice, wholecountry, setWholecountry, areaModuleChoice, setAreaModuleChoice, ifWholecountryChoice, setIfWholecountryChoice } = props;

	useEffect(() => {
		setInit(false);
		let len = 0;
		let areas = getAreas();
		const gerItems = (item) => {
			let len1 = 0;
			item.forEach((i) => {
				len1 = len1 + districtFilter(+i.id).length;
			}) 
			return len1;
		}
		areas.forEach((item) => {
			len = len + gerItems(item.districtIds);
		})
		setAllCitiesLen(len);
	}, [init]);

	useMemo(() => {
		let allChoiceDataMid = allChoiceData && JSON.parse(JSON.stringify(allChoiceData));
		let arr = [0, 1, 2, 3, 4, 5, 6];
		if (allChoiceDataMid) {
			if (wholecountry) {
				setAreaModuleChoice(arr);
				arr.forEach((item) => {
					allChoiceDataMid[item] = {}
					let result: any[] = [];
					getAreas()[item] && getAreas()[item].districtIds.forEach((area) => {
						allChoiceDataMid[item][item + '-' + area.id] = districtFilter(area.id).map(i => {return item + '-' + area.id + '-' + i.id});
					})
				})
			} else {
				setAreaModuleChoice([]);
				arr.forEach((item) => {
					allChoiceDataMid[item] = undefined;
				})
			}
			setAllChoiceData(allChoiceDataMid);
			setIfWholecountryChoice(wholecountry);
		}
	}, [wholecountry])

	useMemo(() => {
		let areaModuleChoiceMid: any[] = [];
		for (let i in allChoiceData) {
			if (allChoiceData[i]) {
				areaModuleChoiceMid.push(+i)
			}
		}
		setAreaModuleChoice(areaModuleChoiceMid);
	}, [allChoiceData])


	const getlen = (allChoiceDataMid, key) => {
		let len = 0;
		let keys = allChoiceDataMid[key] && Object.keys(allChoiceDataMid[key]) || [];
		keys.length > 0 && keys.forEach((k) => {
			len = len + allChoiceDataMid[key][k].length;
		})
		return len;
	}

	const testIfWholecountryChoice = (allChoiceDataMid) => {
		let keys = [0,1,2,3,4,5,6];
		let len = 0;
		keys.forEach((key) => {
			len = len + getlen(allChoiceDataMid, key);
		})
		setIfWholecountryChoice(allCitiesLen === len);
	}

	const getAllCities = (regionId, provinceId) => {
		let cities = districtFilter(provinceId);
		let result: any[] = [];
		cities.forEach((city) => {
			result.push(regionId + '-' + provinceId + '-' + city.id);
		})
		return result;
	}

	const areaChange = (value, index, type, id?) => {
		let allChoiceDataMid = {
			0: allChoiceData[0] || undefined,
			1: allChoiceData[1] || undefined,
			2: allChoiceData[2] || undefined,
			3: allChoiceData[3] || undefined,
			4: allChoiceData[4] || undefined,
			5: allChoiceData[5] || undefined,
			6: allChoiceData[6] || undefined
		}
		if (type === 1) {
			let keys = areaModuleChoice || [];
			let mid = {
				0: undefined,
				1: undefined,
				2: undefined,
				3: undefined,
				4: undefined,
				5: undefined,
				6: undefined,
			};
			if (value.length > 0) {
				if (keys.length > value.length) {
					value.forEach((v) => {
						mid[v] = allChoiceDataMid[v];
					})
					allChoiceDataMid = mid;
				} else {
					value.forEach((v) => {
						if (keys.indexOf(v) < 0) {
							allChoiceDataMid[v] = {};
							areasData[v].districtIds.forEach((district) => {
								allChoiceDataMid[v][v + '-' + district.id] = getAllCities(v, district.id);
							})
						}
					})
				}
			} else {
				allChoiceDataMid = initChoice;
			}
			
			
		} else if (type === 2) {
			// index === regionId
			let keys = allChoiceDataMid[index] && Object.keys(allChoiceDataMid[index]) || [];
			if (value.length > 0) {
				allChoiceDataMid[index] = allChoiceDataMid[index] ? allChoiceDataMid[index] : {};
				let mid = {};
				if (keys.length > value.length) {
					value.forEach((v) => {
						mid[v] = allChoiceDataMid[index][v];
					})
					allChoiceDataMid[index] = mid;
				} else {
					value.forEach((v) => {
						if (keys.indexOf(v) < 0) {
							allChoiceDataMid[index][v] = getAllCities(index, +v.split('-')[1]);
						}
					})
				}
			} else {
				allChoiceDataMid[index] = undefined;
			}		
		} else {
			// index === regionId
			// id === proviceId
			if (value.length > 0) {
				if (allChoiceDataMid[index]) {
					allChoiceDataMid[index][index + '-' + id] = value;
				} else {
					allChoiceDataMid[index] = {};
					allChoiceDataMid[index][index + '-' + id] = value;
				}
			} else {
				if (allChoiceDataMid[index]) {
					allChoiceDataMid[index][index + '-' + id] = [];
				} else {
					allChoiceDataMid[index] = {};
					allChoiceDataMid[index][index + '-' + id] = [];
				}
			}
		}
		setAllChoiceData(allChoiceDataMid);

		testIfWholecountryChoice(allChoiceDataMid);
	}

	const showCities = (id) => {
		if (showId === id) {
			setShowId('');
		} else {
			setShowId(id);
		}
	}

	return (
		<div className="coverage-wrap">
			<FormItem label=" " labelCol={{ span: 2 }} className="whole-country">
				<Checkbox checked={ifWholecountryChoice} onChange={() => setWholecountry(!wholecountry)}>全国</Checkbox>
			</FormItem>
			<FormItem label=" " labelCol={{ span: 2 }}>
				<CheckboxGroup value={areaModuleChoice} onChange={(value) => areaChange(value, 0, 1)}>
					{areasData && areasData.map((area, regionId) => {
						let keys: any[] = allChoiceData[regionId] && Object.keys(allChoiceData[regionId]) || [];
						let choiceDistricts: any[] = [];
						keys.map((key) => {
							if (allChoiceData[regionId][key].length > 0) choiceDistricts.push(key);
						})
						return (
							<div key={regionId.toString()} className="area-module">
								{/* 区域 btn */}
								<Checkbox key={regionId.toString()} value={regionId}>{area.name}</Checkbox>
								{/* 区域模块 */}
								<CheckboxGroup value={choiceDistricts} onChange={(value) => areaChange(value, regionId, 2)}>
									{area.districtIds.map((item, i) => {
										let choiceAreas: any = allChoiceData && allChoiceData[regionId] && allChoiceData[regionId][regionId + '-' + item.id] || [];
										return (
											<Popup trigger={
												<span>
													{/* 省直辖市 */}
													<Checkbox key={item.id} value={regionId + '-' + item.id}>{item.name}</Checkbox>
													<Icon size="xs" type={showId && item.id === showId ? 'arrow-up' : 'arrow-down'} onClick={() => showCities(item.id)} />
												</span>
											}
												triggerType="click"
												visible={item.id === showId}
												onVisibleChange={() => showCities(item.id)}
												key={i.toString()}
												className="province-module">
												<div>
													{item.id === showId ? (
														/* 市模块 */
														<CheckboxGroup value={choiceAreas} className="floating-layer" onChange={(value) => areaChange(value, regionId, 3, item.id)}>
															{districtFilter(item.id).map((district) => {
																return (
																	<Checkbox key={district.id} value={regionId + '-' + item.id + '-' + district.id}>{district.name}</Checkbox>
																)
															})}
														</CheckboxGroup>
													) : ''}
												</div>
											</Popup>
										)
									})}
								</CheckboxGroup>
							</div>
						)
					})}
				</CheckboxGroup>
			</FormItem>
		</div>
	)
}