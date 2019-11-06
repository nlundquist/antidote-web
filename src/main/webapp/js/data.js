import { html } from 'https://unpkg.com/lit-html@^1.0.0/lit-html.js';
import { State, useState, useEffect, useContext, createContext, component } from 'https://unpkg.com/haunted@^4.0.0/haunted.js';
import { syringeServiceRoot } from "./helpers/page-state.js";

// alternative to useFetch hook with modified logic that retries a request and
// doesn't enter the "completed" state until a request returns with the "READY"
// state
export function useLiveLessonDetails(liveLessonId) {
  const url = `${syringeServiceRoot}/exp/livelesson/${liveLessonId}`;
  const [requestState, setRequestState] = useState({
    data: null,
    pending: false,
    completed: false,
    succeeded: false,
    error: false,
  });

  useEffect(async () => {
    if (liveLessonId === null || liveLessonId === undefined) {
      return;
    }

    setRequestState({
      data: null,
      pending: true,
      completed: false,
      succeeded: false,
      error: false,
    });

    let attemptCount = 0;
    const fetchLoop = setInterval(async () => {
      if (attemptCount++ === 1200) {
        setRequestState({
          data: null,
          pending: false,
          completed: true,
          succeeded: false,
          error: 'Lesson initialization exceeded maximum attempts.'
        });
        clearInterval(fetchLoop);
      }

      try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.LiveLessonStatus === 'READY') {
          setRequestState({
            data,
            pending: false,
            completed: true,
            succeeded: true,
            error: false
          });
          clearInterval(fetchLoop);
        } else {
          setRequestState({
            data,
            pending: true,
            completed: false,
            succeeded: false,
            error: false
          });
        }
      } catch (e) {
        setRequestState({
          data: null,
          pending: false,
          completed: true,
          succeeded: false,
          error: e.message,
        });
        clearInterval(fetchLoop);
      }
    }, 500);
  }, [liveLessonId]);

  return requestState;
}

export const LessonContext = createContext({});
export const LiveLessonContext = createContext({});
export const LiveLessonDetailsContext = createContext({});
export const AllLessonContext = createContext({});
export const LessonFilteringContext = createContext([]);
export const AllCollectionContext = createContext({});
export const CollectionFilteringContext = createContext([]);
export const CoursePlanNameContext = createContext([]);
export const CoursePlanStrengthsContext = createContext([]);
export const LessonPrereqContext = createContext([]);

customElements.define('antidote-lesson-context-provider', LessonContext.Provider);
customElements.define('antidote-live-lesson-context-provider', LiveLessonContext.Provider);
customElements.define('antidote-live-lesson-details-context-provider', LiveLessonDetailsContext.Provider);
customElements.define('antidote-all-lesson-context-provider', AllLessonContext.Provider);
customElements.define('antidote-lesson-filtering-context-provider', LessonFilteringContext.Provider);
customElements.define('antidote-all-collection-context-provider', AllCollectionContext.Provider);
customElements.define('antidote-collection-filtering-context-provider', CollectionFilteringContext.Provider);
customElements.define('antidote-course-plan-name-context-provider', CoursePlanNameContext.Provider);
customElements.define('antidote-course-plan-strengths-context-provider', CoursePlanStrengthsContext.Provider);
customElements.define('antidote-lesson-prereq-context-provider', LessonPrereqContext.Provider);