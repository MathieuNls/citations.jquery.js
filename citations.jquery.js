// # Released under MIT License
//
// Copyright (c) 2016 Mathieu Nayrolles.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

(function ( $ ) {

    $.fn.cite = function ( options ) {

        // This is the easiest way to have default options.
        var settings = $.extend({
            // These are the defaults.
            file: "publication.json",
            classul: "",
            classli: "",
            sortBy: null,
            orderType: "asc",
            filterBy: null,
            filterValue: null,
            myLastName: "",
            myFirstName: "",
            debug: false,
            groupBy:null,
            preGroup:null,
            postGroup: null,
            groupTitle: null,
            searchBar:null
        }, options );

        /**
         * If a searchbar is specified, monitor its inputs and show/hide
         * matching items
         */
        if(settings.searchBar !== null){

          $( settings.searchBar ).keyup(function( event ) {
            if ( event.which == 13 ) {
               event.preventDefault();
            }
            //check if each item contains the searchbar's value
            //and show/hide them accordingly.
            $(".citation-item").each(function(index){

              if($(this).text().toLowerCase().indexOf($( settings.searchBar ).val().toLowerCase())>-1){
                $(this).show();
              }else{
                $(this).hide();
              }
            });

          });
        }

        //will be used in callback
        var target = this;

        //get the items to display and add them to
        //the target
        getItems(settings).then(function(data){
          items = data;
          pluginLog(settings.debug, items);
          target.html(items.join(""));
          return target;
        });
    };

}(jQuery));

/**
 * sort the citations according to settings.sortBy
 * and settings.orderType
 * @param  Array citations
 * @param  Array settings
 * @return Array
 */
function sortCitations(citations, settings){
  if(settings.sortBy != null){

    citations = _.sortBy(citations, function(citation){
      if(settings.debug){
        pluginLog(settings.debug, citation[settings.sortBy]);
      }
      return citation[settings.sortBy];
    });

    if(settings.orderType === "desc"){
      citations.reverse();
    }
  }
  return citations;
}

/**
 * Filter citations according to settings.filterBy
 * and  settings.filterValue
 * @param  Array citations
 * @param  Array settings
 * @return Array
 */
function filterCitation(citations, settings){
  if(settings.filterBy !== null && settings.filterValue !== null){

    pluginLog(settings.debug, "filtering by " + settings.filterBy + " = " + settings.filterValue);

    citations = _.filter(citations, function(citation){
      pluginLog(settings.debug, citation[settings.filterBy]);
      return citation[settings.filterBy] == settings.filterValue;
    });
  }
  return citations;
}

/**
 * Invokes the filter, sort and construct functions.
 * Wraps their results in <ul>
 *
 * @param  Array citations
 * @param  Array settings
 * @return Array
 */
function sortFilterAndConstruct(citations, settings){
  citations = filterCitation(citations, settings);
  citations = sortCitations(citations, settings);

  var ulLis = "<ul";

  if(settings.classul !== ''){
    ulLis += " class='"+settings.classul+"'";
  }

  ulLis += ">"+constructItems(citations, settings)+"</ul>";

  return ulLis;
}

/**
 * Constructs li items
 * @param  Array citations
 * @param  Array settings
 * @return Array
 */
function constructItems(citations, settings){
  var items = [];
  citations.forEach(function( citation ) {

    pluginLog(settings.debug, "Rendering");
    pluginLog(settings.debug, citation);

    var item = "<li class='citation-item";
    if(settings.classli !== ''){
      item += ' ' + settings.classli;
    }
    item += "'>";

    for (var i = 0; i < citation.authors.length; i++) {
      if(citation.authors[i].lastname === settings.myLastName
      && citation.authors[i].firstname === settings.myFirstName){
        item += "<u>"+ citation.authors[i].lastname + ", " + citation.authors[i].firstname.charAt(0) + ".</u> "
      }else{
        item += citation.authors[i].lastname + ", " + citation.authors[i].firstname.charAt(0) + "."
      }

      if(i < citation.authors.length - 2){
        item += ", ";
      }else if (i < citation.authors.length - 1) {
        item += " &amp; ";
      }
    }

    if(citation.year !== undefined){
      item += " ("+citation.year+").";
    }

    if(citation.title !== undefined){
      item += " " + citation.title+"." ;
    }

    if(citation.venue !== undefined){
      item += " " + citation.venue+"." ;
    }

    if(citation.pages !== undefined){
      item += " (pp.  " + citation.pages+")." ;
    }

    if(citation.publisher !== undefined){
      item += " " + citation.publisher+"." ;
    }

    if(citation.isbn !== undefined){
      item += " " + citation.isbn+"." ;
    }

    if(citation.misc !== undefined){
      item += " " + citation.misc+"." ;
    }

    pluginLog(settings.debug, item);
    pluginLog(settings.debug, "end rendering");
    pluginLog(settings.debug, "");

    items.push( item );
  });
  return items;
}

/**
 * Get items
 * @param  Array settings
 * @return Array
 */
function getItems(settings){

  return $.getJSON(settings.file).then(function( citations ) {

    pluginLog(settings.debug, citations);

    var items = [];

    if(settings.groupBy !== null){

      pluginLog(settings.debug, "Grouping by " + settings.groupBy);

      citations = _.groupBy(citations, function(citation){
        return citation[settings.groupBy];
      });

      for(var key in citations){

        if(settings.preGroup !== null){
          var pre = settings.preGroup;
          if(settings.groupTitle !== null
            && settings.groupTitle[key] !== undefined){
            pre = pre.replace("{title}", settings.groupTitle[key]);
          }else{
            pre = pre.replace("{title}", key);
          }
          items.push(pre);
        }

        items = items.concat(sortFilterAndConstruct(citations[key], settings));

        if(settings.postGroup !== null){
          items.push(settings.postGroup);
        }
      }

    }else{
      items = sortFilterAndConstruct(citations, settings);
    }

    return items;
  });
}

function pluginLog(debug, log){
  if(debug){
    console.log(log);
  }
}
