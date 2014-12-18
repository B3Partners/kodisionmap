function B3pmap(){

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
		alert("sfd");
	
	}


}