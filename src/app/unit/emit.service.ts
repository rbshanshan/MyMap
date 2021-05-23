import { Injectable, EventEmitter } from '@angular/core';
 
@Injectable()
export class EmitService {
  public eventEmit: any;
 
  constructor() {
    // 定义发射事件
    this.eventEmit = new EventEmitter();
  }
}