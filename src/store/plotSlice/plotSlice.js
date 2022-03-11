import {createSlice} from "@reduxjs/toolkit";
import {ALL_REGIONS_ORDERED, O3AS_PLOTS} from "../../utils/constants";

/** These months are selected when the webapp starts
 * @constant {array}
 * @category store
 * @subcategory plotSlice
 */
const DEFAULT_MONTHS = [1, 2, 12];

/**
 * The initial state of the plotSlice defines the data structure in the
 * store. Each plot has its own settings i.e. title, location etc.
 *
 * IF you change this initial state you have to adapt the first test in the
 * corresponding test file, that tests the initial state.
 */
export const initialState = {

    plotId: "tco3_zm", // the currently active plot
    // maps plot ids to their settings
    generalSettings: {
        location: {
            minLat: -90,
            maxLat: 90
        },
        months: DEFAULT_MONTHS,
    },

    plotSpecificSettings: {
        "tco3_zm": {
            title: "OCTS Plot", // the title shown in the apexcharts generated chart
            displayXRange: {
                years: {
                    minX: 1960,
                    maxX: 2100,
                }
            },
            displayYRange: {
                minY: 280,
                maxY: 330,
            },
        },
        "tco3_return": {
            title: "Return/Recovery Plot",
            displayXRange: {
                regions: ALL_REGIONS_ORDERED.map((el, idx) => idx), // implicitly refers to ALL_REGIONS_ORDERED
            },
            displayYRange: {
                minY: 2000,
                maxY: 2100,
            },
        }
    }
};

/**
 * The plotSlice is generated by the redux toolkit. The reducers are defined here
 * and the corresponding actions are auto-generated.
 */
const plotSlice = createSlice({
    name: "plot",
    initialState,
    reducers: {

        /**
         * This reducer accepts an action object returned from setActivePlotId()
         *     e.g. dispatch(setActivePlotId({id: "tco3_zm"}))
         * and calculates the new state based on the action and the action
         * data given in action.payload.
         *
         * In this case the active plotId is set to the given string.
         *
         * @param {object} state the current store state of: state/plot
         * @param {object} action accepts the action returned from setActivePlotId()
         * @param {object} action.payload the payload is an object containing the given data
         * @param {string} action.payload.plotId a string that contains the new plot id
         */
        setActivePlotId(state, action) {
            const {plotId} = action.payload;
            state.plotId = plotId;
        },

        /**
         * This reducer accepts an action object returned from setTitle()
         *     e.g. dispatch(setTitle({title: "OCTS Plot Title"}))
         * and calculates the new state based on the action and the action
         * data given in action.payload.
         *
         * In this case the current plot title is set to the given string.
         *
         * @param {object} state the current store state of: state/plot
         * @param {object} action accepts the action returned from setTitle()
         * @param {object} action.payload the payload is an object containing the given data
         * @param {string} action.payload.id a string that contains the new plot title
         */
        setTitle(state, action) {
            const {title} = action.payload;
            state.plotSpecificSettings[state.plotId].title = title;
        },

        /**
         * This reducer accepts an action object returned from setLocation()
         *     e.g. dispatch(setLocation({minLat: -90, maxLat: 90}))
         * and calculates the new state based on the action and the action
         * data given in action.payload.
         *
         * In this case the current plot location is set with the provided
         * new latitude values.
         *
         * @param {object} state the current store state of: state/plot
         * @param {object} action accepts the action returned from setTitle()
         * @param {object} action.payload the payload is an object containing the given data
         * @param {number} action.payload.minLat a number specifying the minimum latitude
         * @param {number} action.payload.maxLat a number specifying the maximum latitude
         */
        setLocation(state, action) {
            const {minLat, maxLat} = action.payload;
            const location = state.generalSettings.location;
            location.minLat = minLat;
            location.maxLat = maxLat;
        },

        /**
         * This reducer accepts an action object returned from setDisplayXRange()
         *     e.g. dispatch(setDisplayXRange({minX: 1960, maxX: 2100}))
         * and calculates the new state based on the action and the action
         * data given in action.payload.
         *
         * In this case the current displayXRange is updated with the given min and max
         * x values.
         *
         * NOTE: this might not be useful for each plot (e.g. the Return/Recovery plot
         *       because this plot uses a categorical x-axis)
         *       however it is most convenient to provide a uniform action interface.
         *
         * @param {object} state the current store state of: state/plot
         * @param {object} action accepts the action returned from setDisplayXRange()
         * @param {object} action.payload the payload is an object containing the given data
         * @param {number} action.payload.minX a number specifying the start of the x range
         * @param {number} action.payload.maxX a number specifying the end of the x range
         */
        setDisplayXRange(state, action) {
            const currentPlotId = state.plotId;
            if (currentPlotId === O3AS_PLOTS.tco3_zm) {
                const {years: {minX, maxX}} = action.payload;
                const xRange = state.plotSpecificSettings[currentPlotId].displayXRange;
                xRange.years.minX = minX;
                xRange.years.maxX = maxX;
            } else if (currentPlotId === O3AS_PLOTS.tco3_return) {
                const {regions} = action.payload;
                state.plotSpecificSettings[currentPlotId].displayXRange.regions = regions;
            } else {
                throw new Error(`Illegal internal state, a non valid plot is current plot: "${currentPlotId}"`);
            }
        },

        /**
         * This reducer accepts an action object returned from setDisplayYRange()
         *     e.g. dispatch(setDisplayYRange({minY: 200, maxY: 400}))
         * and calculates the new state based on the action and the action
         * data given in action.payload.
         *
         * In this case the current displayYRange is updated with the given min and max
         * y values.
         *
         * @param {object} state the current store state of: state/plot
         * @param {object} action accepts the action returned from setDisplayYRange()
         * @param {object} action.payload the payload is an object containing the given data
         * @param {number} action.payload.minY a number specifying the start of the y range
         * @param {number} action.payload.maxY a number specifying the end of the y range
         */
        setDisplayYRange(state, action) {
            const {minY, maxY} = action.payload;
            if (minY === null || maxY === null) return;
            if (!Number.isFinite(minY) || !Number.isFinite(maxY)) return;
            if (isNaN(minY) || isNaN(maxY)) return;

            const displayYRange = state.plotSpecificSettings[state.plotId].displayYRange;
            displayYRange.minY = minY;
            displayYRange.maxY = maxY;
        },

        setDisplayYRangeForPlot(state, action) {
            const {minY, maxY, plotId} = action.payload;
            if (minY === null || maxY === null) return;
            if (!Number.isFinite(minY) || !Number.isFinite(maxY)) return;
            if (isNaN(minY) || isNaN(maxY)) return;

            const displayYRange = state.plotSpecificSettings[plotId].displayYRange;
            displayYRange.minY = minY;
            displayYRange.maxY = maxY;
        },

        /**
         * This reducer accepts an action object returned from setMonths()
         *     e.g. dispatch(setMonths({months: [3, 4, 5]}))
         * and calculates the new state based on the action and the action
         * data given in action.payload.
         *
         * In this case the current selected months are updated to the given array.
         *
         * @param {object} state the current store state of: state/plot
         * @param {object} action accepts the action returned from setMonths()
         * @param {object} action.payload the payload is an object containing the given data
         * @param {array} action.payload.months an array of integers describing the new months
         */
        setMonths(state, action) {
            state.generalSettings.months = action.payload.months;
        },

        /**
         * This reducer accepts an action object returned from setUserRegionName()
         *     e.g. dispatch(setUserRegionName('(-90°S, 90°N)'))
         * and updates the state accordingly.
         *
         * @param {object} state the current store state of: state/plot
         * @param {object} action accepts the action returned from setUserRegionName()
         * @param {object} action.payload the payload is an object containing the given data
         */
        setUserRegionName(state, action) {
            state.plotSpecificSettings.tco3_return.userRegionName = action.payload;
        }
    }
})


/**
 * The here listed actions are exported and serve as an interface for
 * the view (our React components).
 */
export const {
    setActivePlotId,
    setTitle,
    setLocation,
    setDisplayXRange,
    setDisplayYRange,
    setDisplayYRangeForPlot,
    setMonths,
    setUserRegionName,
} = plotSlice.actions

/**
 * The reducer combining all reducers defined in the plot slice.
 * This has to be included in the redux store, otherwise dispatching
 * the above defined actions wouldn't trigger state updates.
 */
export default plotSlice.reducer;

/**
 * This selector allows components to select the current plot id
 * from the store. The plot id is a string using the same naming as the
 * o3as api e.g. tco3_zm or tco3_return
 *
 * @param {object} state the global redux state
 * @returns {string} the current active plot id
 */
export const selectPlotId = state => state.plot.plotId;

/**
 * This selector allows components to select the current plot title
 * from the store.
 *
 * @param {object} state the global redux state
 * @returns {string} the current active plot title
 */
export const selectPlotTitle = state => state.plot.plotSpecificSettings[state.plot.plotId].title;

/**
 * This selector allows components to select the current plot location
 * from the store. The location is an object containing a minLat and maxLat attribute.
 *
 * @param {object} state the global redux state
 * @returns {object} holds the current location that includes a minLat and maxLat attribute.
 */
export const selectPlotLocation = state => state.plot.generalSettings.location;

/**
 * This selector allows components to select the current x range
 * from the store.
 *
 * @param {object} state the global redux state
 * @returns {object} holds the current x range that includes minX and maxX
 */
export const selectPlotXRange = state => state.plot.plotSpecificSettings[state.plot.plotId].displayXRange;

/**
 * This selector allows components to select the current y range
 * from the store.
 *
 * @param {object} state the global redux state
 * @returns {object} holds the current x range that includes minY and maxY
 */
export const selectPlotYRange = state => state.plot.plotSpecificSettings[state.plot.plotId].displayYRange;

/**
 * This selector allows components to select the current selected months
 * from the store.
 *
 * @param {object} state the global redux state
 * @returns {array} array of integers describing the current selected months
 */
export const selectPlotMonths = state => state.plot.generalSettings.months;

/**
 * This selector allows components to select the current user region name.
 *
 * @param {object} state the global redux state
 * @returns {string} the user region name
 */
export const selectUserRegionName = state => state.plot.plotSpecificSettings.tco3_return.userRegionName;