import React, {
    useState,
    useCallback,
    useEffect,
    useRef,
} from "react";
import { createAction} from "@visdesignlab/trrack";
import ForceGraph3D from "react-force-graph-3d";
import { useAtom } from "jotai";
import {
    initRotationAtom,
    initCoordsAtom,
    graphDataAtom,
    provenanceAtom,
    provStateAtom,
    provVisAtom,
} from "../../utils/atoms";
import { ProvVisCreator } from "@visdesignlab/trrack-vis";
//import {initializeTrrack, Registry } from "@trrack/core";

import myData from "../../data/data.json";

/*
 * TODO: Implement undo and redo functionality for provVis buttons
 * */

// Graph Generation
const GraphComponent = ({ graphRef }) => {

    const [selectedNode, setSelectedNode] = useState();
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [provenance, setProvenance] = useAtom(provenanceAtom);
    const [provState, setProvState] = useAtom(provStateAtom);

    const [initCoords, setInitCoords] = useAtom(initCoordsAtom);
    const [initRotation, setInitRotation] = useAtom(initRotationAtom);
    const provRef = useRef(provVisAtom);



    const [graphData] = useAtom(graphDataAtom);
    //const nodes = myData.nodes.map((node) => node.id);



    useEffect( () => {
        console.log("Prov Vis has been initialized");
        ProvVisCreator(provRef.current, provenance, (nodeID) => {
            console.log("Hey! Prov Node changed");
            console.log("The current provenance state node")
            console.log(provenance.state.node);
            setProvState(provenance.state.node);
            provenance.goToNode(nodeID)});
    }, []);

    useEffect( () => {
        if(provenance.state.node != null){
            const distance = 100;
            const distRatio =
                1 + distance / Math.hypot(provenance.state.node.x, provenance.state.node.y, provenance.state.node.z);
            graphRef.current.cameraPosition(
                {
                    x: provenance.state.node.x * distRatio,
                    y: provenance.state.node.y * distRatio,
                    z: provenance.state.node.z * distRatio
                },
                provenance.state.node,
                1500
            );

        }
    }, [provenance.state.node])

    useEffect(() => {
        console.log("Setting initial Camera");

        setDimensions({
            width: window.innerWidth,
            height: window.innerHeight,
        });

        let { x, y, z } = graphRef.current.cameraPosition();

        setInitCoords({ x, y, z });
        setInitRotation(graphRef.current.camera().quaternion);


    }, []);

    const selectCall = useCallback(
        (selectedNode) => {
            console.log("Inside Select Callback");
            const selectAction = createAction( (state) => {
                    console.log("Inside selectAction");
                    state.node = selectedNode;
                    console.log(state.node);
                },
            ).setLabel(`${selectedNode.name}` + " Selected");
            console.log("Here's the provenance state");
            console.log(provenance.state);
            provenance.apply(selectAction());
            setProvState( {node: selectedNode});
        } ,
        [provState]
    );



    // Graph handle node click event using useCallback function
    const handleNodeClick = useCallback(
        (node) => {
            if (node != null) {
                console.log("Handling Click Event");
                selectCall(node);
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
            }

        },
        [graphRef, provState]
    );

    useEffect(() => {

    }, []);


    const Graph = (
        <>
            <div
                ref={provRef}
                className="absolute z-50 top-0 right-0 text-white"
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
                backgroundColor={"rgba(128,128,128,.5)"}
            ></ForceGraph3D>
        </>
    );

    return Graph;
};

export default GraphComponent;
