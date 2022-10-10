import dynamic from "next/dynamic";

const Graph = dynamic(() => import("./graph"), {
    ssr: false,
    loading: () => <></>,
});

export default Graph;
