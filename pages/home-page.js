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
        </div>
    );
}
