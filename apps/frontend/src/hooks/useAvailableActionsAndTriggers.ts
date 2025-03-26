import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";

export default function useAvailableActionsAndTriggers() {
    const [availableActions, setAvailableActions] = useState([]);
    const [availableTriggers, setAvailableTriggers] = useState([]);

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/trigger/available`)
            .then(x => setAvailableTriggers(x.data.availableTriggers))

        axios.get(`${BACKEND_URL}/api/v1/action/available`)
            .then(x => setAvailableActions(x.data.availableActions))
    }, [])

    return {
        availableActions,
        availableTriggers
    }
}
