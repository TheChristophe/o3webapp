import React, {useEffect} from 'react';
import Chart from "react-apexcharts"
import {getOptions, generateSeries} from "../../../utils/optionsFormatter/optionsFormatter"
import {useSelector} from 'react-redux'
import {selectPlotId, selectPlotTitle, selectPlotXRange, selectPlotYRange} from '../../../store/plotSlice/plotSlice';
import {selectVisibility} from '../../../store/referenceSlice/referenceSlice';
import {REQUEST_STATE, selectActivePlotData} from '../../../services/API/apiSlice';
import {Typography, CircularProgress} from '@mui/material';
import {Alert, Link} from '@mui/material';
import {O3AS_PLOTS} from '../../../utils/constants';
import {APEXCHART_PLOT_TYPE, HEIGHT_LOADING_SPINNER, HEIGHT_GRAPH, NO_MONTH_SELECTED} from '../../../utils/constants';
import store from '../../../store/store';

/**
 * Currently there is no dynamic data linking. The graph will always
 * render the data from default-data.json in this folder. This is
 * just a preview to work with until the API is implemented and
 * synced with redux and the UI (input components).
 * @component
 * @param {object} props specified in propTypes
 * @returns a svg rendered element that represents a graph, this is done by
 *          the apexcharts library
 */
function Graph(props) {


    const plotId = useSelector(selectPlotId);
    const plotTitle = useSelector(selectPlotTitle);
    const xAxisRange = useSelector(selectPlotXRange);
    const yAxisRange = useSelector(selectPlotYRange);
    const activeData = useSelector(state => selectActivePlotData(state, plotId));
    const modelsSlice = useSelector(state => state.models);
    const refLineVisible = useSelector(selectVisibility);

    /**
     * Message to display if an error occured.
     * @constant {string}
     */
    const fatalErrorMessage = "CRITICAL: an internal error occurred that shouldn't happen!";

    /**
     * Message to display while data is being loaded
     * @constant {string}
     */
    const loadingMessage = "Loading Data...";
    
    /**
     * reportError function provided by props.
     * Stored separetly in order to pass it to useEffect
     * @constant {function}
     */
    const reportError = props.reportError;

    useEffect(() => { 
        // note: this is important, because we should only "propagate" the error to the top
        // if this component has finished rendering, causing no <em>side effects</em> in
        // its rendering process 
        if (activeData.status === REQUEST_STATE.error
            && activeData.error !== NO_MONTH_SELECTED) { // if no month selected the user already gets notified with a more decent warning
            reportError(activeData.error);
        }
    }, [activeData, reportError]);

    if (!(plotId in O3AS_PLOTS)) {
        const style = {
            color: "rgb(1, 67, 97)",
            backgroundColor: "rgb(229, 246, 253)",
            height: "200px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.5em"
        }
        return (
            <Alert severity="info" sx={style}>
                This plot type is not supported yet by the Webapp! But you can check it out at the <Link
                href="https://o3as.data.kit.edu/">O3as API</Link>.
            </Alert>
        );
    }

    if (activeData.status === REQUEST_STATE.loading || activeData.status === REQUEST_STATE.idle) {
        return (<div
            style={{display: "flex", alignItems: "center", justifyContent: "center", height: HEIGHT_LOADING_SPINNER}}>
            <div>
                <CircularProgress size={100}/> <br/>
                <Typography component="p">{loadingMessage}</Typography>
            </div>

        </div>);
    } else if (activeData.status === REQUEST_STATE.error) {
        return (
            <React.Fragment>
                <Typography style={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%"
                }}>Error: {activeData.error}</Typography>
            </React.Fragment>
        );
    } else if (activeData.status === REQUEST_STATE.success) {
        const {data, styling} = generateSeries({
            plotId,
            data: activeData.data,
            modelsSlice,
            xAxisRange,
            yAxisRange,
            refLineVisible,
            getState: store.getState
        });
        const seriesNames = data.map(series => series.name);
        const options = getOptions({
            plotId,
            styling,
            plotTitle,
            xAxisRange,
            yAxisRange,
            seriesNames,
            getState: store.getState
        });
        const uniqueNumber = Date.now(); // forces apexcharts to re-render correctly!
        return <Chart key={uniqueNumber} options={options} series={data} type={APEXCHART_PLOT_TYPE[plotId]}
                      height={HEIGHT_GRAPH}/>
    }

    // this "case" should not happen
    return <Typography>{fatalErrorMessage}</Typography>;
}

export default React.memo(Graph, () => true); // prevent graph from re-rendering if sidebar is opened and closed
