import Taro, { Component } from '@tarojs/taro'
import { View, Image, Swiper, SwiperItem, Button} from '@tarojs/components'
import './index.scss'

export default class Images extends Component {
  constructor() {
    this.config = {
      navigationBarTitleText: '无二之旅',
      disableScroll: true
    }
    this.state = {
      imageWidth: '', // 根据屏幕宽度计算出来的图片宽度
      areaHeight: '', // 整个图片区域的高度
      pointsArr: '', // 所有图片的坐标
      currentImg: '', // 当前url的图片地址
      currentIndex: '', // 当前选择的图片的排序
      scrollTop: '', // 可拖拽区域到顶部的高度
      hidden: true, // 是否隐藏 拖拽小方块
      flag: false, // 是否长按
      x: '', // 拖拽小方块x轴坐标
      y: '', // 拖拽小方块Y轴坐标
      imageList: [
        {
          sort: 1,
          id: 1,
          url: 'https://images.cdn.uniqueway.com/uploads/2017/10/04c22a88-dbe1-4096-83cc-f4b1ed90c7fd.png',
        },
        {
          sort: 2,
          id: 2,
          url: 'https://www.uniqueway.com/assets/img/banner/new_step2.png',
        },
        {
          sort: 3,
          id: 3,
          url: 'https://images.cdn.uniqueway.com/uploads/2017/10/04c22a88-dbe1-4096-83cc-f4b1ed90c7fd.png',
        },
        {
          sort: 4,
          id: 4,
          url: 'https://images.cdn.uniqueway.com/uploads/2017/10/04c22a88-dbe1-4096-83cc-f4b1ed90c7fd.png',
        },
        {
          sort: 5,
          id: 5,
          url: 'https://images.cdn.uniqueway.com/uploads/2017/10/04c22a88-dbe1-4096-83cc-f4b1ed90c7fd.png',
        },
        {
          sort: 6,
          id: 6,
          url: 'https://images.cdn.uniqueway.com/uploads/2017/10/04c22a88-dbe1-4096-83cc-f4b1ed90c7fd.png',
        },
        {
          sort: 7,
          id: 7,
          url: 'https://images.cdn.uniqueway.com/uploads/2017/10/04c22a88-dbe1-4096-83cc-f4b1ed90c7fd.png',
        },
        // {
        //   sort: 8,
        //   id: 8,
        //   url: 'https://images.cdn.uniqueway.com/uploads/2017/10/04c22a88-dbe1-4096-83cc-f4b1ed90c7fd.png',
        // },
        // {
        //   sort:9,
        //   id: 9,
        //   url: 'https://images.cdn.uniqueway.com/uploads/2017/10/04c22a88-dbe1-4096-83cc-f4b1ed90c7fd.png',
        // },
        // {
        //   sort: 10,
        //   id: 10,
        //   url: 'https://images.cdn.uniqueway.com/uploads/2017/10/04c22a88-dbe1-4096-83cc-f4b1ed90c7fd.png',
        // }
      ]
    }
  }
  componentDidMount () {
    this.handleComputedImage()
    setTimeout(() =>{
      this.handleComputedArea()
    }, 1000)
  }

  handleComputedImage (e) {
    const systemInfo = Taro.getSystemInfoSync()
    const windowWidth = systemInfo.screenWidth;

    const width = windowWidth - 16;
    const imageWidth = (width - 16) / 4;
    this.setState({
      imageWidth
    })
 }

  handleComputedArea (){
    Taro.createSelectorQuery().selectAll('.img-list').boundingClientRect( rect => {
      this.setState({
        areaHeight: rect[0].height
      })
    }).exec()
  }
  onLongPress (img, e) {
    this.handleComputedPoints()
    this.setState({
      currentImg: e.currentTarget.dataset.eLongpressAA.url,
      currentIndex: e.currentTarget.dataset.eLongpressAA.sort,
      hidden: false,
      flag: true,
      x: e.currentTarget.offsetLeft,
      y: e.currentTarget.offsetTop
    })
  }
  // 计算每张图片的坐标
  handleComputedPoints(e){
    var query = Taro.createSelectorQuery();
    var nodesRef = query.selectAll('.img-item');
    nodesRef.fields({
      dataset: true,
      rect: true
    }, (result) => {
      this.setState({
        pointsArr: result
      })
    }).exec()
  }
  handleTouchMove (e){
    let x = e.touches[0].pageX;
    let y = e.touches[0].pageY;
    Taro.createSelectorQuery().selectAll('.img-list').boundingClientRect(rect => {
      let top = rect[0].top;
      y = y - this.state.scrollTop - top
      this.setState({
        x: x - this.state.imageWidth / 2 > 0 ? x - this.state.imageWidth / 2:0,
        y: y - this.state.imageWidth / 2 > 0 ? y - this.state.imageWidth / 2:0,
      })

    }).exec()
  }
  onPageScroll (e){
    this.setState({
      scrollTop: e.scrollTop
    })
  }
  // 拖动结束
  handleTouchEnd (e){
    if (!this.state.flag) {
      console.log('f非拖动结束')
      return;
    }
    let x = e.changedTouches[0].pageX
    let y = e.changedTouches[0].pageY - this.state.scrollTop
    // 每张图片的地址
    const pointsArr = this.state.pointsArr
    let data = this.state.imageList

      for (var j = 0; j < pointsArr.length; j++) {
        const item = pointsArr[j];
          
        if (x > item.left && x < item.right && y > item.top && y < item.bottom) {
          const endIndex = item.dataset.eLongpressAA.sort;
          const beginIndex = this.state.currentIndex;
          console.log(endIndex, beginIndex)
          console.log('点击的图片', data[beginIndex -1])
          let temp = data[beginIndex - 1];
          // 更新sort排序
          temp.sort = endIndex
  
  
          let temp2 = data[endIndex - 1]
          temp2.sort = beginIndex
  
          console.log('替换的两个', temp, temp2)
  
          console.log('替换的图片', data[endIndex - 1])
          data[beginIndex - 1] = temp2;
          data[endIndex - 1] = temp
          // //将被移动目标的下标值替换为beginIndex
          // temp2 = temp;
        }
      }
    console.log(data, pointsArr)
    this.setState({
      images: data,
      hidden: true,
      flag: false,
      currentImg: ''
    })
  }
  render () {
    return (
      <View className='index'>
         <MovableArea
          style={`min-height: ${this.state.imageWidth}px; height:${this.state.areaHeight}px;width: 100%;border: 1px solid grey`}
          onTouchMove={this.handleTouchMove.bind(this)}
          onTouchEnd={this.handleTouchEnd.bind(this)}
        >
           <View className="img-list">
             {
                this.state.imageList.map((img, imgIndex) => {
                  return <View className="img-item"
                            key={img.id}
                            style={`width:${this.state.imageWidth}px;height:${this.state.imageWidth}px`}
                            onLongPress={this.onLongPress.bind(this, img)}
                          >
                      <Image className="image-item_pic" src={img.url} mode="aspectFit" style={`width:${this.state.imageWidth}px`}/>
                <view class="close">删除{img.id}</view>
                  </View>
                })
             }
            <view class="add-button" style={`height: ${this.state.imageWidth}px; width: ${this.state.imageWidth}px; background: #ffffff;`}>+</view>

            {
              this.state.imageList.length%3==1 && <View style={`width:${this.state.imageWidth}px`} className="img-item-block"></View>
            }
           </View>
           {
             !this.state.hidden &&
             <MovableView
                className="movable-view"
                style={`height: ${this.state.imageWidth}px; width: ${this.state.imageWidth}px;`}
                x={this.state.x}
                y={this.state.y}
                direction="all"
                damping="5000"
                friction="1"
                onHTouchMove={this.handleTouchMove.bind(this)}
              >
              <Image className="image-item_move-pic" src={currentImg}/>
            </MovableView>
           }
        </MovableArea>
      </View>
    )
  }
}
