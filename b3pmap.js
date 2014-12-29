function B3pmap(){
	map = null,
	/**
	 * Initialise the map according to the given configuration. 
	 * Based on:
		 { 
		    "input": { 
		        "wms_layers": [ 
		            {"name": "kaartlaag 1", "url": "wms url 1 naar kaartlaag"}, 
		            {"name": "kaartlaag 2", "url": "wms url 2 naar kaartlaag"}, 
		            {"name": "kaartlaag 3", "url": "wms url 3 naar kaartlaag"} 
		        ], 
		        "wfs_layers": [ 
		            {"name": "kaartlaag 1", "url": "wfs url 1 naar kaartlaag"} 
		        ], 
		        "modus": "select/draw (selecteren van object in kaart of tekenen van geometrie", 
		        "draw_modus": "point/polygon", 
		              "select_wfs_layer": "naam van wfs layer", 
		        "initial_zoom": "zoomfactor van de kaart bij opstart", 
		        "geolocator_url": "url naar service waar coordinaten kunnen worden opgevraagd", 
		        "format_geolocator_result": "coordx,coordy", 
		        "tools": [ 
		            {"tool_id": "id van tool die aan moet staan in de kaart 1"}, 
		            {"tool_id": "id van tool die aan moet staan in de kaart 2"}, 
		            {"tool_id": "id van tool die aan moet staan in de kaart 3"} 
		        ] 
		    }, 
		    "output": { 
		        "image": "base 64 string van plaatje", 
		        "surface": "berekend oppervlak (0 indien punt)", 
		        "wkt": "wkt representatie van getekend object", 
		        "gml": "gml representatie van getekend object", 
		        "object-ids": [ 
		            {"object-id": "id 1"}, 
		            {"object-id": "id 2"}, 
		            {"object-id": "id 3"} 
		        ] 
		        } 
		}
	 */
	this.init = function(config){
		var extentAr = [-285401.0,22598.0,595401.0,903401.0];
      	var resolutions = [3440.64, 1720.32, 860.16, 430.08, 215.04, 107.52, 53.76, 26.88, 13.44, 6.72, 3.36, 1.68, 0.84, 0.42,0.21,0.105];
		var matrixIds = new Array(14);
		for (var z = 0; z < resolutions.length; ++z) {
			matrixIds[z] = 'EPSG:28992:' + z;
		}
		var projection = ol.proj.get('EPSG:28992');
		projection.setExtent(extentAr);

		var layers = [ new ol.layer.Tile({
			extent: extentAr,
			source: new ol.source.WMTS({
				url: 'http://geodata.nationaalgeoregister.nl/tiles/service/wmts/brtachtergrondkaart',
				layer: 'brtachtergrondkaart',
				matrixSet: 'EPSG:28992',
				format: 'image/png',
				projection: projection,
				tileGrid: new ol.tilegrid.WMTS({
					origin: ol.extent.getTopLeft(extentAr),
					resolutions: resolutions,
					matrixIds: matrixIds
				})
			})
	    })];
	    initLayers(config.input.wms_layers,layers);

	    createMap(layers,config.input.initial_zoom || 2, extentAr,projection)
		initModus(config);
	},

	initModus  = function (config){
		if(config.input.modus === "select"){

		}else if(config.input.modus === "draw"){
			var source = new ol.source.Vector();

			var vector = new ol.layer.Vector({
				source: source,
				style: new ol.style.Style({
					fill: new ol.style.Fill({
						color: 'rgba(255, 255, 255, 0.2)'
					}),
					stroke: new ol.style.Stroke({
						color: '#ffcc33',
						width: 2
					}),
					image: new ol.style.Circle({
						radius: 7,
						fill: new ol.style.Fill({
							color: '#ffcc33'
						})
					})
				})
			});
			map.addLayer(vector);
			var draw = new ol.interaction.Draw({
		      source: source,
		      type: /** @type {ol.geom.GeometryType} */ config.input.draw_modus
		    });
		    map.addInteraction(draw);
		}else{
			throw "Wrong modus given. Only select and draw supported";
		}

	},

	initLayers = function (layersConfig, layers){
		for (var i = 0; i < layersConfig.length; i++) {
			var layerConfig = layersConfig[i];
			var layer = initLayer(layerConfig);
			if(layer){
				layers.push(layer);
			}
		};
	},

	initLayer = function (layerConfig){
		var layer = new ol.layer.Image({
			source: new ol.source.ImageWMS({
				url: layerConfig.url,
				params: {
					layers: layerConfig.layers
				}
			})
		});

		return layer;

	},

	initTools = function(tools){

	},
	initTool = function (tool){

	},

	createMap = function(layers, zoom, extent, projection){
		map = new ol.Map({
			target: 'map',
			layers: layers,
			view: new ol.View({
				projection: projection,
				center: [101984, 437240],
				zoom: zoom,
				minResolution: 0.105,
				maxResolution: 3440.64,
				extent: extent
			}),
			controls: [
				new ol.control.Zoom(),
				new ol.control.ScaleLine()
			]
		});
	}
}