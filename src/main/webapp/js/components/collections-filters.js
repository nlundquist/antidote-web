import { html } from 'lit-html';
import { component, useContext } from 'haunted';
import { AllCollectionContext, CollectionFilteringContext } from "../data.js";
import debounce from "../helpers/debounce.js";

function getTypeSetFromCollections(collections) {
  const types = new Set();
  collections.forEach((l) => {
    types.add(l.Type);
  });
  return Array.from(types);
}

function CollectionsFilters() {
  const allCollectionRequest = useContext(AllCollectionContext);
  const [filterState, setFilterState] = useContext(CollectionFilteringContext);
  const types = allCollectionRequest.succeeded
    ? getTypeSetFromCollections(allCollectionRequest.data.collections)
    : [];

  function setFilter(filterName) {
    return debounce(function() {
      filterState[filterName] = this.value || null;
      setFilterState(filterState);
    }, 200);
  }

  return html`
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/nlundquist/nre-styles@latest/dist/styles.css" />
    <style>
      :host {
        display: flex;
      }     
      :host > label {
        flex-grow: 1;
      }
      :host > label:not(:first-of-type) {
        margin-left: 30px;
      }
    </style>
    <label>
      <span>Filter by</span>
      <input type="text" placeholder="Name"
          @keyup=${setFilter('searchString')} 
          @change=${setFilter('searchString')} />
    </label>
  
    <label>
      <span>Type</span>
      <div>
        <antidote-select
            placeholder="Type"
            .options=${types} 
            .change=${setFilter('Type')} />
      </div>
    </label>
  `;
}

customElements.define('antidote-collections-filters', component(CollectionsFilters));

export default CollectionsFilters;