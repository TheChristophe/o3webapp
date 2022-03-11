import {createSlice} from "@reduxjs/toolkit";

export const DEFAULT_REF_MODEL = "SBUV_GSFC_merged-SAT-ozone";
export const DEFAULT_REF_YEAR = 1980;

/**
 * The initial state of the referenceSlice defines the data structure in the
 * store. Each reference setting has its own settings i.e. title, ref Year etc.
 *
 * If you change this initial state you have to adapt the first test in the
 * corresponding test file, that tests the initial state.
 */
const initialState = {

    settings: {
        year: DEFAULT_REF_YEAR,
        model: DEFAULT_REF_MODEL,
        visible: true,
        isOffsetApplied: false,
    },

};


/**
 * The referenceSlice is generated by the redux toolkit. The reducers are defined here
 * and the corresponding actions are auto-generated.
 */
const referenceSlice = createSlice({
    name: "reference",
    initialState,
    reducers: {
        /**
         * This reducer accepts an action object returned from setYear()
         *     e.g. dispatch(setYear({year: 1980}))
         * and calculates the new state based on the action and the action
         * data given in action.payload.
         *
         * In this case the current year is set to the given year.
         *
         * @param {object} state the current store state of: state/reference
         * @param {object} action accepts the action returned from setYear()
         * @param {object} action.payload the payload is an object containing the given data
         * @param {number} action.payload.year a number that contains the new year.
         */
        setYear(state, action) {
            const {year} = action.payload;
            state.settings.year = year;
        },

        /**
         * This reducer accepts an action object returned from setModel()
         *     e.g. dispatch(setModel({model: "CCMI-1_CCCma_CMAM-refC2"}))
         * and calculates the new state based on the action and the action
         * data given in action.payload.
         *
         * In this case the current model is set to the given model.
         *
         * @param {object} state the current store state of: state/reference
         * @param {object} action accepts the action returned from setModel()
         * @param {object} action.payload the payload is an object containing the given data
         * @param {string} action.payload.id a string that contains the new reference model name.
         */
        setModel(state, action) {
            const {model} = action.payload;
            state.settings.model = model;
        },

        /**
         * This reducer accepts an action object returned from setVisibility()
         *     e.g. dispatch(setVisibility({visible: true}))
         * and calculates the new state based on the action and the action
         * data given in action.payload.
         *
         * In this case the current visibility is set to the given visibility.
         *
         * @param {object} state the current store state of: state/reference
         * @param {object} action accepts the action returned from setVisibility()
         * @param {object} action.payload the payload is an object containing the given data
         * @param {boolean} action.payload.visible the boolean for the reference line visibility.
         */
        setVisibility(state, action) {
            const {visible} = action.payload;
            state.settings.visible = visible;
        },

        /**
         * This reducer accepts an action object returned from setOffsetApplied()
         *     e.g. dispatch(setOffsetApplied({isOffsetApplied: true}))
         * and calculates the new state based on the action and the action
         * data given in action.payload.
         *
         * In this case the current offset status  is set to the given offset status.
         *
         * @param {object} state the current store state of: state/reference
         * @param {object} action accepts the action returned from setOffsetApplied()
         * @param {object} action.payload the payload is an object containing the given data
         * @param {boolean} action.payload.isOffsetApplied the boolean for the offset status.
         */
        setOffsetApplied(state, action) {
            const {isOffsetApplied} = action.payload;
            state.settings.isOffsetApplied = isOffsetApplied;
        },
    },
});

/**
 * The here listed actions are exported and serve as an interface for
 * the view (our React components).
 */
export const {
    setYear,
    setModel,
    setVisibility,
    setOffsetApplied,
} = referenceSlice.actions;

/**
 * The reducer combining all reducers defined in the reference slice.
 * This has to be included in the redux store, otherwise dispatching
 * the above defined actions wouldn't trigger state updates.
 */
export default referenceSlice.reducer;


/**
 * This selector allows components to select the current reference year
 * from the store.
 *
 * @param {object} state the global redux state
 * @returns {number} the current active reference year
 */
export const selectRefYear = (state) =>
    state.reference.settings.year;

/**
 * This selector allows components to select the current reference model
 * from the store.
 *
 * @param {object} state the global redux state
 * @returns {string} the current active reference model
 */
export const selectRefModel = (state) =>
    state.reference.settings.model;

/**
 * This selector allows components to select the current visibility of the reference line
 * from the store.
 *
 * @param {object} state the global redux state
 * @returns {boolean} the current visibility of the reference line.
 */
export const selectVisibility = (state) =>
    state.reference.settings.visible;

/**
 * This selector allows components to select the current status of the offset
 * from the store.
 *
 * @param {object} state the global redux state
 * @returns {boolean} the current status of the offset.
 */
export const selectIsOffsetApplied = (state) =>
    state.reference.settings.isOffsetApplied;