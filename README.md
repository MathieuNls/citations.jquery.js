# citations.jquery.js
A JQuery plugin to ease citations.

![alt text](http://imgur.com/xRaEhYY)

### Roadmap

- [ ] Tests
- [ ] Highlight search results
- [ ] The current `cite` function is more like a LateX `\citeAll`, I would like to have both `\cite` and `\citeAll` behaviour.
- [ ] Support bibtex/build a bib to json converter
- [ ] Display a list of co-author with numbers of papers associated and allow search by co-author
- [ ] Same for years
- [ ] Same for students (In case a Pr wants to highlights students of his)
- [ ] Support official citation style (APA, Harvard, ...)

### Working example

You can see a live example [here](https://math.co.de/resume.html).

### How to install

Download the [latest version of the plugin](https://github.com/MathieuNls/citations.jquery.js/releases/latest).

```html
<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js"></script>
<script type="text/javascript" src="path/to/citations.jquery.js"></script>
```
### How to use

Given a `publications.json` file looking like :

```javascript
[
 {"authors":
   [
     {"lastname": "Nayrolles", "firstname": "Mathieu"},
     {"lastname": "Palma", "firstname": "Francis"},
     {"lastname": "Moha", "firstname": "Naouel"}
   ],
   "title":"SOA Antipatterns : An Approach for their Specification and Detection",
   "venue": "International Journal of Cooperative Information Systems",
   "volume":22,
   "issue":4,
   "year":2013,
   "type": "journal",
   "pages": "1-40"
 },...
 ...,
]
```

The following will populate the `#journal` element with a `<ul><li>` structure.

```javascript
$("#papers").cite({
  file : "/json/publications.json"
});
```
In this example, it'll generate

```html
<div id="papers">
  <ul>
    <li>Nayrolles, M. , Palma, F. &amp; Moha, N. (2013). SOA Antipatterns : An Approach for their Specification and Detection. International Journal of Cooperative Information Systems. (pp. 1-40).</li>
    <li>...</li>
    <li>...</li>
  </ul>
</div>
```

A more advanced example with sorting, grouping, and more:

```javascript
$("#papers").cite({
  file : "json/publications.json",
  sortBy : "year",
  orderType : "desc",
  groupBy: "type",
  myLastName : "Nayrolles",
  myFirstName : "Mathieu",
  classul: "resume-item-list",
  preGroup: "<div class='resume-item'><h3 class='resume-item-title'>{title}</h3>",
  postGroup:'</div>',
  groupTitle : {
    journal: "Peer Reviewed Journals"
  },
  searchBar: "#filter"
});
```
will generate :

```html
<div id="papers">
  <div class='resume-item'><h3 class='resume-item-title'>Peer Reviewed Journals</h3>
  <ul class="resume-item-list">
    <li><u>Nayrolles, M.</u> , Palma, F. &amp; Moha, N. (2013). SOA Antipatterns : An Approach for their Specification and Detection. International Journal of Cooperative Information Systems. (pp. 1-40).</li>
    <li>...</li>
    <li>...</li>
  </ul>
</div>
```
### Options

 * file: url to your publication json file
 * classul: optional class to add for ul
 * classli: optional class to add for each li
 * sortBy: optional field on which publications shall be sorted
 * orderType: optional, default = "asc".
 * filterBy: optional, field on which remove publication
 * filterValue: optional, field value on which remove publication
 * myLastName: optional, your last name to underline it
 * myFirstName: optional, your first name to underline it
 * debug: optional, default false.
 * groupBy:optional, a field on which group your publications
 * preGroup:optional, if you group your citation, you might want to add something before each group. You can use the `{title}` key in preGroup to replace it with the group key value
 * postGroup: optional, see preGroup
 * groupTitle: optional, the group key value might not be the title you want for your group. You can provide an associative array `groupKey value : Title`
 * searchBar:optional, provide a selector to an input field. Only publications matching the input value will be shown.
