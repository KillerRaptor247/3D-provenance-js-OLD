import {atom, useAtom} from "jotai"
import data from "../data/data.json"
import {useRef, useState} from "react"
import {initProvenance}from "@visdesignlab/trrack";
import {ProvVisCreator, ProvVis} from "@visdesignlab/trrack-vis"

/*
 * Jotai is a global state management library. We do this by defining
 * atoms and accessing them using hooks in our components (typically useAtom).
 *
 * Define your global atoms here for convenient lookup
 *
 * https://jotai.org/docs/basics/primitives
 */

const AtomNotInitialized = new Error("This atom has not been initialized");



//export const [provState, setProvState] = useState({node: null});

const nodeAtom = atom({node: null});
export const provStateAtom =
    atom((get) => get(nodeAtom),
        (get, set, newNode) => {
            set(nodeAtom, newNode);
        }
    );
const prov = initProvenance(provStateAtom, { loadFromUrl:false });
prov.addObserver((provStateAtom) => provStateAtom, () => {console.log("The provStateAtom has been changed")});
prov.done();

export const provVisAtom = atom(null);
export const graphDataAtom = atom(data);
export const initCoordsAtom = atom({ x: null, y: null, z: null });
export const initRotationAtom = atom(AtomNotInitialized);
export const provenanceAtom = atom(prov);
