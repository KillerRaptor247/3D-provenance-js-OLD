import { initProvenance, createAction } from "@visdesignlab/trrack";
import React, {
    useState,
    useCallback,
    useEffect,
    useMemo,
    useRef,
} from "react";
import ForceGraph3D, { ForceGraphMethods } from "react-force-graph-3d";
import { useAtom, atom } from "jotai";
import { ProvVisCreator } from "@visdesignlab/trrack-vis";
//import {initializeTrrack, Registry } from "@trrack/core";

import myData from "../../data/data.json";

/*
 * TODO: Fix Target Container is not a DOM Element on line 59
 * */

// Graph Generation
const GraphComponent = ({ graphRef }) => {
    const [selectedNode, setSelectedNode] = useState();
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [prov, setProv] = useState();
    const [provState, setProvState] = useState({ node: null });

    const AtomNotInitialized = new Error("This atom has not been initialized");
    let initCoordsAtom = atom({ x: null, y: null, z: null });
    let initRotationAtom = atom(AtomNotInitialized);

    const [initCoords, setInitCoords] = useAtom(initCoordsAtom);
    const [initRotation, setInitRotation] = useAtom(initRotationAtom);

    const nodes = myData.nodes.map((node) => node.id);

    const provRef = useRef(null);

    useEffect(() => {
        setDimensions({
            width: window.innerWidth,
            height: window.innerHeight,
        });

        let { x, y, z } = graphRef.current.cameraPosition();

        setInitCoords({ x, y, z });
        setInitRotation(graphRef.current.camera().quaternion);

        // Setup ProvVis once initially
        prov = initProvenance(provState, { loadFromUrl: false });
        prov.addObserver((provState) => provState.node, selectAction);
        prov.done();
        setProv(prov);
        ProvVisCreator(provRef.current, prov);
    }, []);

    const selectAction = createAction((state) => {
        setProvState((provState) => ({ ...provState, node: selectedNode }));
        console.log(`${provState.node} Selected`);
        console.log(JSON.stringify(provState.node));
        console.log(JSON.stringify(selectedNode));
        //selectAction.setLabel(`${state.node} Selected`);
        //prov.apply(selectAction(selectedNode));
        //setSelectedNode(state.node);
    }).setLabel("Select");

    const handleNodeClick = useCallback(
        (node) => {
            if (node != null) {
                setSelectedNode(node);
                prov.apply(selectAction(node));
                console.log(JSON.stringify(node));
                const distance = 100;
                const distRatio =
                    1 + distance / Math.hypot(node.x, node.y, node.z);
                if (graphRef.current) {
                    graphRef.current.cameraPosition(
                        {
                            x: node.x * distRatio,
                            y: node.y * distRatio,
                            z: node.z * distRatio,
                        },
                        node,
                        1500
                    );
                }

                const event = new CustomEvent("nodeClick", {
                    detail: { node: node },
                });
                document.dispatchEvent(event);
            }
        },
        [graphRef, prov, selectAction]
    );

    // Create function to pass to the ProvVis library for when a node is selected in the graph.
    // For our purposes, were simply going to jump to the selected node.
    /*const visCallback = (newNode) => {
        prov.goToNode(newNode);
    };*/

    // Normally this would work if there was an index.html file but we don't have that
    // How would I reference this provDiv I am using in home-page.js?
    // This function below is a void function that creates a visual tree based on the provenance
    // The first argument should take an Element object. I want to reference an Element in a different
    // file: home-page.js in a div that I have given the id=provDiv
    // If this helps here is how it would normally be called it my old typescript project where it was being referenced correctly:
    // ProvVisCreator(document.getElementById('provDiv')!, prov, visCallback);
    // and this would be the div being referenced in the index.html of that project
    //   <div id="parent">
    //     <svg width="0" height="0"><div id="graph"></div></svg>
    //     <div id="provDiv"></div>
    //   </div>
    // I want to implement the equivalence of this using React but I'm just referencing things incorrectly

    const Graph = (
        <>
            <div
                ref={provRef}
                id="root"
                className="absolute z-50 top-0 right-0"
            ></div>
            <ForceGraph3D
                graphData={myData}
                nodeLabel="name"
                ref={graphRef}
                // select the node on left click
                onNodeClick={handleNodeClick}
                onNodeRightClick={(node, e) => {
                    setSelectedNode(node);
                    console.log(node);
                }}
                backgroundColor={"rgba(0,0,0,0)"}
            ></ForceGraph3D>
        </>
    );

    return Graph;
};

export default GraphComponent;
