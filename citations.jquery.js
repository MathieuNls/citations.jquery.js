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
            debug: true,
            groupBy:null,
            preGroup:null,
            postGroup: null,
            groupTitle: null,
            searchBar:null
        }, options );

        if(settings.searchBar !== null){
          $( settings.searchBar ).keyup(function( event ) {
            if ( event.which == 13 ) {
               event.preventDefault();
            }

            $(".citation-item").each(function(index){

              if($(this).text().toLowerCase().indexOf($( settings.searchBar ).val().toLowerCase())>-1){
                $(this).show();
              }else{
                $(this).hide();
              }
            });
          });
        }

        var target = this;

        getItems(settings).then(function(data){
          items = data;
          pluginLog(settings.debug, items);
          target.html(items.join(""));
          return target;
        });
    };

}(jQuery));

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
