# TROMPA selectable-score React component

![Screenshot demonstrating selectable score](selectable-score.png)

This repository contains the selectable-score React component, a wrapper around a [MELD score component](https://github.com/oerc-music/meld-clients-core) that allows for selection of score elements via click-and-drag, built using the [DragSelect](https://github.com/ThibaultJanBeyer/DragSelect) node module. 

The MELD score is itself a wrapper around the [Verovio](https://verovio.org) MEI engraver supporting the incorporation of Linked Data (e.g. Web Annotations). 

This component is intended to serve various score-centric applications of the [TROMPA project](https://trompamusic.eu).

## Usage

To use the component in your project:

`import SelectableScore from 'selectable-score/lib/selectable-score';`

If your application requires paging through the score, additionally import the following:

```
import NextPageButton from 'selectable-score/lib/next-page-button';
import PrevPageButton from 'selectable-score/lib/prev-page-button';
```

If your application requires submission of score selections (e.g. as Web Annotations) via HTTP POST ([Solid POD compatible!](http://solidproject.org)), additionally import the following:

```
import SubmitButton from 'selectable-score/lib/submit-button';
```


### SelectableScore props
The `<SelectableScore>` component accepts the following props:

* `uri` (*required*): Your MEI file's URI. 
* `vrvOptions` (*optional*): a JSON object containing layout options to pass on to Verovio. [More information on Verovio options here](https://verovio.org/javascript.xhtml). If not specified, uses these defaults:

```
{ 
  scale: 45,
  adjustPageHeight: 1,
  pageHeight: 2500,
  pageWidth: 2200,
  footer: "none",
  unit: 6
}
```
* `onScoreReady` (*optional*): a callback to trigger when the score SVG is initially rendered. Receives two arguments: the score SVG element, and a reference to the loaded Verovio toolkit. 

* `onScoreUpdate` (*optional*): a callback to trigger when the score SVG is updated, i.e. when a layout change or a page flip has happened. Receives the updated score SVG element as an argument.

* `selectionString` (*optional*): specifies the CSS selector used by DragSelect for click-and-drag selections. Any valid CSS selector acceptable; if not specified, defaults to `.note`.

* `selectionArea` (*optional*): a CSS selector used to specify the DOM element serving as the selection area for DragSelect (within which `selectionString` elements are selected when clicked-and-dragged over). If not specified, defaults to `.score`.

* `onSelectionChange` (*required*): a callback to your application's selection handler. 

* `annotationContainerUri` (*optional*): URI of an LDP (e.g. Solid) container with annotations to be retrieved for this score

* `toggleAnnotationRetrieval` (*optional*): Boolean flag to trigger retrieval of annotation content from annotationContainerUri

* `onReceiveAnotationContainerContent` (*optional*): Callback to trigger on retrieval of annotation content from annotationContainerUri


### NextPageButton and PrevPageButton props
The `<NextPageButton>` and `<PrevPageButton>` components are simple interaction wrappers that attach a click handler for MELD-score-based paging to any HTML (JSX) elements you care to provide -- typically, "Next page" and "Previous page" buttons. They accept the following props: 
  
* `buttonContent` (*optional*): Your JSX content for the button. This could be as simple as `<span>Next page</span>`. Note that you can attach your own click handlers if your application requires actions beyond the page turn itself to occur on button click -- but don't stop the click event's propagation (event.stopPropagation), or the page won't turn. Failure to supply buttonContent will result in an empty component. 

* `uri` (*required*): Your MEI file's URI. 


### SubmitButton props
the `<SubmitButton>` component simplifies posting of selected content - e.g. in the context of a Web Annotation - via HTTP POST. This includes support for authenticated POSTing to Solid PODs. The component accepts the following props:

* `buttonContent` (*optional*): Your JSX content for the button. Could be as simple as `<span>Submit!</span>`.
* `submitUri` (*required*): The URI to POST to. If used in an authenticated Solid context (e.g. using (`solid/react-components')[http://github.com/solid/react-components] modules), this could be a location in the user's POD
* `submitHandler` (*required*): Callback function to trigger when the button is clicked. **Expected to return a JSON object**, the contents of which forms the HTTP POST request body. 
* `submitHandlerArgs` (*optional*): JSON object handed to the submitHandler callback when triggered.  If not supplied, an empty object will be used instead.
* `onResponse` (*optional*): Callback to trigger when the POST is completed. Your application may want to set the <SelectableScore> component's toggleAnnotationRetrieval to true when this happens, so that newly POSTed annotations can be retrieved and rendered.

## Demo application

A minimal example React application integrating the selectable-score component is available at (trompamusic/selectable-score-demo)[http://github.com/trompamusic/selectable-score-demo]. 

## Known issues

Paging is currently very slow. We're working on improving this, through MELD optimisations and potentially by running Verovio as a Web Worker (work in progress!)

## Further reading
For more information on TROMPA see the [TROMPA website](https://trompamusic.eu) and the following paper:

* [DLfM 2019 overview paper on TROMPA](https://dl.acm.org/doi/10.1145/3358664.3358666)


For more information on MELD see the [MELD metarepository](https://github.com/oerc-music/meld) and these papers:

* [ISMIR 2017 paper on distributed annotation of musical score](https://ora.ox.ac.uk/objects/uuid:945287f6-5dd3-4424-940c-b919b8ad2768)

* [DLfM 2018 paper on publishing musicology using MELD](https://dl.acm.org/doi/10.1145/3273024.3273038)

* [DLfM 2019 paper on annotating musicological observations using MELD](https://dl.acm.org/doi/10.1145/3358664.3358669)

