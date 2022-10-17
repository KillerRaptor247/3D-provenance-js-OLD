/*import {initializeTrrack, Registry} from "@trrack/core";
import {useMemo} from "react";

const {registry, actions} = useMemo(() => {
    const reg = Registry.create();

    const selectNode = reg.register('Select-Node', (selectedNode, node) => {
        console.log("Node Selected");
        console.log(node);
        setSelectedNode(node);
    })

    return{
        registry: reg,
        actions: {
            selectNode,
        }
    }
}, []);

const trrack = useMemo(() => {
    const t = initializeTrrack({
        selectedNode,
        registry,
    });

    t.currentChange(() => {
        setSelectedNode(t.current.state.val);
    });

    return t;
}, [registry]);

const current = useMemo(() => {
    return trrack.current;
}, [trrack]);*/