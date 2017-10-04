
function initDemoMap(){
//BASE TILE LAYER 1
  var Esri_WorldImagery = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, ' +
    'AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  });
//BASE TILE LAYER 2
  var Esri_DarkGreyCanvas = L.tileLayer(
    "http://{s}.sm.mapstack.stamen.com/" +
    "(toner-lite,$fff[difference],$fff[@23],$fff[hsl-saturation@20])/" +
    "{z}/{x}/{y}.png",
    {
      attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, ' +
      'NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
    }
  );
//BASE TILE LAYER 3
  var Stamen_Toner = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.{ext}', {
    attribution: 'Map tiles by Stamen Design, CC BY 3.0 &mdash; Map data &copy; OpenStreetMap',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 20,
    ext: 'png'
  });
//
  var Esri_Oceans = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Sources: Esri, GEBCO, NOAA, National Geographic, DeLorme, HERE, Geonames.org, and other contributors'
  });
  var Esri_Topo = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Sources: Esri, HERE, DeLorme, Intermap, increment P Corp., GEBCO, USGS, FAO, NPS, NRCAN, GeoBase, IGN,' + 
	' Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), swisstopo, MapmyIndia, &copy;  OpenStreetMap' + 
	' contributors, and the GIS User Community'
  });

//BASE TILE GROUP LAYER
  var baseLayers = {
    "Oceans ": Esri_Oceans,
    "Satellite": Esri_WorldImagery,
    "Grey ": Esri_DarkGreyCanvas,
    "Topo ": Esri_Topo
  };
//MAP STRUCTURE
  var map = L.map('map', {
    layers: [ Esri_Oceans ],
    minZoom : 2,
    worldCopyJump: true,
    inertia: false
  });

//MENU CREATION
  var layerControl = L.control.layers(baseLayers);
  layerControl.addTo(map);
  map.setView([0, -45], 4);
//MOUSE POSITION BOTTOM LEFT
  L.control.mousePosition().addTo(map);
//CREDIT FOR LOPS LOGO
  var credctrl = L.controlCredits({
  image: "dist/ArgoFR_Logo_80.png",
  link: "http://www.argo-france.fr/",
  text: "<center><b>Argo<br>France</b></center>",
  width: 80,
  height: 85
  }).addTo(map);
//INIT RETURN FUNCTION
  return {
    map: map,
    layerControl: layerControl
  };
}

// MAP CREATION
var mapStuff = initDemoMap();
var map = mapStuff.map;
// MENU
var layerControl = mapStuff.layerControl;

//ICON FOR SELECTED FLOAT
// ico0 = {iconShape: 'doughnut', borderWidth: 4, borderColor: '#50f308'};
ico0 = {iconShape: 'doughnut', iconSize: [16,16], iconAnchor: [8,8], borderWidth: 5, borderColor: '#f00', backgroundColor: '#f99'}
var curmarker = L.marker([0,0],{icon: L.BeautifyIcon.icon(ico0)});

//ICON FOR IFREMER FLOAT:
// ico1 = {iconShape: 'circle-dot', borderWidth: 4, borderColor: '#fdfe02'};
// ico1 = {icon: 'beautify', iconSize: [11,11], borderWidth: 1, borderColor: '#000', backgroundColor: '#fdfe02'};
ico1 = {iconShape: 'doughnut', iconSize: [10,10], iconAnchor: [5,5], borderWidth: 1, borderColor: '#000', backgroundColor: '#fdfe02'}

//ICON FOR ANY OTHER FLOAT:
// ico2 = {iconShape: 'circle-dot', borderWidth: 3, borderColor: '#ffffff'};
// ico2 = {icon: 'beautify', iconSize: [7,7], borderWidth: 1, borderColor: '#000', backgroundColor: '#fff'};
// ico2 = {iconShape: 'doughnut', iconSize: [8,8], iconAnchor: [4,4], borderWidth: 1, borderColor: '#000', backgroundColor: '#33ff77'}
ico2 = {iconShape: 'doughnut', iconSize: [8,8], iconAnchor: [4,4], borderWidth: 1, borderColor: '#000', backgroundColor: '#999'}

//ICON FOR FLOAT TRAJECTORY:
// ico3 = {iconShape: 'circle-dot', borderWidth: 4, borderColor: '#7de0ba'};
// ico3 = {icon: 'beautify', iconAnchor: [0,0], iconSize: [7,7], borderWidth: 1, borderColor: '#000', backgroundColor: '#7de0ba'};
ico3 = {iconShape: 'doughnut', iconSize: [8,8], iconAnchor: [4,4], borderWidth: 1, borderColor: '#000', backgroundColor: '#faa'}

//TRAJ LAYER, EMPTY AT START
var majaxLayer=L.layerGroup();
map.addLayer(majaxLayer);
//SIDE PANEL
var sidebar = L.control.sidebar('sidebar', {
  closeButton: true,
  position: 'left',
  autoPan: 'off'
});
map.addControl(sidebar);

//DATA LAYERS
// AVISO
$.getJSON('data/aviso.json', function (data) {
  var velocityLayer1 = L.velocityLayer({
    displayValues: true,
    displayOptions: {
      velocityType : 'Aviso Surface currents',
      displayPosition: 'bottomleft',
      displayEmptyString: 'No current data'
    },
    data: data,
    maxVelocity: 1,
    velocityScale: 0.3,
	colorScale: palette('cb-YlGn', 10)
  });
  htmlName1='<font color="red">Aviso Currents from '+WDate+'</font> <a target="_blank" href="https://www.aviso.altimetry.fr/en/data/products/sea-surface-height-products/global/madt-h-uv.html"><img src="dist/info.png" height="15" width="15"></a>'
  layerControl.addOverlay(velocityLayer1, htmlName1);
  map.addLayer(velocityLayer1); //Default display when page loads
});

// AVISO MDT
$.getJSON('data/aviso_mdt.json', function (data) {
  var velocityLayer2 = L.velocityLayer({
    displayValues: true,
    displayOptions: {
      velocityType : 'Aviso Surface currents',
      displayPosition: 'bottomleft',
      displayEmptyString: 'No current data'
    },
    data: data,
    maxVelocity: 1,
    velocityScale: 0.3,
	colorScale: palette('cb-Purples', 10)
  });
  htmlName2='<font color="red">Climatology Aviso mdt-2013</font> <a target="_blank" href="https://www.aviso.altimetry.fr/fr/donnees/produits/produits-auxiliaires/mdt.html"><img src="dist/info.png" height="15" width="15"></a>'
  layerControl.addOverlay(velocityLayer2, htmlName2);
});

// ANDRO
$.getJSON('data/andro_gm.json', function (data) {
  var velocityLayer3 = L.velocityLayer({
    displayValues: true,
    displayOptions: {
      velocityType : 'Andro deep velocity',
      displayPosition: 'bottomleft',
      displayEmptyString: 'No velocity data'
    },
    data: data,
    maxVelocity: 1,
    velocityScale: 0.3,
	colorScale: palette('tol-sq', 10)
  });
  htmlName3='<font color="red">Andro deep velocity</font> <a target="_blank" href="https://wwz.ifremer.fr/lpo/Produits/ANDRO"><img src="dist/info.png" height="15" width="15"></a>'
  layerControl.addOverlay(velocityLayer3, htmlName3);
});

//ARGO DAY
var mapdata=Data_ARGO;
var argomarkers = L.layerGroup();
for (var i = 0; i < mapdata.length; i++)
{
  if(mapdata[i].Institution == 'IF') {
    var marker = L.marker([mapdata[i].latitude,mapdata[i].longitude],{title: mapdata[i].Platform,icon: L.BeautifyIcon.icon(ico1)});
  }
  else {
    var marker = L.marker([mapdata[i].latitude,mapdata[i].longitude],{title: mapdata[i].Platform,icon: L.BeautifyIcon.icon(ico2)});
  }
  //ONCLIK, CALL SUBMARKERCLICK FUNCTION (SIDE PANEL + TRAJ)
  marker.on('click',L.bind(SubMarkerClick,null,mapdata[i]));
  marker.addTo(argomarkers);
};
htmlName4='<font color="blue">Argo profiles from '+WDate+'</font> <a target="_blank" href="http://www.umr-lops.fr/SO-Argo/Home/"><img src="dist/info.png" height="15" width="15"></a>'
layerControl.addOverlay(argomarkers, htmlName4);

//ARGO 7 DAYS
var mapdata2=Data_ARGO7;
var argomarkers2 = L.layerGroup();
for (var i = 0; i < mapdata2.length; i++)
{
  if(mapdata2[i].Institution == 'IF') {
    var marker = L.marker([mapdata2[i].latitude,mapdata2[i].longitude],{title: mapdata2[i].Platform,icon: L.BeautifyIcon.icon(ico1)});
  }
  else {
    var marker = L.marker([mapdata2[i].latitude,mapdata2[i].longitude],{title: mapdata2[i].Platform,icon: L.BeautifyIcon.icon(ico2)});
  }
  //ONCLIK, CALL SUBMARKERCLICK FUNCTION (SIDE PANEL + TRAJ)
  marker.on('click',L.bind(SubMarkerClick,null,mapdata2[i]));
  marker.addTo(argomarkers2);
};
htmlName5='<font color="blue">Argo profiles from the last 7 days</font> <a target="_blank" href="http://www.umr-lops.fr/SO-Argo/Home"><img src="dist/info.png" height="15" width="15"></a>'
layerControl.addOverlay(argomarkers2, htmlName5);
map.addLayer(argomarkers2);

//ARGO 30 DAYS DEEP
var mapdata3=Data_ARGO30DEEP;
var argomarkers3 = L.layerGroup();
for (var i = 0; i < mapdata3.length; i++)
{
  if(mapdata3[i].Institution == 'IF') {
    var marker = L.marker([mapdata3[i].latitude,mapdata3[i].longitude],{title: mapdata3[i].Platform,icon: L.BeautifyIcon.icon(ico1)});
  }
  else {
    var marker = L.marker([mapdata3[i].latitude,mapdata3[i].longitude],{title: mapdata3[i].Platform,icon: L.BeautifyIcon.icon(ico2)});
  }
  //ONCLIK, CALL SUBMARKERCLICK FUNCTION (SIDE PANEL + TRAJ)
  marker.on('click',L.bind(SubMarkerClick,null,mapdata3[i]));
  marker.addTo(argomarkers3);
};
htmlName6='<font color="blue">Argo Deep floats profiles from the last 30 days</font> <a target="_blank" href="http://www.umr-lops.fr/SO-Argo/Home"><img src="dist/info.png" height="15" width="15"></a>'
layerControl.addOverlay(argomarkers3, htmlName6);

//TRAJ ALREADY PLOTTED, IF insTraj==1 AND CLICK ON TRAJ WE DON'T PLOT THE SAME TRAJECTORY
insTraj=0;
pl='0';

//SIDE PANEL MANAGEMENT
function SubMarkerClick(smarker) {
  //DOUGHNUT MARKER ON THE SELECTED FLOAT
  curmarker.setLatLng([smarker.latitude,smarker.longitude]);
  curmarker.addTo(map);
  //CLEAR ANY EXISTING TRAJECTORIES IF CLICK OUTSIDE THE PLOTTED TRAJECTORY
  if(smarker.Platform!=pl){
	majaxLayer.clearLayers();
	insTraj=0;
  }
  //ERDDAP URLs
  ti=smarker.Time;
  pl=smarker.Platform;
  inst=smarker.Institution;
  tempurl="http://www.ifremer.fr/erddap/tabledap/ArgoFloats.png?temp,pres,psal&time="+ti.substr(0,4)+"-"+ti.substr(4,2)+"-"+ti.substr(6,2)+"T"+ti.substr(8,2)+"%3A"+ti.substr(10,2)+"%3A"+ti.substr(12,2)+"Z&platform_number=%22"+pl+"%22&.draw=linesAndMarkers&.yRange=%7C%7Cfalse";
  psalurl="http://www.ifremer.fr/erddap/tabledap/ArgoFloats.png?psal,pres,temp&time="+ti.substr(0,4)+"-"+ti.substr(4,2)+"-"+ti.substr(6,2)+"T"+ti.substr(8,2)+"%3A"+ti.substr(10,2)+"%3A"+ti.substr(12,2)+"Z&platform_number=%22"+pl+"%22&.draw=linesAndMarkers&.yRange=%7C%7Cfalse";
  trajurl="http://www.ifremer.fr/erddap/tabledap/ArgoFloats.png?longitude,latitude,time&platform_number=%22"+pl+"%22&.draw=linesAndMarkers";
  graphurl="http://www.ifremer.fr/erddap/tabledap/ArgoFloats.graph?temp,pres,psal&time="+ti.substr(0,4)+"-"+ti.substr(4,2)+"-"+ti.substr(6,2)+"T"+ti.substr(8,2)+"%3A"+ti.substr(10,2)+"%3A"+ti.substr(12,2)+"Z&platform_number=%22"+pl+"%22&.draw=linesAndMarkers&.yRange=%7C%7Cfalse";

  //TEST AJAX FOR HIGHCHARTS
  //tempAjx
  $.ajax({
    url:"http://www.ifremer.fr/erddap/tabledap/ArgoFloats.json?pres%2Ctemp&platform_number=%22"+pl+"%22&time="+ti.substr(0,4)+"-"+ti.substr(4,2)+"-"+ti.substr(6,2)+"T"+ti.substr(8,2)+"%3A"+ti.substr(10,2)+"%3A"+ti.substr(12,2)+"Z",
    dataType: 'jsonp',
    jsonp: '.jsonp',
    cache: 'true',
    success: function (data) {
        optionsT.series[0].data = data.table.rows;
        var chart = new Highcharts.Chart(optionsT);
  },
  type: 'GET'
  });
  //psalAjx
  $.ajax({
  url:"http://www.ifremer.fr/erddap/tabledap/ArgoFloats.json?pres%2Cpsal&platform_number=%22"+pl+"%22&time="+ti.substr(0,4)+"-"+ti.substr(4,2)+"-"+ti.substr(6,2)+"T"+ti.substr(8,2)+"%3A"+ti.substr(10,2)+"%3A"+ti.substr(12,2)+"Z",
  dataType: 'jsonp',
  jsonp: '.jsonp',
  cache: 'true',
  success: function (data) {
      optionsS.series[0].data = data.table.rows;
      var chart = new Highcharts.Chart(optionsS);
  },
  type: 'GET'
  });
  //Project PI Model ajax
  $.ajax({
  url:"http://www.ifremer.fr/erddap/tabledap/ArgoFloats.json?project_name%2Cpi_name%2Cplatform_type&platform_number=%22"+pl+"%22&distinct()",
  dataType: 'jsonp',
  jsonp: '.jsonp',
  cache: 'true',
  success: function (data) {
        document.getElementById("ajproject").textContent = (data.table.rows[0][0]);
        document.getElementById("ajpi").textContent = (data.table.rows[0][1]);
        document.getElementById("ajmodel").textContent = (data.table.rows[0][2]);
  },
  type: 'GET'
  });

  //
  sidebar.setContent("<b>FLOAT WMO : </b><a href='http://www.ifremer.fr/argoMonitoring/float/"+ pl + "' target='blank'>" + pl + "</a><br>" +
  "<b><span class='glyphicon glyphicon-important-day'></span>PROFILE DATE : </b>" + ti.substr(0,4)+"."+ti.substr(4,2)+"."+ti.substr(6,2)+"  "+ti.substr(8,2)+":"+ti.substr(10,2)+":"+ti.substr(12,2)+ "<br>" +
  "<b><span class='glyphicon glyphicon-database'></span>DAC : </b>" + inst + "<br>" +
  "<b>PROJECT : </b><span id=\"ajproject\"></span>" + "<br>" +
  "<b><span class='glyphicon glyphicon-nameplate'></span>PI : </b><span id=\"ajpi\"></span>" + "<br>" +
  "<b>FLOAT MODEL : </b><span id=\"ajmodel\"></span>" + "<br>" +
  "<b><span class='glyphicon glyphicon-link'></span><a href='" + graphurl + "' target='blank'>ACCESS TO PROFILE DATA (erddap Ifremer)</a></b>" + "<br>" +
  "<b><span class='glyphicon glyphicon-link'></span><a href='http://www.ifremer.fr/argoMonitoring/float/" + pl + "' target='blank'>ACCESS TO FLOAT MONITORING DATA (Coriolis)</a></b>" + "<br>" +
  //HIGHCHARTS
  "<br><div id=\"containerT\" style=\"min-width: 310px; height: 450px; max-width: 400px; margin: 0 auto\"></div><br>" +
  "<br><div id=\"containerS\" style=\"min-width: 310px; height: 450px; max-width: 400px; margin: 0 auto\"></div><br>"
   );

  sidebar.show();

  //ACCES ERDAPP VIA AJAX FOR TRAJECTORIES AND PROFILES HISTORICAL
  if(insTraj==0){
      $.ajax({
        url:'http://www.ifremer.fr/erddap/tabledap/ArgoFloats.json?time%2Clatitude%2Clongitude&platform_number=%22'+pl+'%22&orderBy(%22time%22)',
        dataType: 'jsonp',
        jsonp: '.jsonp',
        cache: 'true',
        success: function (data) {
                  insTraj=1;
                  var mlatlon=[];
                  for (var i = 0; i < data.table.rows.length; i++)
                    {
                      ajTime=data.table.rows[i][0];
                      mlatlon.push([data.table.rows[i][1],data.table.rows[i][2]]);
                      var markaj = L.marker([data.table.rows[i][1],data.table.rows[i][2]],{title: ajTime,icon: L.BeautifyIcon.icon(ico3)});
                      var markstruct={};
                      markstruct.Time=ajTime.substr(0,4)+ajTime.substr(5,2)+ajTime.substr(8,2)+ajTime.substr(11,2)+ajTime.substr(14,2)+ajTime.substr(17,2);
                      markstruct.Platform=pl;
                      markstruct.Institution=inst;
                      markstruct.latitude=data.table.rows[i][1];
                      markstruct.longitude=data.table.rows[i][2];
                      markaj.on('click',L.bind(SubMarkerClick,null,markstruct));
                      markaj.addTo(majaxLayer);
                    };
                    // var mpoly = L.polyline(mlatlon, {color: '#45f442', smoothFactor: 2}).addTo(majaxLayer);
                    var mpoly = L.polyline(mlatlon, {color: '#f00', smoothFactor: 0}).addTo(majaxLayer);
                  },
      type: 'GET'
    });
}}

//REMOVE MARKER AND TRAJ WHEN CLOSING PANEL
sidebar.on('hide', function () {
     map.removeLayer(curmarker);
     majaxLayer.clearLayers();
     insTraj=0;
 });

//SEARCH TOOL
//IF ARGO7 SELECTED
var controlSearch  = new L.Control.Search({layer: argomarkers2, initial: false, position:'topleft'});
//IF ARGO DEEP SELECTED
//var controlSearch = new L.Control.Search({layer: argomarkers3, initial: false, position:'topleft'});
map.addControl(controlSearch);

//CHART OPTIONS
var optionsT={
    chart: {
        renderTo: 'containerT',
        //type: 'spline',
        inverted: true,
        zoomType: "xy"
    },
    title: {
        text: 'Temperature profile'
    },
    xAxis: {
        reversed: true,
        title: {
            enabled: true,
            text: 'Pressure'
        },
        gridLineDashStyle: 'dash',
        gridLineColor : 'gray',
        gridLineWidth : 1
    },
    yAxis: {
    		opposite: true,
        title: {
            enabled: true,
            text: 'Temperature'
        },
        lineWidth: 2,
        gridLineDashStyle: 'dash',
        gridLineColor : 'gray',
        gridLineWidth : 1
    },
    tooltip: {
        headerFormat: '',
        pointFormat: '{point.x} dbar : {point.y}°C'
    },
    plotOptions: {
        spline: {
            marker: {
                enable: false
            }
        }
    },
    series: [{
      name: "Temperature",
      lineWidth: 4,
      lineColor: "#1f4b93"
    }]
};

var optionsS={
    chart: {
        renderTo: 'containerS',
        //type: 'spline',
        inverted: true,
        zoomType: "xy"
    },
    title: {
        text: 'Salinity profile'
    },
    xAxis: {
        reversed: true,
        title: {
            enabled: true,
            text: 'Pressure'
        },
        gridLineDashStyle: 'dash',
        gridLineColor : 'gray',
        gridLineWidth : 1
    },
    yAxis: {
    		opposite: true,
        title: {
            enabled: true,
            text: 'Salinity'
        },
        lineWidth: 2,
        gridLineDashStyle: 'dash',
        gridLineColor : 'gray',
        gridLineWidth : 1
    },
    tooltip: {
        headerFormat: '',
        pointFormat: '{point.x} dbar : {point.y}'
    },
    plotOptions: {
        spline: {
            marker: {
                enable: false
            }
        }
    },
    series: [{
      name: "Salinity",
      lineWidth: 4,
      lineColor: "#1f4b93"
    }]
}
