var parseTime = d3.timeParse("%d/%m/%Y");
var parseTime_ok = d3.timeParse("%Y-%m-%d");
var formatTime = d3.timeFormat("%d/%m/%Y")
var mainWidth = 1200;
const is_mobile = $(window).width() < 850 ? true : false;

var  curent_col =  'people_vaccinated_per_hundred';

var chosenChroma = chroma.scale('OrRd');
var currentDate;
var currentdate_formated;

var colorScale3 = function(pct){

return chosenChroma(pct/50).hex()

}

// console.log(mainWidth)

var color = d3.scaleLinear()
  .range(["white", '#ED728B', "#E3234A", '#690000']);


color.domain([0, 30, 60, 80]);

var sliderTime = 10000;
var maptype = 'standard';
moment.locale('fr')


d3.select('svg#legend')
.style('margin-bottom', 0 + 'px')

d3.select('svg#map_slider')
.style('width', (mainWidth > 1000 ? '1000px' : String(mainWidth) + 'px'));


d3.select('#slider_container')
.style('width', (mainWidth > 1000 ? '1000px' : String(mainWidth) + 'px'));

var margin2 = {top: 80, right: 30, bottom: 60, left: 40},
    width2 = 1000 - margin2.left - margin2.right,
    height2 = 450 - margin2.top - margin2.bottom,
    padding = 0.3,
    max_width = 1000,
    width_slider = (width2 < (mainWidth -70) ? width2 : (mainWidth -70)),
    width2 = width2 < mainWidth ? width2 : mainWidth,
    map,
    app_data,
    t0 = parseTime('17/11/2018'),
    tMax,
    ticks_slider,
    svgmap,
    gmap,
    info_city,
    this_zoom_level = 4.6,
    thismaxZoom = 12,
    rectWidth = 10,
    minMaxRectWidth = [12,30],
    scaleWidth,
    thisMinZoom = 2;
var g_x_translation_europe = 1300;
var g_y_translation_europe = 160;

    if($(window).width() >= 1000){

this_zoom_level = 6;
    }

    var mainColor = '#E3234A';


var svg2 = d3.select("svg#map_slider");

svg2.style('width', (width_slider + 30));

var articles = d3.select('div#articles')

var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;


function ZoomEurope(){

// allPaths.filter(d=>d.europe != 1).style('display', 'none')

d3.select('#map svg g.map').transition().attr('transform', `translate(${-g_x_translation_europe},${-g_y_translation_europe}) scale(3.5)`)

// d3.select('#map svg g.map').transition().attr('transform', `translate(-1400, -160) scale(3.5)`)


}

function ZoomReset(){

// allPaths.filter(d=>d.europe != 1).style('display', 'initial')

// d3.select('#map svg g.map').transition().attr('transform', 'translate(0,0) scale(1)')

d3.select('#map svg g.map').transition().attr('transform', `translate(-110,0) scale(1.15)`)

  }

// set the ranges
var x = d3.scaleTime()
.range([0, width_slider])
.clamp(true);


var y = d3.scaleLinear()
    .range([height2, 0]);


  var div = d3.select("body").append("div")
  .attr("id", "tooltip")
  .attr('class', 'box');

/////////////////////////
//////////////////////////////////////// configuration
const geoIDVariable = 'id'
const format = d3.format(',')

// Set tooltips
const tip = d3
  .tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d){
    var this_array = app_data.filter( e=> e.pays_iso == d.id);
    if (this_array.length == 0){var this_country = d.properties.nom
    var this_html = `<span class='details'>${this_country}<br></span></span>`}
    else {var this_d = _.last(app_data.filter( e=> e.pays_iso == d.id))
    var this_html = `<span class='details'>${d.properties.nom}<br>
    <span><b>${this_d.people_vaccinated_per_hundred}%</b> ont reçu au moins une dose de vaccin</span><br>
    <span> ${this_d.people_fully_vaccinated_per_hundred ? 
      'et <b>'+ this_d.people_fully_vaccinated_per_hundred + '%</b> sont complètement vaccinés' : 
      'Données non communiquées pour la seconde dose'} </span><br>
      </span></span>`

    }

    // <span>${this_d.total_vaccinations} personnes vaccinées</span><br>

 return this_html

  }
)


tip.direction(function(d) {
  if (d.properties.name === 'Antarctica') return 'n'
  // Americas
  if (d.properties.name === 'Greenland') return 's'
  if (d.properties.name === 'Canada') return 'e'
  if (d.properties.name === 'USA') return 'e'
  if (d.properties.name === 'Mexico') return 'e'
  // Europe
  if (d.properties.name === 'Iceland') return 's'
  if (d.properties.name === 'Norway') return 's'
  if (d.properties.name === 'Sweden') return 's'
  if (d.properties.name === 'Finland') return 's'
  if (d.properties.name === 'Russia') return 'w'
  // Asia
  if (d.properties.name === 'China') return 'w'
  if (d.properties.name === 'Japan') return 's'
  // Oceania
  if (d.properties.name === 'Indonesia') return 'w'
  if (d.properties.name === 'Papua New Guinea') return 'w'
  if (d.properties.name === 'Australia') return 'w'
  if (d.properties.name === 'New Zealand') return 'w'
  // otherwise if not specified
  return 'n'
})

tip.offset(function(d) {
  // [top, left]
  if (d.properties.name === 'Antarctica') return [0, 0]
  // Americas
  if (d.properties.name === 'Greenland') return [10, -10]
  if (d.properties.name === 'Canada') return [24, -28]
  if (d.properties.name === 'USA') return [-5, 8]
  if (d.properties.name === 'Mexico') return [12, 10]
  if (d.properties.name === 'Chile') return [0, -15]
  // Europe
  if (d.properties.name === 'Iceland') return [15, 0]
  if (d.properties.name === 'Norway') return [10, -28]
  if (d.properties.name === 'Sweden') return [10, -8]
  if (d.properties.name === 'Finland') return [10, 0]
  if (d.properties.name === 'France') return [-9, 66]
  if (d.properties.name === 'Italy') return [-8, -6]
  if (d.properties.name === 'Russia') return [5, 385]
  // Africa
  if (d.properties.name === 'Madagascar') return [-10, 10]
  // Asia
  if (d.properties.name === 'China') return [-16, -8]
  if (d.properties.name === 'Mongolia') return [-5, 0]
  if (d.properties.name === 'Pakistan') return [-10, 13]
  if (d.properties.name === 'India') return [-11, -18]
  if (d.properties.name === 'Nepal') return [-8, 1]
  if (d.properties.name === 'Myanmar') return [-12, 0]
  if (d.properties.name === 'Laos') return [-12, -8]
  if (d.properties.name === 'Vietnam') return [-12, -4]
  if (d.properties.name === 'Japan') return [5, 5]
  // Oceania
  if (d.properties.name === 'Indonesia') return [0, -5]
  if (d.properties.name === 'Papua New Guinea') return [-5, -10]
  if (d.properties.name === 'Australia') return [-15, 0]
  if (d.properties.name === 'New Zealand') return [-15, 0]
  // otherwise if not specified
  return [-10, 0]
})

d3.select('body').style('overflow', 'hidden')

const parentWidth = d3
  .select('body')
  .node()
  .getBoundingClientRect().width

const margin = { top: 0, right: 0, bottom: 0, left: 0 }
const width = 960 - margin.left - margin.right
const height = 500 - margin.top - margin.bottom


const svg = d3
  .select('#map')
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .call(responsivefy)
  .append('g')
  .attr('class', 'map');

const projection = d3
  .geoRobinson()
  .scale(148)
  .rotate([352, 0, 0])
  .translate([width / 2, height / 2])

const path = d3.geoPath().projection(projection)

svg.call(tip)

queue()
  .defer(d3.json, 'data/world_countries2.json')
  // .defer(d3.csv, 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ6YOcYH2GBljCvg2rXaPjWC2ibMV0upfMWd93kpQ6R8tO8mYtZt3y0SQNcRFI2K7aXyXNsgK5LGHnx/pub?gid=1360208169&single=true&output=csv')
  // .defer(d3.csv, 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSEAZ3OlKyj1QF_Jw0XIWwWrhwUdCRaq5fElBC8Xwx5e57wwcmVGnOQOAIccguQ-2dF-t_iQpCYWwKQ/pub?gid=0&single=true&output=csv')
  .defer(d3.csv, 'data/vaccination_countries_dates.csv')
  .await(ready)

function ready(error, geography, data) {

 

    data.forEach(d => {
    d.date = d.datetime;
    d.datetime = parseTime_ok(d.date);
    d.pays_iso = d.iso_code;
    d.pays = d.Pays;
    d.people_vaccinated_per_hundred = +d.people_vaccinated_per_hundred;
    d.people_fully_vaccinated_per_hundred = +d.people_fully_vaccinated_per_hundred;
  })


  // console.log(data);


d3.select('#zoomEurope')
.on('click', function(){

var that = d3.select(this)
if (that.classed('zoomed')){

that.classed('zoomed', false)
that.classed('unzoomed', true)
that.text("Zoom sur l'Europe")


ZoomReset()

}
else{

that.classed('zoomed', true)
that.classed('unzoomed', false)
that.text("Dézoomer")

ZoomEurope()

}


})



d3.select('#display_one_dose')
.on('click', function(){
if (curent_col == 'people_fully_vaccinated_per_hundred'){

curent_col = 'people_vaccinated_per_hundred';

d3.select('#display_one_dose')
.classed('selected', true)

d3.select('#display_two_doses')
.classed('selected', false)

populate_map(currentDate, 0)

}})

d3.select('#display_two_doses')
.on('click', function(){
if (curent_col == 'people_vaccinated_per_hundred'){

curent_col = 'people_fully_vaccinated_per_hundred';


d3.select('#display_one_dose')
.classed('selected', false)

d3.select('#display_two_doses')
.classed('selected', true)

populate_map(currentDate, 0)

}})

data = data.filter(function(d,i){return d.datetime });

app_data = data;
tMax = d3.max(data, function(d) { return d.datetime; })
t0 = d3.min(data, function(d) { return d.datetime; })

x.domain([t0 , tMax]);

ticks_slider =  [x.ticks()[0], x.ticks()[x.ticks().length -1]];




  svg
    .append('g')
    .attr('class', 'countries')
    .selectAll('path')
    .data(geography.features)
    .enter()
    .append('path')
    .attr('d', path)
    .style('fill', d => {
      if (typeof _.last(data.filter(function(e){return e.pays_iso == d.id})) !== 'undefined') {

      }
      return '#fff'
    })
    .style('fill-opacity', 0.9)
    .style('stroke', 'lightgray')
    .style('stroke-width', 0.5)
    .style('stroke-opacity', 1)
    // tooltips
    .on('mouseover', function(d) {
      tip.show(d)

      reposition_tip()


      d3.select(this)
        .style('fill-opacity', 1)
        .style('stroke-opacity', 1)
        .style('stroke-width', 1)
    })
    .on('mouseout', function(d) {
      tip.hide(d)

      d3.select(this)
        .style('fill-opacity', 0.9)
        .style('stroke-opacity', 1)
        .style('stroke-width', 0.5)
    })

  svg
    .append('path')
    .datum(topojson.mesh(geography.features, (a, b) => a.id !== b.id))
    .attr('class', 'names')
    .attr('d', path)


d3.select('#map svg g.map').transition().attr('transform', `translate(-110,0) scale(1.15)`);

makeSlider()


}



////////////////////////////// Slider  //////
//////////////////////////////////////////////////////////

function makeSlider (){

  var slider = svg2.append("g")
  .attr("class", "slider")
  .attr("transform", "translate(10,40)");

  slider.append("line")
  .attr("class", "track")
  .attr("x1", x.range()[0])
  .attr("x2", x.range()[1])
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
  .attr("class", "track-inset")
  // .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
  // .attr("class", "track-overlay")
  .call(d3.drag()
    .on("start.interrupt", function() { slider.interrupt(); })
    .on("start drag", function() { moving_slider(x.invert(d3.event.x)); }));




// slider.selectAll('rect.rectEvent')
// .data(app_data)
// .enter()
// .append('rect')
// .attr('class', 'rectEvent')
// .attr('x', function(d){return x(d.datetime)})
// .attr('y', -13)
// .attr('width', '10px')
// .attr('height', '25px')
// .attr('fill', mainColor)
// .style('pointer-events', 'none');


  var handle = slider.insert("g", ".track-overlay")
  .attr("class", "handle")
;

handle.append("rect")
.attr("width", 12)
.attr("height", 27)
.attr("y", -14)
.attr("x", -1)
;

slider
.append('g')
.attr('transform', 'translate(0, 40)')
.append('text')
.attr('class', 'dateSlider')
.attr('text-anchor', 'start')
.text(moment(t0, 'DD-MM-YYYY').format('LL'))
;


slider
.append('g')
.attr('transform', 'translate(' + width_slider + ', 40)')
.append('text')
.attr('class', 'dateSlider')
.attr('text-anchor', 'end')
// .text('aujourd\'hui')
.text(moment(tMax, 'DD-MM-YYYY').format('LL'))
;

slider
.append('g')
.attr('transform', 'translate(' + width_slider/2 + ', -20)')
.append('text')
.attr('class', 'dateSlider currentDate')
.attr('text-anchor', 'middle')
.text(moment(t0, 'DD-MM-YYYY').format('LL'))
;
// Transitions

slider.transition() 
.duration(sliderTime)
  .ease(d3.easeLinear)
.tween("moving_slider", function() {
  var i = d3.interpolate(t0, tMax);
  // d3.select("#articles").style('display', 'none');
    d3.select('#play_button')
  .html('<img src="img/pause.svg"">')
  .attr('class','pause');

d3.select('#play_button')
.on('click', function(){
check_transition();
});

  return function(t) { moving_slider(i(t)); };
})
.on('end', function(){

// updatemap()

populate_map(tMax, 0)



})
.on('interrupt', function(d){
});


// Auto animation with transitions

d3.select('#reload_svg')
.on('click', function(){

  slider.transition('chrono_animation')
  .duration(0);

  d3.select('#play_button')
  .text('PLAY')
  .attr('class','play');

slider.transition() // Intro
.duration(0)
.tween("moving_slider", function() {
  var i = d3.interpolate(t0, t0);
  // d3.select("#articles").style('display', 'none')
  return function(t) { moving_slider(i(t)); };

})
.on('end', function(){d3.select("#articles").style('display', 'block')})
.on('interrupt', function(d){d3.select("#articles").style('display', 'block')});


})


d3.select('#play_button')
.on('click', function(){
check_transition();
});


slider
.on('click', function(){
  slider.transition('chrono_animation')
  .duration(sliderTime);
  d3.select('#play_button')
  .html('<img src="img/play.svg"">')
  .attr('class','play');

})

function check_transition(){

  var transition_state = d3.select('#play_button').attr('class');

    // console.log(transition_state)


  if (transition_state == 'pause')
  {

    slider.interrupt()
    slider.transition('chrono_animation')
    .duration(0);

d3.select('#play_button')
.html('<img src="img/play.svg">')
.attr('class','play');

}

else{
  restart_transition();
}
}

// Starting auto animation

function restart_transition(){


  var z_val  = Math.round(+handle.attr("transform").split('(')[1].split(',')[0]);

  // moving_slider(x.invert(d3.event.x))

  d3.select('#play_button')
  .html('<img src="img/pause.svg">')
  .attr('class','pause');

  if (z_val == x(tMax)){
    var this_sliderTime = sliderTime;
    z_val = x(t0);
  }
  else{
    var this_sliderTime = sliderTime*((x(tMax) - z_val) /x(tMax));
  }

  slider.transition('chrono_animation')
  .duration(this_sliderTime)
  .ease(d3.easeLinear)
  .tween("moving_slider", function() {

    z_val = z_val == tMax ? t0 : z_val;
    var i = d3.interpolate(x.invert(z_val), tMax);
    // d3.select("#articles").style('display', 'none')
    return function(t) { moving_slider(i(t)); };
  })
  .on('end', function(){

    // updateAllArticle()

d3.select('#play_button')
.html('<img src="img/play.svg">')
.attr('class','play');

})
  .on('interrupt', function(d){


})
}



function moving_slider(h) {
  handle.attr("transform", "translate("+ x(h) +",0)");

  

  currentDate = h;

  if (formatTime(currentDate) != currentdate_formated){

    currentdate_formated = formatTime(currentDate)
    populate_map(h, 0)

  }

}


d3.select('.handle').node().parentNode.appendChild(d3.select('.handle').node());

}



///////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////POPULATING MAP


function populate_map(date_value, city, category){


  if (date_value){

d3.select('svg g.slider g text.currentDate')
.text(moment(date_value, 'DD-MM-YYYY').format('LL'))


  var filtered_data = _.cloneDeep(app_data).filter(function(d){ return d.datetime <= date_value});

  filtered_data = filtered_data.sort(function(a,b){return d3.descending(a.datetime , b.datetime)});

  // console.log(moment(date_value, 'DD-MM-YYYY').format('LL'))
  // console.log(filtered_data)


fillMap(filtered_data)


  }
  
else if (category){


    var filtered_data = _.cloneDeep(app_data).filter(function(d){ return d.type_Array[0] == category});


    filtered_data = filtered_data.sort(function(a,b){return d3.descending(a.datetime , b.datetime)});


}

  else{

    d3.select("#cityTitle")
      .text(city);

      info_city.update(city)

      d3.select('.info.city.box')
      .style('display', 'none')

    var filtered_data = _.cloneDeep(app_data).filter(function(d){ return d.Lieu == city});

    // console.log(filtered_data)

    filtered_data = filtered_data.sort(function(a,b){return d3.descending(a.datetime , b.datetime)});

  }

}


function fillMap(filtered_data){


var thoseLocations =  _.uniqBy(filtered_data, function(d){return d.pays_iso}).map(function(d){return d.pays_iso});


svg.selectAll('g.countries path').filter(d => !thoseLocations.includes(d.id))
.style('fill', '#fff')
let those_paths = svg.selectAll('g.countries path').filter(d => thoseLocations.includes(d.id));

those_paths
    .style('fill', d => {

        // return colorScale3(+(_.first(filtered_data.filter(function(e){return e.pays_iso == d.id}))).total_vaccinations_per_hundred)
        return color(+(_.first(filtered_data.filter(function(e){return e.pays_iso == d.id})))[curent_col])

    })


    }


function reposition_tip(){


  let left_position_tip = parseFloat(d3.select('.d3-tip').style('left'));
  let top_position_tip = parseFloat(d3.select('.d3-tip').style('top'));
  let width_svg = parseFloat(d3.select('#map svg').style('width'));
  let width_tip = parseFloat(d3.select('.d3-tip').style('width'));

      if (left_position_tip < 0){
        d3.select('.d3-tip').style('left', 0)
      }
      if (top_position_tip < 0){
        d3.select('.d3-tip').style('top', 0)
      }

    if ((left_position_tip + width_tip) >= width_svg){

      let new_left = (width_svg - width_tip + 10) > 0 ? (width_svg - width_tip + 10) : 0;

      d3.select('.d3-tip').style('left', new_left + "px")
      .style('opacity', 1)

    }



}

    function responsivefy(svg) {

        // get container + svg aspect ratio
        var container = d3.select(svg.node().parentNode),
        width = parseInt(svg.style('width')),
        height = parseInt(svg.style("height")),
        aspect = width / height;


        // add viewBox and preserve aspectratio properties
        // call resize so that svg resizes on initial page load
        svg.attr("viewBox", "0 0 " + width + " " + height)
        .attr("preserveAspectRatio", "xMinYMid")
        .call(resize);

        d3.select('svg#map_slider')
        .attr("viewBox", "0 0 " + 1000 + " " + 80)
        .attr("preserveAspectRatio", "xMinYMid")
        // .call(resize);




        // to register multiple listeners for the same event type
        d3.select(window).on("resize." + container.attr("id"), resize);

        function resize() {

            var actualContainerWidth = parseInt(container.style("width"));

            var targetWidth = actualContainerWidth <= max_width  ? actualContainerWidth : 1000;
            var targetHeight = Math.round(targetWidth / aspect);

            svg.attr("width", targetWidth);
            svg.attr("height", targetHeight);

            if (actualContainerWidth < 1000){

              // d3.select('#slider_container').style('width', actualContainerWidth + 'px')
              d3.select('svg#map_slider').attr('width', (actualContainerWidth - 40))
              d3.select('svg#map_slider').style('width', (actualContainerWidth - 40) + 'px')

            }

        }
    }

d3.selectAll(".shareTwitter")
.on('click', function(d){ shareTwitter()});

d3.selectAll(".shareFacebook")
.on('click', function(d){ shareFacebook()});

function shareFacebook () {
          var url = encodeURIComponent(window.location.origin + window.location.pathname),
              link = 'http://www.facebook.com/sharer/sharer.php?u=' + url ;
          window.open(link, '', 'width=575,height=400,menubar=no,toolbar=no');
        };

function shareTwitter () {
          var url = encodeURIComponent(window.location.origin + window.location.pathname),
              text = "Comment jour par jour, pays par pays, le confinement a gagné la planète entière https://www.liberation.fr/apps/2020/04/comment-le-confinement-a-gagne-la-planete/ via @libe",
              link = 'https://twitter.com/intent/tweet?original_referer=&text=' + text;
          window.open(link, '', 'width=575,height=400,menubar=no,toolbar=no');

      }