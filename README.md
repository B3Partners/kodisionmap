kodisionmap
===========

Map used and controlled by a Kodision created form


Hoe te gebruiken
----------
1. Download en extract de zipfile.
2. Neem de volgende scripts/csscode/css files op in de html pagina (nb. Css code zal later niet meer nodig zijn)
```html
    <link rel="stylesheet" href="ol3/ol.css" type="text/css">
    <style>
      #map {
        height: 80%;
        width: 80%;
      }
      /**
       * The zoomslider in the second map shall be placed between the zoom-in and
       * zoom-out buttons.
       */
      #map .ol-zoom .ol-zoom-out {
        margin-top: 204px;
      }
      #map .ol-zoomslider {
        background-color: transparent;
        top: 2.3em;
      }

      #map .ol-touch .ol-zoom .ol-zoom-out { 
        margin-top: 212px;
      }
      #map .ol-touch .ol-zoomslider {
        top: 2.75em;
      }

      #map .ol-zoom-in.ol-has-tooltip:hover [role=tooltip],
      #map .ol-zoom-in.ol-has-tooltip:focus [role=tooltip] {
        top: 3px;
      }

      #map .ol-zoom-out.ol-has-tooltip:hover [role=tooltip],
      #map .ol-zoom-out.ol-has-tooltip:focus [role=tooltip] {
        top: 232px;
      }

    </style>
    <script src="ol3/ol-debug.js" type="text/javascript"></script>
    <script src="http://cdnjs.cloudflare.com/ajax/libs/proj4js/2.2.1/proj4.js" type="text/javascript"></script>
    <script src="http://epsg.io/28992.js" type="text/javascript"></script>
    <script src="b3pmap.js" type="text/javascript"></script>
```
3. Voer het de volgende javascript calls uit:
```javascript
	var config = { 
          "input": { 
              "wms_layers": [ 
                  { "name":'NWB wegen', "url" : "http://geodata.nationaalgeoregister.nl/nwbwegen/wms", layers: "wegvakken"},
                  { "name":'Nationale parken', "url" : "http://geodata.nationaalgeoregister.nl/nationaleparken/wms", "layers" : "nationaleparken"}
              ], 
              "wfs_layers": [ 
                  { "name" : "NWB wegen wfs", 'url' : "http://geodata.nationaalgeoregister.nl/nwbwegen/wfs"}
              ], 
              "modus": "draw",// "select/draw (selecteren van object in kaart of tekenen van geometrie", 
              "draw_modus":  "Polygon", 
              //"select_wfs_layer": "naam van wfs layer", // Doet het nog niet
              "initial_zoom": 6, // "zoomfactor van de kaart bij opstart", 
              //"geolocator_url": "url naar service waar coordinaten kunnen worden opgevraagd", // Doet het nog niet
              //"format_geolocator_result": "coordx,coordy", // Doet het nog niet
              "tools": [ 
                  {"tool_id": "ZoomSlider"}, 
                  {"tool_id": "MousePosition"}, 
                  {"tool_id": "ScaleLine"}, 
                  {"tool_id": "Zoom"}
              ] 
          }
          ); 
         
      var bm = new B3pmap(); // Maak het object voor de controle over de kaart
      bm.init(config); 		 // Initialiseer en start de kaart


      bm.getOutput();		 // Aan het einde, roep dit aan voor de output gegenereerd door de gebruiker. Output ziet er ongeveer zo uit:
      /* "output": { 
              
              "surface": "berekend oppervlak (0 indien punt)", 
              "wkt": "wkt representatie van getekend object", 
              "gml": "gml representatie van getekend object", 
              "object-ids": [ 
                  {"object-id": "id 1"}, 
                  {"object-id": "id 2"}, 
                  {"object-id": "id 3"} 
              ] 
              } 
      	};
      */
```
4. An example can be fond