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
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js", type="text/javascript"></script> <!-- Or another version supporting $.ajax() -->
    <script src="<PATH_TO>/ol-debug.js" type="text/javascript"></script>
    <script src="<PATH_TO>/b3pmap.js" type="text/javascript"></script>

    ```
Neem ook een div element op. Hier wordt de kaart in getoond. Geef het id ervan mee aan de config.

3. Voer het de volgende javascript calls uit:
    ```javascript
	var config = { 
          "input": { 
              "map_id" : "map",
              "wms_layers": [ 
                  { "name":'NWB wegen', "url" : "http://geodata.nationaalgeoregister.nl/nwbwegen/wms", layers: "wegvakken"},
                  { "name":'Nationale parken', "url" : "http://geodata.nationaalgeoregister.nl/nationaleparken/wms", "layers" : "nationaleparken"}
              ], 
              "wfs_layers": [ 
                  { "name" : "NWB wegen wfs", 'url' : "http://geodata.nationaalgeoregister.nl/nwbwegen/wfs"}
              ], 
              "wmts_layers":[
              {"name": "BRT", url: "http://geodata.nationaalgeoregister.nl/tiles/service/wmts/brtachtergrondkaart", layer: "brtachtergrondkaart"}
              ],
              "modus": "draw",// "select/draw (selecteren van object in kaart of tekenen van geometrie", 
              "draw_modus":  "Polygon", 
              "select_wfs_layer": "naam van wfs layer", // Doet het nog niet
              "initial_zoom": 6, // "zoomfactor van de kaart bij opstart", 
              "geolocator_url": "http://bag42.nl/api/v0/geocode/json?address=", 
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
4. An example can be found in index.html
