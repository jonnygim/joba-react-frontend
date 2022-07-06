import { useEffect, useRef } from 'react'
import * as am5 from '@amcharts/amcharts5'
import PropTypes from 'prop-types'
import am5themesAnimated from '@amcharts/amcharts5/themes/Animated'
import * as am5hierarchy from '@amcharts/amcharts5/hierarchy'

const Bubble = ({ data }) => {
  console.log(data)
  const axisDataItemRef = useRef(null)

  

  useEffect(() => {
    const root = am5.Root.new('bubble')
    root.setThemes([
      am5themesAnimated.new(root),
    ])

// Create wrapper container
    const container = root.container.children.push(am5.Container.new(root, {
      width: am5.percent(100),
      height: am5.percent(100),
      layout: root.verticalLayout,
    }))

// Create series
// https://www.amcharts.com/docs/v5/charts/hierarchy/#Adding
    const series = container.children.push(am5hierarchy.ForceDirected.new(root, {
      singleBranchOnly: false,
      downDepth: 2,
      topDepth: 1,
      initialDepth: 1,
      maxRadius: 80,
      minRadius: 30,
      valueField: "value",
      categoryField: "name",
      childDataField: "children",
      manyBodyStrength: -9,
      centerStrength: 0.7
    }))
    axisDataItemRef.current = series

    series.get("colors").setAll({
      step: 3
    });

    series.links.template.setAll({
      strokeWidth: 2
    });
 


    series.data.setAll([data])
    series.set('selectedDataItem', series.dataItems[0])
    // series.labels.template.events.once('hit', ev => {
    //   console.log('clicked on ', ev.target)
    // }, this)s

    let selectedDataItem;

      // 노드 클릭 시 이벤트 발생 
    series.nodes.template.events.on("click", function(e) {
      // 이미 선택된 노드가 있는지 확인
      if (selectedDataItem) {
        let targetDataItem = e.target.dataItem;
        // 선택된 노드가 있고, 동일한 것이면 선택 해제 
        if (e.target.dataItem == selectedDataItem) {
          selectedDataItem.get("outerCircle").setPrivate("visible", false);
          selectedDataItem = undefined;
        }
        // 선택된 노드가 있고, 다른 것일 때 그 노드로 변경
        else {
          selectedDataItem.get("outerCircle").setPrivate("visible", false);
          selectedDataItem = e.target.dataItem;
        selectedDataItem.get("outerCircle").setPrivate("visible", true)
          //이미 연결되어 있으면 연결 해제
        }
      }
      // 선택된 노드가 없으면 선택
      else {
        selectedDataItem = e.target.dataItem;
        selectedDataItem.get("outerCircle").setPrivate("visible", true)
      }
    })


    return () => root.dispose()

// Generate and set data
// https://www.amcharts.com/docs/v5/charts/hierarchy/#Setting_data
//     const maxLevels = 2
//     const maxNodes = 5
//     const maxValue = 100
  }, [])

  useEffect(() => {
    const series = axisDataItemRef.current
    series.data.setAll([data])
    series.set('selectedDataItem', series.dataItems[data.length])
    series.labels.template.setAll({
      fontSize: 20,
      fill: am5.color(0x550000),
      text: '{category}',
    })

  }, [data])




  return (
    <div
      id="bubble"
      style={{
        height: '500px',
        flexGrow: 1,
        backgroundColor: 'white',
      }}
    />
  )
}

Bubble.propTypes = {
  data: PropTypes.object,
}
Bubble.defaultProps = {
  data: [],
}

export default Bubble
