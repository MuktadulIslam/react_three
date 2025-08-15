import { DraggableObjectGroup } from "./types";
import BoxObject from "../../objects/BoxObject"
import Car from "../../objects/Car"
import CarModel from "../../objects/Car2"
import Chair from "../../objects/Chair"
import ChildrenTableModel from "../../objects/ChildrenTableModel"
import CustomObject from "../../objects/CustomObject"
import Table from "../../objects/Table"
import TableModel from "../../objects/TableModel"
import DeskSign from "../../objects/craftxr/DeskSign"
import DisabilityButton from "../../objects/craftxr/DisabilityButton"
import FaxMachine from "../../objects/craftxr/FaxMachine"
import Keyboard from "../../objects/craftxr/Keyboard"
import Monitor from "../../objects/craftxr/Monitor"
import Monstera from "../../objects/craftxr/Monstera"
import Mouse from "../../objects/craftxr/Mouse"
import MudMat from "../../objects/craftxr/MudMat"
import OldRecepDesk from "../../objects/craftxr/OldRecepDesk"
import Pen from "../../objects/craftxr/Pen"
import Printer from "../../objects/craftxr/Printer"
import ReceptionDesk from "../../objects/craftxr/ReceptionDesk"
import Succulent from "../../objects/craftxr/Succulent"
import TissueBox from "../../objects/craftxr/TissueBox"
import WaitingBench from "../../objects/craftxr/WaitingBench"
import Wheelchair from "../../objects/craftxr/Wheelchair"

export const sidebarStaticObjectGroups: DraggableObjectGroup[] = [
    {
        id: 'vehicles',
        name: 'Vehicles',
        icon: '🚗',
        color: 'from-blue-500 to-cyan-500',
        objects: [
            {
                id: 'car',
                component: <Car />,
                name: 'Car',
                icon: '🚗',
                description: 'Simple car object'
            },
            {
                id: 'car-2',
                component: <CarModel />,
                name: 'GLB Car Model',
                icon: '🏎️',
                description: 'Detailed car model'
            }
        ]
    },
    {
        id: 'furniture',
        name: 'Furniture',
        icon: '🪑',
        color: 'from-amber-500 to-orange-500',
        objects: [
            {
                id: 'table',
                component: <Table />,
                name: 'Table',
                icon: '🪑',
                description: 'Basic table geometry'
            },
            {
                id: 'table model',
                component: <TableModel />,
                name: 'GLB Table Model',
                icon: '🗂️',
                description: 'Detailed table model'
            },
            {
                id: 'children table model',
                component: <ChildrenTableModel />,
                name: 'GLB Children Table',
                icon: '🧸',
                description: 'Child-sized table model'
            },
            {
                id: 'chair',
                component: <Chair />,
                name: 'Chair',
                icon: '💺',
                description: 'Basic chair geometry'
            }
        ]
    },
    {
        id: 'primitives',
        name: 'Primitives',
        icon: '📦',
        color: 'from-green-500 to-emerald-500',
        objects: [
            {
                id: 'box',
                component: <BoxObject />,
                name: 'Box',
                icon: '📦',
                description: 'Basic cube geometry'
            }
        ]
    },
    {
        id: 'custom',
        name: 'Custom',
        icon: '⚡',
        color: 'from-purple-500 to-pink-500',
        objects: [
            {
                id: 'custom',
                component: <CustomObject />,
                name: 'Custom Object',
                icon: '⚡',
                description: 'Custom 3D object'
            }
        ]
    },
    {
        id: 'xr-models',
        name: 'XR-Models',
        icon: '🏢',
        color: 'from-indigo-500 to-purple-500',
        objects: [
            {
                id: 'desk-sign',
                component: <DeskSign />,
                name: 'Desk Sign',
                icon: '🪧',
                description: 'Desktop nameplate or information sign'
            },
            {
                id: 'disability-button',
                component: <DisabilityButton />,
                name: 'Accessibility Button',
                icon: '♿',
                description: 'Disability access button for doors'
            },
            {
                id: 'fax-machine',
                component: <FaxMachine />,
                name: 'Fax Machine',
                icon: '📠',
                description: 'Office fax machine'
            },
            {
                id: 'keyboard',
                component: <Keyboard />,
                name: 'Keyboard',
                icon: '⌨️',
                description: 'Computer keyboard'
            },
            {
                id: 'monitor',
                component: <Monitor />,
                name: 'Monitor',
                icon: '🖥️',
                description: 'Computer display monitor'
            },
            {
                id: 'monstera',
                component: <Monstera />,
                name: 'Monstera Plant',
                icon: '🌱',
                description: 'Decorative monstera house plant'
            },
            {
                id: 'mouse',
                component: <Mouse />,
                name: 'Computer Mouse',
                icon: '🖱️',
                description: 'Computer pointing device'
            },
            {
                id: 'mud-mat',
                component: <MudMat />,
                name: 'Floor Mat',
                icon: '🧽',
                description: 'Entrance floor mat'
            },
            {
                id: 'old-reception-desk',
                component: <OldRecepDesk />,
                name: 'Vintage Reception Desk',
                icon: '🗃️',
                description: 'Classic style reception desk'
            },
            {
                id: 'pen',
                component: <Pen />,
                name: 'Pen',
                icon: '🖊️',
                description: 'Writing pen'
            },
            {
                id: 'printer',
                component: <Printer />,
                name: 'Printer',
                icon: '🖨️',
                description: 'Office printer'
            },
            {
                id: 'reception-desk',
                component: <ReceptionDesk />,
                name: 'Reception Desk',
                icon: '🏪',
                description: 'Modern reception desk'
            },
            {
                id: 'succulent',
                component: <Succulent />,
                name: 'Succulent Plant',
                icon: '🌵',
                description: 'Small decorative succulent'
            },
            {
                id: 'tissue-box',
                component: <TissueBox />,
                name: 'Tissue Box',
                icon: '📄',
                description: 'Box of tissues'
            },
            {
                id: 'waiting-bench',
                component: <WaitingBench />,
                name: 'Waiting Bench',
                icon: '🪑',
                description: 'Seating bench for waiting areas'
            },
            {
                id: 'wheelchair',
                component: <Wheelchair />,
                name: 'Wheelchair',
                icon: '♿',
                description: 'Mobility wheelchair'
            }
        ]
    }
];