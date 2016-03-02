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
            myFirstName: ""
        }, options );

        var ul = this;

        getItems(settings).then(function(data){
          items = data;
          console.log(items);
          ul.html(items.join(""));
          return ul;
        });
    };

}(jQuery));

function getItems(settings){

  return $.getJSON(settings.file).then(function( citations ) {

    console.log(citations);
    var items = [];

    if(settings.filterBy !== null && settings.filterValue !== null){

      console.log("filtering by " + settings.filterBy + " = " + settings.filterValue);

      citations = _.filter(citations, function(citation){
        console.log(citation[settings.filterBy]);
        return citation[settings.filterBy] == settings.filterValue;
      });
    }

    if(settings.sortBy != null){

      console.log("sorting by " + settings.sortBy);

      citations = _.sortBy(citations, function(citation){
        console.log(citation[settings.sortBy]);
        return citation[settings.sortBy];
      });

      if(settings.orderType === "desc"){
        citations.reverse();
      }
    }

    citations.forEach(function( citation ) {

      console.log("Rendering");
      console.log(citation);

      var item = "<li ";
      if(settings.classli !== ''){
        item += " class='"+settings.classli+"'";
      }
      item += ">";

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

      console.log(item);
      console.log("end rendering");
      console.log();

      items.push( item );
    });

    return items;
  });
}
