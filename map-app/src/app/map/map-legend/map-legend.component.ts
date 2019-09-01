import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-map-legend',
  templateUrl: './map-legend.component.html',
  styleUrls: ['./map-legend.component.css']
})
export class MapLegendComponent implements OnInit {
  @Input() colors: string[];
  @Input() labels: string[];


  constructor() { }

  ngOnInit() {
  }

}
