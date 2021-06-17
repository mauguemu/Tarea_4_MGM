// Mapa Leaflet
	var mapa = L.map('mapid').setView([9.995816, -83.030099], 15);
	
	// Capa base
	var osm = L.tileLayer(
	  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?', 
	  {
	    maxZoom: 25,
	    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	  }
	).addTo(mapa);
	
	// Otra capa base
	var carto = L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', 
    {
	  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	  subdomains: 'abcd',
	  maxZoom: 19
    }
	).addTo(mapa);

	// Otra capa base
        var esri = L.tileLayer(
	  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', 
	  {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
	  }
	).addTo(mapa);	
	
	
	
	// Conjunto de capas base
	var mapasBase = {
	    "OSM": osm,
		"CartoDB": carto,
		"ESRI": esri,
	};	 

	// Ícono personalizado para puntos
	const iconoPatrimonio = L.divIcon({
	  html: '<i class="fas fa-archway fa-1x"></i>',
	  className: 'estiloIconos'
	});	
	
	const iconoServicios = L.divIcon({
	  html: '<i class="fas fa-store fa-1x"></i>',
	  className: 'estiloIconos1'
	});	
	
	
	// Control de capas
        control_capas = L.control.layers(mapasBase).addTo(mapa);
		
		
	// Control de escala
        L.control.scale({position:'topright', imperial:false}).addTo(mapa);
	
// /* //  Capa vectorial de servicios agrupados  */
$.getJSON("https://mauguemu.github.io/Datos_tarea_2/mapa_calor/servicios_wgs84.geojson", function(geodata) {
  /* // Capa de registros individuales */
  var servicios = L.geoJson(geodata, {
    style: function(feature) {
	  return {'color': "#013220", 'weight': 3}
    },
    onEachFeature: function(feature, layer) {
      var popupText = "<strong>Actividad</strong>: " + feature.properties.actividad + "<br>" + "<strong>Servicio</strong>: " + feature.properties.descripcio + "<br>" ;
      layer.bindPopup(popupText);
    },
    pointToLayer: function(getJsonPoint, latlng) {
        return L.marker(latlng, {icon: iconoServicios});
    }
  });

	/*  // Capa de puntos agrupados */
	var servicios_agrupados = L.markerClusterGroup({spiderfyOnMaxZoom: true});
	servicios_agrupados.addLayer(servicios);
	
	
	
  /* // Capa de calor (heatmap) */
  
  // /* prueba 1 */
  
	coord = geodata.features.map(feat => feat.geometry.coordinates.reverse());
	var servicios_calor = L.heatLayer(coord, {
		radius: 30, 
		blur: 1,
		gradient:{0.1: 'yellow', 0.5: 'orange', 1: 'red'}
	});

	

  /* // Se añaden las capas al mapa y al control de capas */
  servicios_calor.addTo(mapa);
  control_capas.addOverlay(servicios_calor, 'Mapa de calor de servicios');
  
  // servicios_agrupados.addTo(mapa);
  control_capas.addOverlay(servicios_agrupados, 'Servicios agrupados');
  // servicios.addTo(mapa);
  control_capas.addOverlay(servicios, 'Servicios');
});
	
/* // Capa vectorial de registros agrupados de patrimonio material */
$.getJSON("https://mauguemu.github.io/Datos_tarea_2/mapa_calor/patrimonio_wgs84.geojson", function(geodata) {
  /* // Registros individuales */
  var patrimonio = L.geoJson(geodata, {
    style: function(feature) {
	  return {'color': "#013220", 'weight': 3}
    },
    onEachFeature: function(feature, layer) {
      var popupText = "<strong>Patrimonio material</strong>" + "<br>" + 
					  "<strong>Denominación</strong>: " + feature.properties.denominaci + "<br>" + 
                      "<strong>Dominio</strong>: " + feature.properties.dominio + "<br>" + 
                      "<strong>Subcategoría </strong>: " + feature.properties.subcategor + "<br>";
      layer.bindPopup(popupText);
    },
    pointToLayer: function(getJsonPoint, latlng) {
        return L.marker(latlng, {icon: iconoPatrimonio});
    }
  });

  /* // Capa de puntos agrupados */
  var patrimonio_agrupados = L.markerClusterGroup({spiderfyOnMaxZoom: true});
  patrimonio_agrupados.addLayer(patrimonio);

	
  /* // Se añade la capa al mapa y al control de capas */
  patrimonio_agrupados.addTo(mapa);
  // patrimonio.addTo(mapa);
  control_capas.addOverlay(patrimonio_agrupados, 'Registros agrupados de patrimonio');
  control_capas.addOverlay(patrimonio, 'Registros individuales de patrimonio');
});

	
	/* // Capa de coropletas */ 
$.getJSON('https://mauguemu.github.io/Datos_tarea_2/cuadrantes/cuadrantes_centro_historico.geojson', function (geojson) {
  var capa_cuadrantes = L.choropleth(geojson, {
	  valueProperty: 'zona',
	  scale: ['gray', 'black'],
	  steps: 3,
	  mode: 'q',
	  style: {
	    color: '#fff',
	    weight: 2,
	    fillOpacity: 0.5
	  },
	  onEachFeature: function (feature, layer) {
	    layer.bindPopup('Cuadrante: ' + feature.properties.id_cuadrante + '<br>' + 'Zona de origen: ' + feature.properties.id_zona_zonas_delimitadas)
	  }
  }).addTo(mapa);
  control_capas.addOverlay(capa_cuadrantes, 'Cuadrantes' );	
  
  
});
	
	// Capa de coropletas 
$.getJSON('https://mauguemu.github.io/Datos_tarea_2/zonas_delimitadas/zonas_delimitadas_centro_hist.geojson', function (geojson) {
  var capa_zonas_delimitadas = L.choropleth(geojson, {
	  valueProperty: 'recursos',
	  scale: ['yellow', 'red'],
	  steps: 3,
	  mode: 'q',
	  style: {
	    color: '#fff',
	    weight: 2,
	    fillOpacity: 0.5
	  },
	  onEachFeature: function (feature, layer) {
	    layer.bindPopup("<strong>Zona estudio</strong>: " + feature.properties.nombre + '<br>' 
		// + 'Cantidad de recursos: ' + feature.properties.recursos
		)
	  }
  }).addTo(mapa);
  control_capas.addOverlay(capa_zonas_delimitadas, 'Zonas delimitadas' );	
  
});

// Capa vectorial en formato GeoJSON
	$.getJSON("https://mauguemu.github.io/Datos_tarea_2/centro_historico/perimetro_centro_historico.geojson", function(geodata) {
	var centro_historico = L.geoJson(geodata, {
    style: function(feature) {
	  return {'color': "black", 'weight': 2.5, 'fillOpacity': 0.0}
    }
	,
    onEachFeature: function(feature, layer) {
      var popupText1 = "<strong>Centro Histórico Ciudad de Limón</strong>: " ;
      layer.bindPopup(popupText1);
    }			
	}).addTo(mapa);

	control_capas.addOverlay(centro_historico, 'Centro Histórico');
 
	});
	

// Agregar capa WMS
		var capa_via_ferrea = L.tileLayer.wms('https://geos.snitcr.go.cr/be/IGN_200/wms?', {
		  layers: 'viaferrea_200k',
		  format: 'image/png',
		  transparent: true
		}).addTo(mapa);

	// Se agrega al control de capas como de tipo "overlay"
		control_capas.addOverlay(capa_via_ferrea, 'Via ferrocarril');