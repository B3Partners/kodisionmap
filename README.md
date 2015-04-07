kodisionmap
===========

Map used and controlled by a Kodision created form


Hoe te gebruiken
----------
1. Download en extract de zipfile.
2. Neem de volgende scripts/csscode/css files op in de html pagina (groote van #map te bepalen):
    ```html
    <link rel="stylesheet" href="<PATH_TO>/ol3/ol.css" type="text/css">
    <style>
      #map {
        height: 80%;
        width: 80%;
      }
    </style>
    <script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js", type="text/javascript"></script> <!-- Or another version supporting $.ajax() -->
    <script src="ol3/ol-debug.js" type="text/javascript"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/proj4js/2.3.3/proj4.js" type="text/javascript"></script>
    <script src="b3pmap.js" type="text/javascript"></script>

    ```
Neem ook een div element op. Hier wordt de kaart in getoond. Geef het id ervan mee aan de config.

3. Voer het de volgende javascript calls uit:
    ```javascript
	var config = { 
          "input": { 
              "map_id" : "map",
              "wms_layers": [ 
                  { 
                    "name":'<NAAM>', "url" : "<URL>", layers: "<LAAG_NAAM>"
                    // Voorbeeld:  { "name":'NWB wegen', "url" : "http://geodata.nationaalgeoregister.nl/nwbwegen/wms", layers: "wegvakken"},
                  }
              ], 
              "wfs_layers": [ 
                  { 
                    "name":'<NAAM>', "url" : "<URL>", layers: "<LAAG_NAAM>"
                    // Voorbeeld:  { "name" : "NWB wegen wfs", 'url' : "http://geodata.nationaalgeoregister.nl/nwbwegen/wfs", layers: "wegvakken"}
                  }
              ], 
              "wmts_layers":[
                {
                  "name": "<NAAM>", url: "<URL>", layer: "<LAYER>"
                  // Voorbeeld: "name": "BRT", url: "http://geodata.nationaalgeoregister.nl/tiles/service/wmts/brtachtergrondkaart", layer: "brtachtergrondkaart"
                }
              ],
              "tms_layers":[
                "<URL_MET_PARAMETERS"
                // Voorbeeld: http://www.openbasiskaart.nl/mapcache/tms/1.0.0/osm@rd/{z}/{x}/{-y}.png: zie de {z},{x} en {-y} parameters in de string. Deze kan 1-op-1 overgenomen worden.
              ],
              "modus": "draw",// Mogelijke waarden: select, draw : selecteren van object in kaart (via een wfs-laag) of tekenen van geometrie", 
              "draw_modus":  "LineString", // Mogelijke waarden: Polygon, LineString, Point
              "initial_zoom": 6, // "zoomfactor van de kaart bij opstart", 
              "geolocator_url": "http://bag42.nl/api/v0/geocode/json?address=<ADDRESS>", 
              "tools": [ 
                {
                  "tool_id" : "<ID"
                }
                // Mogelijke waardes van tool_id: ZoomSlider, MousePosition, ScaleLine, Zoom
                // Voorbeeld: {"tool_id": "ZoomSlider"}
              ],
              restore: {
                  wkt:[
                    "<WKT_REPRESENTATIE>"
                    // Voorbeeld: "POLYGON((80268.41871976599 454666.20539748564,80241.53871976599 455123.1653974856,80382.65871976598 455183.64539748564,80530.498719766 454894.6853974856,80268.41871976599 454666.20539748564))"
                  ],

              }
            }
          }; 
         
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
              ],
              "image" : "base64 representatie van het kaartbeeld"
              } 
      	};
      */
    ```
4. An example can be found in index.html
