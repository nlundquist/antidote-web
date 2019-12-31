import '../data.js'; // make sure all contexts are defined
import { html } from 'lit-html';
import { component, useState } from 'haunted';
import { syringeServiceRoot } from "../helpers/page-state.js";
import useFetch from '../helpers/use-fetch.js'

customElements.define('antidote-catalog-context', component(() => {
  const allLessonRequest = useFetch(`${syringeServiceRoot}/exp/lesson`);
  const [filteringState, setFilteringState] = useState({
    searchString: null,
    Category: null,
    Duration: null,
    Difficulty: null,
    Tags: []
  });

  return html`
    <style>
      :host, 
      antidote-all-lesson-context-provider,
      antidote-lesson-filtering-context-provider {
        display: block;
        height: 100%;
        width: 100%;
      }
    </style>
    <antidote-all-lesson-context-provider .value=${allLessonRequest}>    
    <antidote-lesson-filtering-context-provider .value=${[filteringState, setFilteringState]}>    
      <slot></slot>
    </antidote-lesson-filtering-context-provider>
    </antidote-all-lesson-context-provider>
  `
}));