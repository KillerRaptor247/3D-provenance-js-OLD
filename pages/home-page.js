import React, { useRef } from "react";
import Graph from "../components/graph/graphWrapper";
import { useRouter } from "next/router";

// render the graph page
export default function MainPage() {
    const graphRef = useRef();
    const router = useRouter();
    return (

        <div className="flex flex-row justify-center items-center w-full h-screen relative z-10 bg-black text-gray-50 overflow-x-clip">
            <Graph graphRef={graphRef}/>
            <button
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full absolute bottom-2 left-2"
                onClick={() => router.push("/")}
            >
                Return to Phrog Login
            </button>
            <h1 className="font-large leading-normal text-5xl text-green-800 absolute top-1 left-1">
                Welcome Provenance Tracking Frog
            </h1>
        </div>
    );
}
