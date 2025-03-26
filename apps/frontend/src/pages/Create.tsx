import { useState } from "react";
import Appbar from "../components/Appbar";
import ZapCell from "../components/ZapCell";
import PrimaryButton from "../components/buttons/PrimaryButton";
import Modal from "../components/Modal";
import useAvailableActionsAndTriggers from "../hooks/useAvailableActionsAndTriggers";
import axios from "axios";
import { useNavigate } from "react-router";
import { BACKEND_URL } from "../config";

export default function Create() {
    const navigate = useNavigate();
    const { availableActions, availableTriggers } = useAvailableActionsAndTriggers();
    const [selectedTrigger, setSelectedTrigger] = useState<{
        id: string;
        name: string;
    }>();

    const [selectedActions, setSelectedActions] = useState<{
        index: number;
        availableActionId: string;
        availableActionName: string;
    }[]>([]);
    const [selectedModalIndex, setSelectedModalIndex] = useState<null | number>(null);

    return (
        <div>
            <Appbar />
            <div className="flex justify-end p-4">
                <PrimaryButton onClick={async () => {
                    if (!selectedTrigger?.id) {
                        return;
                    }

                    const response = await axios.post(`${BACKEND_URL}/api/v1/zap`, {
                        "availableTriggerId": selectedTrigger.id,
                        "triggerMetadata": {},
                        "actions": selectedActions.map(a => ({
                            availableActionId: a.availableActionId,
                            actionMetadata: {}
                        }))
                    }, {
                        headers: {
                            Authorization: localStorage.getItem("token")
                        }
                    })

                    navigate("/dashboard")
                }}>Publish</PrimaryButton>
            </div>
            <div className="w-full min-h-screen bg-slate-200 flex flex-col justify-center">
                <div className="flex justify-center w-full">
                    <ZapCell onClick={() => {
                        setSelectedModalIndex(1);
                    }} name={selectedTrigger?.name ? selectedTrigger.name : "Trigger"} index={1} />
                </div>
                <div className="w-full pt-2 pb-2">
                    {selectedActions.map((action, index) => <div className="pt-2 flex justify-center">
                        <ZapCell onClick={() => {
                            setSelectedModalIndex(action.index);
                        }} name={action.availableActionName ?
                            action.availableActionName : "Action"} index={action.index} /> </div>)}
                </div>
                <div className="flex justify-center">
                    <div>
                        <PrimaryButton onClick={() => {
                            setSelectedActions(a => [...a, {
                                index: a.length + 2,
                                availableActionId: "",
                                availableActionName: ""
                            }])
                        }}><div className="text-2xl">
                                +
                            </div></PrimaryButton>
                    </div>
                </div>
            </div>
            {selectedModalIndex && <Modal availableItems={selectedModalIndex === 1 ? availableTriggers : availableActions} onSelect={(props: null | { name: string, id: string }) => {
                if (props === null) {
                    setSelectedModalIndex(null);
                    return;
                }
                if (selectedModalIndex === 1) {
                    setSelectedTrigger({
                        id: props.id,
                        name: props.name
                    })
                } else {
                    setSelectedActions(a => {
                        let newActions = [...a];
                        newActions[selectedModalIndex - 2] = {
                            index: selectedModalIndex,
                            availableActionId: props.id,
                            availableActionName: props.name
                        }
                        return newActions
                    })
                }

            }} index={selectedModalIndex} />}
        </div>
    )
}
