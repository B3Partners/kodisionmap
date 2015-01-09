function B3pmap(){
	this.map = null,
	this.vectorLayer = null,
	this.draw = null,
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
	    this.initLayers(config.input.wms_layers,layers);

	    this.createMap(layers,config.input.initial_zoom || 2, extentAr,projection)
		this.initModus(config);
		this.initTools(config.input.tools);
	},

	/**
	*
	*/
	this.getOuput = function(){

		var features = [];
		var output = {
			"surface": this.getSurface(),
			"wkt": this.getWKTs(),
			"gml" : this.getGMLs()/*, 
			"image": "base 64 string van plaatje", 
		        "wkt": "wkt representatie van getekend object", 
		        "object-ids": [ 
		            {"object-id": "id 1"}, 
		            {"object-id": "id 2"}, 
		            {"object-id": "id 3"} 
		        ] 
		        } */
		};

		return output;
	},
	this.getSurface = function(){
		var source = this.vectorLayer.getSource();
		var features = source.getFeatures();
		var area = 0;
		if(this.draw.type_ === "Polygon"){
			for (var i = 0; i < features.length; i++) {
				var feature = features[i];
				area += feature.getGeometry().getArea();
			};
		}else if(this.draw.type_ === "Polygon"){
			// when point, don't calculate the area :)
		}else{
			throw "Other geometry types not yet implemented";
		}
		return area;
	},
	/*
	* getWKTs
	* @returns Returns an array containing the wkt representation of the drawn features.
	*/
	this.getWKTs = function(){
		var source = this.vectorLayer.getSource();
		var features = source.getFeatures();
		var wkts = [];
		for (var i = 0; i < features.length; i++) {
			var feature = features[i];
			var wkt = feature.getGeometry();
			wkts.push(wkt);
		};
		return wkts;
	},
	/*
	* getGMLs
	* @returns Returns an string containing the GML representation of the drawn features.
	*/
	this.getGMLs = function(){
		var gmlParser = new ol.format.GML({
			featureNS: "http://www.b3partners.nl/b3p",
			featureType: "b3p"
		});
		
		var source = this.vectorLayer.getSource();
		var features = source.getFeatures();
		var gmls = gmlParser.writeFeatures(features);

		return gmls;
	},
	this.initModus  = function (config){
		if(config.input.modus === "select"){

		}else if(config.input.modus === "draw"){
			var source = new ol.source.Vector();

			this.vectorLayer = new ol.layer.Vector({
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
			this.draw = new ol.interaction.Draw({
		      source: source,
		      type: config.input.draw_modus
		    });


			this.map.addLayer(this.vectorLayer);
		    this.map.addInteraction(this.draw);
		}else{
			throw "Wrong modus given. Only select and draw supported";
		}

	},

	this.initLayers = function (layersConfig, layers){
		for (var i = 0; i < layersConfig.length; i++) {
			var layerConfig = layersConfig[i];
			var layer = this.initLayer(layerConfig);
			if(layer){
				layers.push(layer);
			}
		};
	},

	this.initLayer = function (layerConfig){
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
	/**
	* Init Tools
	* @param tools Configuration array, where each element is a configuration of a tool.
	* Initializes and adds the tool to the map. General layout of one configuration element:
	* {
		tool_id: <id_the_tool>
      }
	* Possible tool_id's:
	* MousePosition
	* ScaleLine
	* Zoom
	* ZoomSlider
	*/
	this.initTools = function(tools){
		for (var i = 0; i < tools.length; i++) {
			var toolConfig = tools[i];
			var tool = this.initTool(toolConfig);
			this.map.addControl(tool);
		};
	},
	/**
	* initTool (toolConfig)
	* @param toolConfig Object with the id (ie. classname) of the tool.
	* Initialises the actual tool and returns it.
	*/
	this.initTool = function (toolConfig){
		var id = toolConfig["tool_id"];

		var config = {};
		if(id === "MousePosition"){
			config.coordinateFormat = ol.coordinate.createStringXY(2);
		}

		var tool = new ol.control[id](config);
		return tool;
	},

	this.createMap = function(layers, zoom, extent, projection){
		this.map = new ol.Map({
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
			controls: []
		});
	}
}