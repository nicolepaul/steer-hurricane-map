import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { environment } from './../../environments/environment';
import * as mapboxgl from 'mapbox-gl';
import { FormControl } from '@angular/forms';
import * as Highcharts from 'highcharts';
import theme from 'highcharts/themes/dark-unica';
theme(Highcharts);

@Component({
  selector: 'app-map',
  queries: {
    contentRef: new ViewChild('contentRef')
  },
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit {
  public contentRef!: ElementRef;
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    series: [{
      data: [1, 2, 3],
      type: 'column'
    }],
    chart: {
      style: {
        fontFamily: 'Helvetica '
      }
    }
  };
  updateFlag = true;
  map: mapboxgl.Map;
  style = 'mapbox://styles/nicolepaul/ck01bpvb038vp1cptlb7449yl';
  lat = 25.774210; // Miami
  lng = -80.172568; // Miami
  layers: any;
  currentSceneIndex = 0;
  scenes = [
    // 1. HURRICANES IN CARIBBEAN INTRO SCENE
    {
      title: 'Title goes here',
      info: `Detailed description goes here`,
      attribution: [{
        link: 'https://www.google.com',
        label: `attribution goes here`
      }],
      visibleLayer: ['indianriver-parcel'],
      zoom: 4.5,
      center: { lon: -80.172568, lat: 25.774210 },
      legend: {
        exists: false,
        // colors: ['#666666', '#3cb371', '#ffd700', '#ff8c00', '#dc143c'],
        // labels: ['Unknown damage', 'Negligible to slight damage', 'Moderately damaged', 'Highly damaged', 'Completely destroyed']
      }
    },
  ];
  nextDisabled = true;
  prevDisabled = true;

  toggleableLayerIds = new FormControl();
  toggleableLayerIdsList = [
    {
      id: 'indianriver-parcel',
      displayName: 'Indian River',
      checked: false
    }];

  constructor() { }

  ngOnInit() {
    (mapboxgl as typeof mapboxgl).accessToken = environment.mapbox.accessToken;

    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 4.5,
      // minZoom: 4,
      center: [this.lng, this.lat]
    });

    this.map.on('load', () => {
      this.toggleableLayerIdsList.forEach((layer) => {
        this.map.setLayoutProperty(layer.id, 'visibility', 'none');
      });
    });

    // this.map.on('click', 'dominica-damage-buildings', (e) => {
    //   new mapboxgl.Popup()
    //     .setLngLat(e.lngLat)
    //     .setHTML(e.features[0].properties.agency_id)
    //     .addTo(this.map);
    // });
  }

  toggleLayer(layer: any) {
    if (this.map.getLayoutProperty(layer, 'visibility') === 'visible') {
      this.map.setLayoutProperty(layer, 'visibility', 'none');
    } else {
      this.map.setLayoutProperty(layer, 'visibility', 'visible');
    }
  }


  changeScene(direction: any) {
    this.updateFlag = false;
    if (direction === 'next') {
      this.prevDisabled = false;
      if (this.currentSceneIndex < this.scenes.length - 1) {
        this.currentSceneIndex += 1;
        setTimeout(() => this.updateFlag = true, 1);
        this.setCurrentLayer();
        this.setZoomExtent();
        if (this.currentSceneIndex === this.scenes.length - 1) {
          this.nextDisabled = true;
        } else {
          this.nextDisabled = false;
        }
      }
    } else {
      if (this.currentSceneIndex !== 0) {
        this.nextDisabled = false;
        this.currentSceneIndex -= 1;
        setTimeout(() => this.updateFlag = true, 1);
        this.setCurrentLayer();
        this.setZoomExtent();
        if (this.currentSceneIndex > 0) {
          this.prevDisabled = false;
        } else if (this.currentSceneIndex === 0) {
          this.prevDisabled = true;
        }
      }
    }
    this.updateFlag = false;
    this.scrollCardContentToTop();
  }

  setCurrentLayer() {
    this.toggleableLayerIdsList.forEach((layer) => {
      this.map.setLayoutProperty(layer.id, 'visibility', 'none');
    });

    this.scenes[this.currentSceneIndex].visibleLayer.forEach((layer) => {
      this.toggleLayer(layer);
      this.setZoomExtent();
    });
  }

  setZoomExtent() {
    this.map.setCenter(this.scenes[this.currentSceneIndex].center);
    this.map.zoomTo(this.scenes[this.currentSceneIndex].zoom);
  }

  displayScene(type: any) {
    return this.scenes[this.currentSceneIndex][type];
  }

  private scrollCardContentToTop(): void {
    this.contentRef.nativeElement.scrollTo(0, 0);
  }

}
