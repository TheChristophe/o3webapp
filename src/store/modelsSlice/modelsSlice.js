import { createSlice } from "@reduxjs/toolkit";

/**
 * The statistical values that are computable are listed here as
 * an "enum"
 */
const STATISTICAL_VALUES = ["mean", "median", "derivative", "percentile"];

/**
 * The initial state of the modelSlice defines the data structure in the 
 * store. Each plot has its own data i.e. have separate model(groups).
 * 
 * IF you change this initial state you have to adapt the first test in the
 * corresponding test file, that tests the initial state.
 */
const initialState = {
    modelGroupList: ["all"],
    // currently active plot
    modelGroups: {
        // this objects holds key-value-pairs, the keys being the model-group 
        // identifier and the values being the settings for each group 
        "all": { 
            // model group storing all information until it is possible 
            // to implement more model groups
            name: "All OCTS models",
            modelList: ["CCMI-1_ACCESS_ACCESS-CCM-refC2"],
            models: { // models is lookup table
                "CCMI-1_ACCESS_ACCESS-CCM-refC2": { // single model
                    color: null, // if not set it defaults to standard value from api
                    isVisible: true, // show/hide individual models from a group
                    mean: true,
                    derivative: true,
                    median: true,
                    percentile: true,
                }
            },
            hidden: false, // show/hide complete group
            visibileSV: { // lookup table so the reducer impl. can be more convenient
                mean: true,
                derivative: true,
                median: true,
                percentile: true,
            }
        }
    },
}

/**
 * The modelSlice is generated by the redux toolkit. The reducers are defined here
 * and the corresponding actions are auto-generated.
 */
const modelsSlice = createSlice({
    name: "models",
    initialState,
    reducers: {

        /**
         * This reducer accepts an action object returned from addModels()
         *     e.g. dispatch(addModels(
         *          {newModelList: ["CCMI-1_ACCESS_ACCESS-CCM-refC2"]}
         *      ))
         * and calculates the new state based on the action and the action 
         * data given in action.payload.
         * 
         * In this case the given models are added to the current list of models
         * (NOT implemented yet! and the model data in the corresponding lookup table is filled with
         * default values)
         * 
         * @param {object} state the current store state of: state/plot
         * @param {object} action accepts the action returned from addModels()
         * @param {object} action.payload the payload is an object containg the given data
         * @param {string} action.payload.groupId a string specifying the group to which the data should be added
         * @param {array} action.payload.newModelList an array of strings specifying the models that should be added
         */
        addModels(state, action) { 
            const { groupId, newModelList }  = action.payload;
            const activeSettings = state.settings[state.plotId];
            const selectedGroup = activeSettings[groupId];
            const activeModelList = selectedGroup.modelList;


            if (selectedGroup === undefined) {
                throw `Tried to access model-group with groupID "${groupId}" that is not yet defined!`;
            }

            // Add model to modelList if it is not already included
            for (var i = 0; i < newModelList.length; i++) {
                if (activeModelList.indexOf(newModelList[i]) !== -1) {
                    continue;
                }

                activeModelList.push(newModelList[i]);
            }

            // ---------------------------------------------------------
            // TODO: Add Model information to the model lookup table
            //
            // ---> idea: add model information with default settings
            // do not store additional information that is provided by
            // the api such as institute of the model and datasets but
            // instead reference the cached (?) data (-> we probably 
            // need an extra api slice at some time)
            // ---------------------------------------------------------

        },

        /**
         * This reducer accepts an action object returned from removeModels()
         *      e.g. dispatch(removeModels(
         *          {removeModelList: ["CCMI-1_ACCESS_ACCESS-CCM-refC2"]}
         *      ))
         * and calculates the new state based on the action and the action 
         * data given in action.payload.
         * 
         * In this case the given models are removed from the model list 
         * and the corresponding data in the lookup table is deleted.
         * 
         * @param {object} state the current store state of: state/plot
         * @param {object} action accepts the action returned from removeModels()
         * @param {object} action.payload the payload is an object containg the given data
         * @param {string} action.payload.groupdId a string specifying the group from which the models should be removed
         * @param {array} action.payload.removeModelList an array of strings specifying the models that should be removed
         */
        removeModels(state, action) { 
            const { groupId, removeModelList }  = action.payload;
            const activeSettings = state.settings[state.plotId];
            const selectedGroup = activeSettings[groupId];

            if (selectedGroup === undefined) {
                throw `Tried to access model-group with groupID "${groupId}" that is not yet defined!`;
            }

            selectedGroup.modelList = selectedGroup.modelList.filter(item => !removeModelList.includes(item))
            removeModelList.forEach(
                model => delete selectedGroup.models[model]
            )
        },

        /**
         * This reducer accepts an action object returned from updateModelGroup()
         *      e.g. dispatch(updateModelGroup({}))
         * and calculates the new state based on the action and the action 
         * data given in action.payload.
         * 
         * TODO: should be adjusted to match the UI in ModelGroupConfigurator and AddModalGroup
         * 
         * @param {object} state the current store state of: state/plot
         * @param {object} action accepts the action returned from updateModelGroup()
         * @param {object} action.payload the payload is an object containg the given data
         */
        updatedModelGroup(state, action) { }, // implementing this requires more knowledge about the UI
        
        /**
         * This reducer accepts an action object returned from addModelGroup()
         *       e.g. dispatch(addModelGroup({}))
         * and calculates the new state based on the action and the action 
         * data given in action.payload.
         * 
         * TODO: should be adjusted to match the UI in ModelGroupConfigurator and AddModalGroup
         * 
         * @param {object} state the current store state of: state/plot
         * @param {object} action accepts the action returned from addModelGroup()
         * @param {object} action.payload the payload is an object containg the given data
         */
        addedModelGroup(state, action) { },

        /**
         * This reducer accepts an action object returned from setVisibility()
         *       e.g. dispatch(setVisibility(
         *          {groupID: "all", modelID: "CCMI-1_ACCESS_ACCESS-CCM-refC2", isVisible: false}
         *       ))
         * and calculates the new state based on the action and the action 
         * data given in action.payload.
         * 
         * In this case the visibility of a given model in the given group is set
         * to the new value.
         * 
         * @param {object} state the current store state of: state/plot
         * @param {object} action accepts the action returned from updateModelGroup()
         * @param {object} action.payload the payload is an object containg the given data
         * @param {string} action.payload.groupID a string specifying the group of the target model
         * @param {string} action.payload.modelID a string specifying the target model
         * @param {boolean} action.payload.isVisible is the model visible as boolean
         */
        setVisibility(state, action) { 
            const { groupID, modelID, isVisible } = action.payload;
            const activeSettings = state.settings[state.plotId];
            const activeModel = activeSettings[groupID].models[modelID];
            if (activeModel === undefined) {
                throw `tried to access model with modelID "${modelID}" that is not yet defined!`;
            } 
            activeModel.isVisible = isVisible;
        },

        /**
         * This reducer accepts an action object returned from setStatisticalValuesIncluded()
         *      e.g. dispatch(setVisibility(
         *          {groupID: "all", modelID: "CCMI-1_ACCESS_ACCESS-CCM-refC2", svType: "mean", isIncluded: true}
         *       ))
         * and calculates the new state based on the action and the action 
         * data given in action.payload.
         * 
         * In this case for a given model is set whether it should be included
         * in the calculation of the given statistical value (SV).
         * 
         * @param {object} state the current store state of: state/plot
         * @param {object} action accepts the action returned from updateModelGroup()
         * @param {object} action.payload the payload is an object containg the given data
         * @param {string} action.payload.groupID a string specifying the group of the target model
         * @param {string} action.payload.modelID a string specifying the target model
         * @param {string} action.payload.svType the SV as a string
         * @param {boolean} action.payload.isIncluded should the model be included for the given SV
         */
        setStatisticalValueIncluded(state, action) { // this is for an individual model
            // svType has to be a string of the form: 
            // mean | derivative | median | percentile
            const { groupID, modelID, svType, isIncluded } = action.payload;
            const activeSettings = state.settings[state.plotId];
            const activeModel = activeSettings[groupID].models[modelID];
            if (activeModel === undefined) {
                throw `tried to access model with modelID "${modelID}" that is not yet defined!`;
            }
            if (!STATISTICAL_VALUES.includes(svType)) { // svType doesn't represent a valid statistical value
                throw `tried to set statistial value "${svType}" that is not a valid statistical value (${STATISTICAL_VALUES.join("|")})`;
            }
            activeModel[svType] = isIncluded;
        },

        /**
         * This reducer accepts an action object returned from setStatisticalValueForGroup()
         *      e.g. dispatch(setStatisticalValueForGroup(
         *          {groupID: "all", svType: "median", isIncluded: true}
         *      ))
         * and calculates the new state based on the action and the action 
         * data given in action.payload.
         * 
         * In this case for a given group is set whether the given statistical values (SV)
         * should be displayed.
         * 
         * @param {object} state the current store state of: state/plot
         * @param {object} action accepts the action returned from updateModelGroup()
         * @param {object} action.payload the payload is an object containg the given data
         * @param {string} action.payload.groupID a string specifying the group
         * @param {string} action.payload.svType the SV as a string
         * @param {boolean} action.payload.isIncluded should the SV be displayed for the given group
         */
        setStatisticalValueForGroup(state, action) { // this is for an entire group
            const { groupID, svType, isIncluded } = action.payload;
            const activeSettings = state.settings[state.plotId];
            if (!STATISTICAL_VALUES.includes(svType)) { // svType doesn't represent a valid statistical value
                throw `tried to set statistial value "${svType}" that is not a valid statistical value (${STATISTICAL_VALUES.join("|")})`;
            }
            activeSettings[groupID].visibileSV[svType] = isIncluded;
        },
    }
})

/**
 * The here listed actions are exported and serve as an interface for
 * the view (our react components).
 */
export const { 
    addModels,
    removeModels,
    updatedModelGroup,
    addedModelGroup,
    setVisibility, 
    setStatisticalValueIncluded, 
    setStatisticalValueForGroup
} = modelsSlice.actions;

/**
 * The reducer combining all reducers defined in the plot slice. 
 * This has to be included in the redux store, otherwise dispatching 
 * the above defined actions wouldn't trigger state updates.
 */
export default modelsSlice.reducer;

/**
 * This function is a selector, i.e. it allows components to 
 * select only a specific piece of data from the store. In this
 * case an object holding all current model groups is returned.
 * 
 * @param {object} state the global redux state
 * @returns {object} an object holding all current model groups
 */
export const selectCurrentModelGroups = state => state.models[state.plot.plotId];
/**
 * This selectors allows components to select the a specific model group
 * from the store for the current active plot.
 * 
 * @param {object} state the global redux state
 * @param {string} groupId a string specifying what model group shall be returned
 * @returns {object} the model group with the given id
 */
export const selectCurrentModelGroup = (state, groupId) => state.models[state.plot.plotId][groupId];