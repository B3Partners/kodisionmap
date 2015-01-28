function B3pmap(){
	this.scripts= [
    "http://cdnjs.cloudflare.com/ajax/libs/proj4js/2.2.1/proj4.js",
    "http://epsg.io/28992.js"
	];
	this.map = null,
	this.vectorLayer = null,
	this.draw = null,
	this.select = null,
	this.modus = null,
	this.wfsSource = null,
	this.config = null,
	/**
	 * Initialise the map according to the given configuration. 
	 * Based on:
		   "input": { 
	          "map_id" : "mad",
	          "wms_layers": [ 
	        //  { "name":'NWB wegen', "url" : "http://geodata.nationaalgeoregister.nl/nwbwegen/wms", layers: "wegvakken"},
	         //  { "name":'Nationale parken', "url" : "http://geodata.nationaalgeoregister.nl/nationaleparken/wms", "layers" : "nationaleparken"}
	          ], 
	          "wfs_layers": [
	          //  { "name" : "NWB wegen wfs", 'url' : "http://geodata.nationaalgeoregister.nl/nwbwegen/wfs"}
	          ], 
	          "wmts_layers":[
	            {
	          //      "name": "BRT", url: "http://geodata.nationaalgeoregister.nl/tiles/service/wmts/brtachtergrondkaart", layer: "brtachtergrondkaart"
	                //"name": "BRT", url: "http://geodata.nationaalgeoregister.nl/tiles/service/wmts/", layer: "brtachtergrondkaartgrijstijdelijk"
	            }
	          ],
	          "modus": "draw",// "select/draw (selecteren van object in kaart of tekenen van geometrie", 
	          "draw_modus":  "Polygon", 
	          "select_wfs_layer": "naam van wfs layer", 
	          "initial_zoom": 13, // "zoomfactor van de kaart bij opstart", 
	          "geolocator_url": "http://bag42.nl/api/v0/geocode/json?address=zonnebaan 12c, utrecht", 
	          "format_geolocator_result": "coordx,coordy", 
	          "tools": [
	            {"tool_id": "MousePosition"}, 
	            {"tool_id": "ScaleLine"}, 
	            {"tool_id": "Zoom"}, 
	            {"tool_id": "ZoomSlider"}
	          ],
	          restore:{
	            wkt: ["POLYGON((80268.41871976599 454666.20539748564,80241.53871976599 455123.1653974856,80382.65871976598 455183.64539748564,80530.498719766 454894.6853974856,80268.41871976599 454666.20539748564))", "POLYGON((80295.298719766 454619.1653974856,81088.25871976599 454236.1253974856,81330.17871976599 454746.84539748565,80295.298719766 454619.1653974856))", "POLYGON((83023.61871976599 456124.4453974856,83312.578719766 455318.04539748555,83614.97871976599 455385.24539748556,83581.37871976598 456144.6053974855,83023.61871976599 456124.4453974856))"]
	          } 
	        }
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
		this.config = config;
		this.initSources();
	},

	this.initSources = function(){
		if(this.scripts.length > 0 ){
			var script = this.scripts[0];
			this.scripts.splice(0,1);
			this.loadScript(script, this.initSources);
		}else{
			this.initComponent();
		}
	},

	this.initComponent = function (){
		var extentAr = [-285401.0,22598.0,595401.0,903401.0];
      	var resolutions = [3440.64, 1720.32, 860.16, 430.08, 215.04, 107.52, 53.76, 26.88, 13.44, 6.72, 3.36, 1.68, 0.84, 0.42,0.21,0.105];
		var matrixIds = [];
		for (var z = 0; z < resolutions.length; ++z) {
			matrixIds[z] = 'EPSG:28992:' + z;
		}
		var projection = ol.proj.get('EPSG:28992');
		projection.setExtent(extentAr);

    	proj4.defs('http://www.opengis.net/gml/srs/epsg.xml#28992', 
        proj4.defs('EPSG:28992')); 
    	
		var openbasiskaartSource = new ol.source.XYZ({
			crossOrigin: 'anonymous',
			extent: extentAr,
			projection: projection,
			url: 'http://www.openbasiskaart.nl/mapcache/tms/1.0.0/osm@rd/{z}/{x}/{-y}.png'
		});
		var layers = [
		 new ol.layer.Tile({
		    source: openbasiskaartSource
		})];
	    this.initWMTSLayers(this.config.input.wmts_layers,layers, extentAr, projection, resolutions, matrixIds);
	    this.initWMSLayers(this.config.input.wms_layers,layers);
	    this.initWFSLayers(this.config.input.wfs_layers,layers);

	    this.createMap(layers,this.config.input.initial_zoom || 2, extentAr,projection, this.config.input.map_id)
		this.initModus(this.config);
		this.initTools(this.config.input.tools);
		this.initCSS(this.config.input.tools);

		if(this.config.input.restore && this.config.input.restore.wkt.length > 0 ){
			this.restore(this.config.input.restore);
		}else{
			this.openGeolocatorURL(this.config.input);
		}
	},
	/**
	* getOutput
	* Return the output of the user interaction. 
	* @returns Returns an object containing the output of the user interaction with the map. Expect an object with the following keys: surface <double>, gml <string of gml>, wkt <array of wkt values>, object-ids <array with object-id's>. 
	*/
	this.getOutput = function(){
		var features = [];
		var output = {
			"surface": this.getSurface(),
			"wkt": this.getWKTs(),
			"gml" : this.getGMLs() ,
			"object-ids": this.getObjectIds(),
			"image": this.getBase64()
		};
		return output;
	},
  	this.baseimg = null,
  	this.getBase64 = function(){
  		var me = this;
		me.map.once('postcompose', function(event) {
			var canvas = event.context.canvas;
			me.baseimg =  canvas.toDataURL();
		});
		me.map.renderSync();
		return this.returnImage();
  	},

  	this.returnImage = function(){
  		if(this.baseimg !== null){
  			return this.baseimg;
  		}else{
  			setTimeout(this.returnImage, 100);
  		}
  	},
	/**
	* getSurface
	* Calculates the surface of all vector features on screen
	* @returns Value of the total surface of all vector features (drawn of selected).
	*/
	this.getSurface = function(){
		var area = 0;
		if(this.modus === "draw"){
			var source = this.vectorLayer.getSource();
			var features = source.getFeatures();
			if(this.draw.type_ === "Polygon"){
				for (var i = 0; i < features.length; i++) {
					var feature = features[i];
					area += feature.getGeometry().getArea();
				};
			}else if(this.draw.type_ === "Point"){
				// when point, don't calculate the area :)
			}else{
				throw "Other geometry types not yet implemented";
			}
		}else if(this.modus === "select"){
			var features = this.select.getFeatures().getArray();
			for (var i = 0; i < features.length; i++) {
				var feature = features[i];
				area += feature.getGeometry().getArea();
			};

		}
		return area;
	},
	/*
	* getWKTs
	* @returns Returns an array containing the wkt representation of the drawn or selected features.
	*/
	this.getWKTs = function(){
		var wkts = [];
		var features = [];
		if(this.modus === "draw"){
			var source = this.vectorLayer.getSource();
			features = source.getFeatures();
			
		}else if (this.modus === "select"){
			features = this.select.getFeatures().getArray();
		}

		var wktParser = new ol.format.WKT();
		for (var i = 0; i < features.length; i++) {
			var feature = features[i];

			var wkt = wktParser.writeFeature(feature);
			wkts.push(wkt);
		};
		return wkts;
	},
	/*
	* getGMLs
	* @returns Returns an string containing the GML representation of the drawn or selected features.
	*/
	this.getGMLs = function(){
		var gmlParser = new ol.format.GML({
			featureNS: "http://www.b3partners.nl/b3p",
			featureType: "b3p"
		});
		var features = [];

		if(this.modus === "draw"){
			var source = this.vectorLayer.getSource();
			features = source.getFeatures();
		}else if(this.modus === "select"){
			features = this.select.getFeatures().getArray();
		}
		var gmls = gmlParser.writeFeatures(features);

		return gmls;
	},

	/*
	* getObjectIds
	* @returns Returns an array with objects containing the objectIds from the selected features. Only valid when the modus is "select"
	*/
	this.getObjectIds = function (){
		var objectIds = []
		if(this.modus === "select"){
			var features = this.select.getFeatures().getArray();
			for (var i = 0; i < features.length; i++) {
				var feature = features[i];
				var objectId = {
					"object-id" : feature.getId()
				};
				objectIds.push(objectId);
			};
		}
		return objectIds;
	},

	/**
	* initModus
	* Initalise this component for the given modus (select/draw)
	*/
	this.initModus  = function (config){
		this.modus = config.input.modus;
		if(this.modus === "select"){
			var me = this;
			this.select = new ol.interaction.Select({toggle:true, toggleCondition:  ol.events.condition.noModifierKeys});
			this.map.addInteraction(this.select);
		}else if(this.modus === "draw"){
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

	/**
	* openGeolocatorURL
	* Open the given geolocator url, parse the coordinates and zoom to them.
	*/
	this.openGeolocatorURL = function(config){
		if(config.geolocator_url && config.format_geolocator_result){
			var me = this;
			$.ajax({
				url: config.geolocator_url,
    			crossDomain: true,
				dataType: 'text',
				success: function(data, status){
					var coords = me.parseBAG42Response(JSON.parse(data));
					if(coords !== null && !isNaN(coords[0]) && ! isNaN (coords[1])){
						var view = me.map.getView();
						view.setCenter(coords);
					}
				},
				error: function(xhr, status, error){
					throw "Error collecting features: " + status + " Error given:" + error;
				}
			});
		}
	},

	this.parseBAG42Response = function (response){
		if(response.status === "OK" && response.results.length > 0 ){
			var result = response.results[0];
			var geometry = result.geometry.location;
			var geomArray = [geometry.lng, geometry.lat];
			var geom = proj4(proj4.defs('EPSG:28992'), geomArray);
			return geom;
		}else{
			return null;
		}
	},
	/**
	*restore: {
          wkt:[],

      }
	*/
	this.restore = function(restoreObject){
		var wkts = restoreObject.wkt;

		var wktParser = new ol.format.WKT();
		var features = [];
		for (var i = 0; i < wkts.length; i++) {
			var wkt = wkts[i];
			var feature = wktParser.readFeature(wkt);
			features.push(feature.getGeometry());
		}

		var geomcollection = new ol.geom.GeometryCollection();
		geomcollection.setGeometries(features);
		this.map.getView().fitExtent(geomcollection.getExtent(), this.map.getSize());
	},

	this.initWMTSLayers = function(layersConfig, layers, extentAr, projection, resolutions, matrixIds){
		for (var i = 0 ; i < layersConfig.length ;i++){
			var config = layersConfig[0];
			var layer = this.initWMTSLayer(config, extentAr, projection, resolutions, matrixIds);
			layers.push(layer);
		}
	},

	this.initWMTSLayer = function (layerConfig, extentAr, projection, resolutions, matrixIds){
		var layer = new ol.layer.Tile({
			extent: extentAr,
			source: new ol.source.WMTS({
				url: layerConfig.url,
				layer: layerConfig.layer,
				matrixSet: 'EPSG:28992',
				format: layerConfig.format || 'image/png',
				projection: projection,
				tileGrid: new ol.tilegrid.WMTS({
					origin: ol.extent.getTopLeft(extentAr),
					resolutions: resolutions,
					matrixIds: matrixIds
				})
			})
	    })
	    return layer;
	},

	/**
	* initWFSLayers
	* Initializes the given WFS layers
	*/
	this.initWFSLayers = function(layersConfig, layers){
		for (var i = 0; i < layersConfig.length; i++) {
			var config = layersConfig[i];
			var layer = this.initWFSLayer(config);
			if(layer){
				layers.push(layer);
			}
		};
	},
	this.initWFSLayer = function(layerConfig){
		var me = this;
		this.wfsSource = new ol.source.ServerVector({
		  format: new ol.format.GeoJSON(),
		  loader: function(extent, resolution, projection) {
				var url = layerConfig.url + '?service=WFS&' +
			        'version=1.1.0&request=GetFeature&typename=' + layerConfig.layers +
			        '&outputFormat=application/json&srsName=EPSG:28992&bbox=' + extent.join(',') + '';
				$.ajax({
					url: url,
					crossDomain:true,
					dataType: 'text',
					success: function(data, status){
						me.wfsSource.addFeatures(me.wfsSource.readFeatures(data));
					},
					error: function(xhr, status, error){
						throw "Error collecting features: " + status + " Error given:" + error;
					}
				});

		  },
		  strategy: ol.loadingstrategy.createTile(new ol.tilegrid.XYZ({
		    maxZoom: 19
		  })),
		  projection: 'EPSG:28992'
		});

		var vector = new ol.layer.Vector({
		  source: this.wfsSource,
		  style: new ol.style.Style({
		    stroke: new ol.style.Stroke({
		      color: 'rgba(0, 0, 255, 1.0)',
		      width: 2
		    })
		  })
		});
		return vector;
	},

	this.initWMSLayers = function (layersConfig, layers){
		for (var i = 0; i < layersConfig.length; i++) {
			var layerConfig = layersConfig[i];
			var layer = this.initWMSLayer(layerConfig);
			if(layer){
				layers.push(layer);
			}
		};
	},

	this.initWMSLayer = function (layerConfig){
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

	this.initCSS = function (tools){
		var slider = false, zoom = false;
		for (var i = 0; i < tools.length; i++) {
			var toolConfig = tools[i];
			var toolId = toolConfig["tool_id"];
			if(toolId === "Zoom"){
				zoom = true;
			}
			if(toolId === "ZoomSlider"){
				slider = true;
			}
			if(toolId === "MousePosition"){
				var selector = ".ol-mouse-position";
				var css = "top:auto;bottom: 8px !important;right: 8px;padding:2px;position: absolute;";
				this.addCSSRule(selector,css);
			}
		};
		if(slider && zoom){    
      		var css = "margin-top: 204px;";
      		var selector = ".ol-zoom .ol-zoom-out";
      		this.addCSSRule(selector, css);      


      		css = "background-color: transparent;top: 2.3em;";
      		selector = ".ol-zoomslider ";
      		this.addCSSRule(selector, css);   

      		css = " margin-top: 212px;";
      		selector = ".ol-touch .ol-zoom .ol-zoom-out";
      		this.addCSSRule(selector, css);    

      		css = " top: 2.75em;";
      		selector = ".ol-touch .ol-zoomslider";
      		this.addCSSRule(selector, css);      
		}
	},

	this.createMap = function(layers, zoom, extent, projection,mapId){
		this.map = new ol.Map({
			target: mapId,
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
	},
	/**
	* loadScript
	* 
	*/
	this.loadScript = function (url, callback){
		// Adding the script tag to the head as suggested before
	    var head = document.getElementsByTagName('head')[0];
	    var script = document.createElement('script');
	    script.type = 'text/javascript';
	    script.src = url;

	    // Then bind the event to the callback function.
	    // There are several events for cross browser compatibility.
	    var me = this;
	    script.onreadystatechange = function(){
	    	callback.apply(me);
	    };
	    script.onload = function(){
	    	callback.apply(me);
	    };

	    // Fire the loading
	    head.appendChild(script);
	},
	this.addCSSRule = function(selector, rules, index){
		var sheet = document.styleSheets[0];
		if("insertRule" in sheet) {
			sheet.insertRule(selector + "{" + rules + "}", sheet.cssRules.length);
		}else if("addRule" in sheet) {
			sheet.addRule(selector, rules, -1);
		}
	}
}