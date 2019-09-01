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
      visibleLayer: ['indianriver-parcel', 'martin-parcel', 'stlucie-parcel', 'volusia-parcel', 'brevard-parcel'],
      zoom: 6,
      center: { lon: -80.172568, lat: 25.774210 },
      legend: {
        exists: true,
        colors: ['#9e0142', '#9e070c', '#9f410e', '#9f7a14', '#909f1b', '#60a021', '#36a028', '#2ea04c', '#35a17b', '#3b9ea1', '#427aa1', '#485aa2', '#666666'],
        labels: ['1900-1909', '1910-1919', '1920-1929', '1930-1939', '1940-1949', '1950-1959', '1960-1969', '1970-1979', '1980-1989', '1990-1999', '2000-2009', '2010-2019', 'Unknown year built']
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
    },
    {
      id: 'martin-parcel',
      displayName: 'Martin',
      checked: false
    },
    {
      id: 'volusia-parcel',
      displayName: 'Volusia',
      checked: false
    },
    {
      id: 'brevard-parcel',
      displayName: 'Brevard',
      checked: false
    },
    {
      id: 'stlucie-parcel',
      displayName: 'St Lucie',
      checked: false
    }];

  constructor() { }

  ngOnInit() {
    (mapboxgl as typeof mapboxgl).accessToken = environment.mapbox.accessToken;

    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 6,
      center: [this.lng, this.lat]
    });


    this.map.on('load', () => {
      this.map.addLayer({
        'id': 'wms-test-layer',
        'type': 'raster',
        'source': {
          'type': 'raster',
          'tiles': [
            'https://nowcoast.noaa.gov/arcgis/services/nowcoast/radar_meteo_imagery_nexrad_time/MapServer/WmsServer?bbox={bbox-epsg-3857}&service=WMS&request=GetMap&version=1.3.0&layers=1&styles=&format=image/png&transparent=true&height=256&width=256&crs=EPSG:3857'
          ],
          'tileSize': 256
        },
        'paint': {}
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
        // this.setCurrentLayer();
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
        // this.setCurrentLayer();
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

  // setCurrentLayer() {
  //   this.toggleableLayerIdsList.forEach((layer) => {
  //     this.map.setLayoutProperty(layer.id, 'visibility', 'none');
  //   });
  //
  //   this.scenes[this.currentSceneIndex].visibleLayer.forEach((layer) => {
  //     this.toggleLayer(layer);
  //     this.setZoomExtent();
  //   });
  // }

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
