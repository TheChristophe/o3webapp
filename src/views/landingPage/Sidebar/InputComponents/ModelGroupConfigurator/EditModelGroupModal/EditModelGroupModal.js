import React, { useState } from "react";
import { useDispatch } from "react-redux"
import { updatedModelGroup } from "../../../../../../store/modelsSlice"
import { Modal, Card, Button, Grid } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import models from "./models"
import SearchBar from "../SearchBar/SearchBar";
import { styled } from '@mui/material/styles';

const StyledDataGrid = styled(DataGrid)(({theme}) => ({
    height: "85%",
    marginTop: "3%",
}));

const StyledSearchBar= styled(SearchBar)(({theme}) => ({
    width: "35%",
}));


const rows = [];
const regex= /([a-z]|[A-Z]|[0-9]|-)*/g;

for(let i = 0; i < models.length; i++) {
    const model = models[i];
    const info = model.match(regex);
    rows.push({
        'model': info[0],
        'institute': info[2],
        'dataset + model': info[4],
        'id': i,
        'include in median': "included",
        'include in mean': 'included',
        'include in percentile': 'included',
        'include in derivative': 'included',
        'visible': 'Yes'
    })
}

/**
 * opens a modal where the user can edit an existing model group
 * @param {Object} props 
 * @param {function} props.onClose -> function to call if modal should be closed
 * @param {boolean} props.isOpen -> boolean whether the modal should be visible 
 * @param {function} props.reportError -> error function
 * @param {int} props.modelGroupId -> id of the model group
 * @returns a jsx containing a modal with a data grid with all models from the model group
 */
function EditModelGroupModal(props) {

    // const dispatch = useDispatch()

    let i = props.onClose;
    i = props.isOpen;
    i = props.reportError;
    i = props.modelGroupId;

    const [filteredRows, setFilteredRows] = React.useState(rows);

    // dispatch(updatedModelGroup(someData))

    const cardStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        height: '80%',
        bgcolor: "#FFFFFF",
        boxShadow: 24,
        p: 4,
    };

    
    //const makeRepeated = (arr, repeats) => Array.from({ length: repeats }, () => arr).flat();

    //rows = makeRepeated(rows, 10);

    const columns = [
        { field: 'id', headerName: 'ID', width: 90, hide: true },
        { field: 'model', headerName: 'Model', width: 90 },
        {
          field: 'institute',
          headerName: 'Institute',
          width: 90,
          editable: true,
        },
        {
          field: 'dataset + model',
          headerName: 'Dataset + model',
          width: 200,
          editable: true,
        },
        {
            field: 'include in median',
            headerName: 'median',
            width: 90,
            editable: true,
          },
          {
            field: 'include in mean',
            headerName: 'mean',
            width: 90,
            editable: true,
          },
          {
            field: 'include in derivative',
            headerName: 'derivative',
            width: 120,
            editable: true,
          },
          {
            field: 'include in percentile',
            headerName: 'percentile',
            width: 120,
            editable: true,
          },
          {
            field: 'visible',
            headerName: 'visible',
            width: 90,
            editable: true,
          }
    ];

    const foundIndices = (indexArray) => {
        setFilteredRows(indexArray.map(idx => rows[idx])); // translates indices into selected rows
    }

    return (
        <>
        {props.isOpen && 

            <Modal 
                open={props.isOpen}
                onClose={props.onClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Card sx={cardStyle}>
                    
                    <StyledSearchBar 
                        inputArray={rows}
                        foundIndicesCallback={foundIndices}
                    />
                    <StyledDataGrid 
                            rows={filteredRows}
                            columns={columns}
                            pageSize={100}
                            rowsPerPageOptions={[5]}
                            // hideFooter
                            // autoHeight
                            disableSelectionOnClick
                            disableColumnMenu
                            disableColumnSelector
                    />
                    
                    <Grid container alignItems="flex-end" justifyContent="flex-end">
                        <Button onClick={props.onClose} size="small" style={{marginRight: "2em"}}>Close Modal</Button>
                    </Grid>
                </Card>

            </Modal>
        }
        </>
    );
}

export default EditModelGroupModal;