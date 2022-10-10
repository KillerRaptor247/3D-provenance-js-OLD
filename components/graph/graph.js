import {ProvVisCreator} from '@visdesignlab/trrack-vis'
import {initProvenance, createAction} from '@visdesignlab/trrack'
import React, { useState, useCallback, useEffect, useMemo} from "react"
import ForceGraph3D, {ForceGraphMethods} from 'react-force-graph-3d';
import { useAtom, atom } from "jotai"

import myData from "../../data/data.json"




// Graph Generation
const GraphComponent = ({graphRef}) => {

    const [selectedNode, setSelectedNode] = useState();
    const [dimensions, setDimensions] = useState({width: 0, height: 0});

    const AtomNotInitialized = new Error("This atom has not been initialized");
    var initCoordsAtom = atom({ x: null, y: null, z: null });
    var initRotationAtom = atom(AtomNotInitialized);

    const [initCoords, setInitCoords] = useAtom(initCoordsAtom);
    const [initRotation, setInitRotation] = useAtom(initRotationAtom);

    const nodes = myData.nodes.map((node) => node.id);


   // var prov = initProvenance([selectedNode, setSelectedNode], {loadFromUrl: false});
    //prov.addObserver((selectedNode) => selectedNode, handleNodeClick);
    //prov.done();

    useEffect(() => {
        setDimensions({
            width: window.innerWidth,
            height: window.innerHeight,
        });

        let {x, y, z} = graphRef.current.cameraPosition();

        setInitCoords({ x, y, z });
        setInitRotation(graphRef.current.camera().quaternion);
    }, []);

    // Create function to pass to the ProvVis library for when a node is selected in the graph.
    // For our purposes, were simply going to jump to the selected node.
   // const visCallback = (newNode) => {
     //   prov.goToNode(newNode);
    //};

    // Setup ProvVis once initially
    //ProvVisCreator(document.getElementById('provDiv'), prov, visCallback);

   /* const selectAction = createAction((selectedNode) => {
        setSelectedNode(selectedNode);
        selectAction.setLabel(`${selectedNode} Selected`);
        prov.apply(selectAction(newSelected));
    })*/


    const handleNodeClick = useCallback((node) => {
        if (node != null){
            //selectAction(node);
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
                detail: {node: node}
            });
            document.dispatchEvent(event);
        }
    },
        [graphRef]
    );

        const Graph = (
            <ForceGraph3D
                graphData={myData}
                nodeLabel="name"
                ref={graphRef}
                // select the node on left click
                onNodeClick={handleNodeClick}
                onNodeRightClick={(node, e) => {
                    setSelectedNode(node);
                    console.log(node);
                }
                }
                backgroundColor={"rgba(0,0,0,0)"}
            ></ForceGraph3D>);
        return Graph;

}

 export default GraphComponent;
