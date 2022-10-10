import Link from "next/link";
import React, { useRef } from "react";
import ReactDom from "react-dom";
import Head from "next/head";
import Graph from "../components/graph/graphWrapper";
import { ForceGraph3D } from "react-force-graph-3d";
import myData from "../data/data.json";
import { useRouter } from "next/router";

// render the graph page
export default function MainPage() {
    const graphRef = useRef();
    const router = useRouter();
    return (
        <div className="bg-black relative">
            <h1 className="font-large leading-normal text-5xl text-green-800 absolute top-1 left-1">
                Welcome Provenance Tracking Frog
            </h1>
            <Graph graphRef={graphRef} />
            <button
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full absolute bottom-2 left-2"
                onClick={() => router.push("/")}
            >
                Return to Phrog Login
            </button>
            {/* <div id="provDiv"></div> */}
        </div>
        //<div className="grid grid-flow-row grid-cols-1 justify-center">
        //  <h1 className= "font-large leading-normal text-5xl text-green-800">Welcome Provenance Tracking Frog</h1>
        //<Link href="/">
        //  <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full">
        //    Return to Phrog Login
        //</button>
        //</Link>
        //</div>
    );
}
