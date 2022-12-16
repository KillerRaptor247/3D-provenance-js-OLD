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
    provVisAtom, undo, redo,
} from "../../utils/atoms";
import { ProvVisCreator } from "@visdesignlab/trrack-vis";
//import {initializeTrrack, Registry } from "@trrack/core";

import myData from "../../data/data.json";

/*
 * TODO: Implement Add node functionality on provenance backend
 * */

// Graph Generation
const GraphComponent = ({ graphRef }) => {

    const [selectedNode, setSelectedNode] = useState();
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [provenance, setProvenance] = useAtom(provenanceAtom);
    const [provState, setProvState] = useAtom(provStateAtom);
    const [anno, setAnno] = useState("");
    const [selection, setSelection] = useState("");
    const selectRef = useRef(document.activeElement);
    const topRef = useRef(document.getElementById("globalG"));

    const [initCoords, setInitCoords] = useAtom(initCoordsAtom);
    const [initRotation, setInitRotation] = useAtom(initRotationAtom);
    const provRef = useRef(provVisAtom);
    provenance.addObserver((provStateAtom) => provStateAtom, () => {
        if(provenance.state.selectNode != null){
            updateGraph(provenance.state.selectNode);
        }
    });
    provenance.done();

    const annoSubmit = useCallback((val) => {
        provenance.addAnnotation(val);
    }, [])

    const [graphData, setGraphData] = useAtom(graphDataAtom);
    //const nodes = myData.nodes.map((node) => node.id);



    useEffect( () => {
        console.log("Prov Vis has been initialized");
        ProvVisCreator(provRef.current,provenance, (nodeID) => {
            console.log("Hey! Prov Node changed");
            console.log("The current provenance state node")
            console.log(provenance.state.selectNode);
            console.log("The topSvg");
            topRef.current = document.getElementById("globalG");
            console.log(topRef.current);
            console.log(topRef.current.childNodes);
            setProvState(provenance.state.selectNode);
            selectRef.current = document.activeElement;
            setSelection(selectRef.current.tagName);
            console.log(selection);
            provenance.goToNode(nodeID);
            });
    });

    useEffect( () => {
        console.log("Inside selection change");
        //setSelection(document.activeElement);
        console.log(selectRef.current);
        const windowSelect = window.getSelection();
        console.log(windowSelect);

        switch (selection) {
            case "TEXTAREA":
                console.log("Text Area Selected");
                selectRef.current.style = "max-width: 130px; resize: none; color:#000000;";
                console.log(selectRef.current.getAttributeNames());
                console.log(provenance);
                provenance.addAnnotation(selectRef.current.value);
                console.log(selectRef.current.type);
                break;
            case "BUTTON":
                console.log("I'm a button");
                /*if (selection.innerHTML == "Annotate") {

                }
                console.log(document.activeElement.innerHTML);*/
                break;
            default:
                console.log("byebye");
                break;
        }
    }, [selection])

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
                    state.selectNode = selectedNode;
                    console.log(state.selectNode);
                },
            ).setLabel(`${selectedNode.id}` + " Selected");
            console.log("Here's the provenance state");
            console.log(provenance.state);
            provenance.apply(selectAction());
            //provenance.addAnnotation("");
            setProvState( {addNode: null, selectNode: selectedNode});
        },
        [provState]
    );

    const updateGraph = function (node) {
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

    // Graph handle node click event using useCallback function
    const handleNodeClick = useCallback(
        (node) => {
            if (node != null) {
                console.log("Handling Click Event");
                selectCall(node);
                updateGraph(node);
            }

        },
        [graphRef]
    );

    const createDummyNode = function(){
            const { nodes, links } = graphData;
            setGraphData({
                nodes: [...nodes, {"id": "sample-new-service", "nodeType": "service"}],
                links: [...links, {"source": "sample-new-service", "target": "ts-user-service"}]
            });
            console.log(graphData.nodes.length);
            console.log("Node Added!");

            const node = graphData.nodes[nodes.length - 1];
            console.log(node);
            selectCall(node);
            provenance.addAnnotation("New Node added!");

    };

    const addAnnotation = function (){
        console.log(anno);
        provenance.addAnnotation(anno);
        console.log(provenance);
        console.log(provRef.current);
    }

    function timeout(delay) {
        return new Promise( res => setTimeout(res, delay) );
    }

    const playMacro = async function () {
        let an = provenance.getLatestAnnotation();
        console.log(an);
        while (an.annotation != "End") {
            await timeout(1750);
            provenance.goForwardOneStep()
            an = provenance.getLatestAnnotation();
            while(an === undefined){
                await timeout(1750);
                provenance.goForwardOneStep()
                an = provenance.getLatestAnnotation();
            }
        }
    }


    const Graph = (
        <>
            <ForceGraph3D
                graphData={graphData}
                nodeLabel="id"
                ref={graphRef}
                // select the node on left click
                onNodeClick={handleNodeClick}
                onNodeRightClick={(node, e) => {
                    setSelectedNode(node);
                    console.log(node);
                }}
                enableNodeDrag={false}
                linkAutoColorBy={"source"}
                linkOpacity={1}
                //onNodeDragEnd={handleNodeDrag}
                backgroundColor={"rgba(128,128,128,.5)"}
            ></ForceGraph3D>
            <button
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full absolute center-0 left-0"
                onClick={createDummyNode}
            >
                Add a Node!
            </button>
            <div
                ref={provRef}
                className="absolute z-50 top-0 right-0 text-white"
            ></div>
            <div className="grid grid-cols-1 absolute bottom-0 left-0 text-black justify-items-center">
                <textarea id="annoVal"
                                      onChange={(e) => setAnno(e.target.value)}
                                      type="input"
                ></textarea>
                <button
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
                    onClick={addAnnotation}
                >
                    Add Annotation
                </button>
            </div>
            <button
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full absolute bottom-0"
                onClick={playMacro}
            >
                Play Macro
            </button>
        </>
    );

    return Graph;
};

export default GraphComponent;
