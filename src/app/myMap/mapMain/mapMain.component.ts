import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { EmitService } from '../../unit/emit.service';
import { ConvexHullService } from '../../unit/convex_hull.service';
// import * as $ from "jquery";
import { GoogleMap } from '@angular/google-maps';

@Component({
  selector: 'map-main',
  templateUrl: './mapMain.component.html',
  styleUrls: ['./mapMain.component.scss']
})
export class MapMainComponent implements OnInit {
  @ViewChild(GoogleMap, { static: false }) googlemap!: GoogleMap;
  map: any = {};
  markers: any = [];
  polygon: any = {
    paths: [],
    options: {
      fillColor: '',
      strokeColor: ''
    }
  };
  // 控制polygon颜色填充按钮显示 右键绘制polygon后显示
  fillPolygonColor: boolean = false;
  // 地图上已有polygon 避免重复绘制
  hasGPolygon: boolean = true;

  constructor(private emitService: EmitService, private convexHullService: ConvexHullService) {
    // 接收发射过来的数据
    this.emitService.eventEmit.subscribe((value: any) => {
      // 点击右侧按钮添加markers
      if (value.title === 'addMarkers') {
        this.markers.length = 0;
        this.polygon.paths = [];
        value.data.forEach((point: any) => {
          this.addMarker(point)
        });
        this.map.zoom = 7;
        this.hasGPolygon = false;
        this.fillPolygonColor = false;
      } 
      // 点击右侧list 
      else if (value.title === 'selectMarker') {
        this.map = {
          center: value.data.position,
          id: value.data.id,
          zoom: 12
        }
      } 
      // sph文件上传解析完成后渲染map 设置center为第一个点
      else if (value.title === 'geojson'){
        this.googlemap.data.addGeoJson(value.data);
        console.log("解析完成");
        let loc = value.data.features[0].geometry.coordinates[0][0][0];
        this.map = {
          center: {
            lat: loc[1],
            lng: loc[0]
          },
          zoom: 4
        }
      }
    });
  }

  ngOnInit() {
    this.initMap();
  }
  /**
   * 初始定位 成都
   */
  initMap() {
    let chengdu = {
      id: 0,
      position: {
        lat: 30.578803999380842, lng: 104.0729150226984
      }
    };
    this.map = {
      center: chengdu.position,
      id: chengdu.id,
      zoom: 12
    }
    this.markers.length = 0;
    this.addMarker(chengdu);
  }
  /**
   * map上添加marker
   * @param point 
   */
  addMarker(point: any) {
    this.markers.push({
      position: point.position,
      id: point.id,
      options: { animation: google.maps.Animation.BOUNCE },
    })
  }
  /**
   * 查看地图点击点的经纬度
   * @param e 
   */
  mapclick(e: any) {
    console.log(e.latLng.lat(), e.latLng.lng())
  }
  ngAfterViewInit() {
    // 监听鼠标右键
    let mp = document.getElementById("googleMap");
    if (mp) {
      mp.addEventListener('mousedown', (event: any) => {
        event.preventDefault();
        if (event.button === 2) {
          if (this.hasGPolygon) {
            return
          }
          this.polygon = {
            paths: [],
            options: {
              fillColor: 'rgba(34, 34, 34, .8)',
              strokeColor: 'rgb(34, 34, 34)'
            }
          };
          let arr: any = [];
          let hullPoints: any = [];
          this.markers.forEach((el: any) => {
            arr.push(el.position);
          });
          this.convexHullService.chainHull_2D(arr, arr.length, hullPoints);
          this.polygon.paths = hullPoints;
          this.map = {
            center: hullPoints[0],
            zoom: 6
          }
          this.hasGPolygon = true;
          this.fillPolygonColor = true;
          // 清除所有marker及列表中的记录
          this.markers.length = 0;
          this.emitService.eventEmit.emit({ title: 'clearMarkers' });
        }
      }, false)
    }
  }
  /**
   * 填充 polygon color
   * @param e <mouseEvent>
   */
  fillPolygon(e: any) {
    e.stopPropagation();
    this.polygon.options = { fillColor: "#007bff",strokeColor: '#007bff' }
  }

}
