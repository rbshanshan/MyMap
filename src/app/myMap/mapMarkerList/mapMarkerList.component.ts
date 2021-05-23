import { Component, OnInit } from '@angular/core';
import { EmitService } from '../../unit/emit.service';
import * as shp from '../../../assets/shp';

@Component({
  selector: 'map-marker-list',
  templateUrl: './mapMarkerList.component.html',
  styleUrls: ['./mapMarkerList.component.scss']
})
export class MapMarkerListComponent implements OnInit {
  markerList: Array<any> = []; // marker列表
  currentMarker: any = { id: 0 }; // 当前选择的list-marker
  loading: boolean = false; // 生成markers时显示
  fileName: string = ''; // 上传文件name
  isParsingFile: boolean = false; //正在解析文件

  constructor(private emitService: EmitService) {
    this.emitService.eventEmit.subscribe((value: any) => {
      // 点击填充polygon颜色按钮后需清空列表markers
      if (value.title === 'clearMarkers') {
        this.markerList.length = 0;
      }
    })
  }

  ngOnInit() {
    // 列表初始数据（成都）
    this.markerList = [
      {
        id: 0,
        position: {
          lat: 30.578803999380842,
          lng: 104.0729150226984
        }
      }
    ]
  }
  /**
   * 随机生成5000个marker
  */
  addMarker() {
    // this.loading = true;
    this.markerList = [];
    for (let i = 0; i < 100; i++) {
      let latNum = this.GetRandomNum(28, 32) + Math.random();
      let lngNum = this.GetRandomNum(101, 106) + Math.random();
      // if(i % 2 !== 0){
      //   latNum = -latNum;
      // }
      this.markerList.push({
        id: i + 1,
        position: {
          lat: latNum,
          lng: lngNum
        }
      });
    }
    // console.log('dd',this.markerList)
    // 发射数据至map
    // this.markerList[3]={ 
    //   id: 3,
    //   position: {
    //     lat: 30.678803999380852, lng:104.0729150226984 
    //   },
    //   options: { animation: google.maps.Animation.BOUNCE },
    // }
    this.emitService.eventEmit.emit({ title: 'addMarkers', data: this.markerList });
  }
  GetRandomNum(Min: number, Max: number) {
    var Range = Max - Min;
    var Rand = Math.random();
    return (Min + Math.round(Rand * Range));
  }
  /**
   * list中选择marker回调
   * @param marker 
   */
  selectMarker(marker: any) {
    if (this.currentMarker.id === marker.id) {
      return
    }
    console.log('ssu')
    this.currentMarker = marker;
    // 发射数据至map
    this.emitService.eventEmit.emit({ title: 'selectMarker', data: marker });
  }
  /**
   * 文件选择
   */
  fileSelect() {
    // 获取上传的文件
    let fileDom = (<HTMLInputElement>document.getElementById('shpFile'));
    let file = new Blob();
    let that = this;
    if (fileDom.files && fileDom.files[0]) {
      file = fileDom.files[0];
      that.fileName = fileDom.files[0].name;
      let reader = new FileReader();
      // 将文件以二进制形式读入
      reader.readAsArrayBuffer(file);
      reader.onload = function () {
        console.log("加载完成");
        that.isParsingFile = true;
        // 读取到的文件的二进制数据
        var fileData = this.result;
        shp(fileData).then((geojson: any) => {
          // 解析完成回调 发射解析数据至map
          that.emitService.eventEmit.emit({ title: 'geojson', data: geojson });
          that.isParsingFile = false;
        });
      }
    }

  }
}
