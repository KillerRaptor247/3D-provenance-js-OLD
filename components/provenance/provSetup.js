import { initProvenance, createAction } from "@visdesignlab/trrack";
import { atom } from "jotai";
import React, {useState} from "react"



// Create function to pass to the ProvVis library for when a node is selected in the graph.
// For our purposes, were simply going to jump to the selected node.
/*export const visCallback = (newNode) => {
    prov.goToNode(newNode);
};*/

//export const prov = initProvenance(provState, { loadFromUrl: false });