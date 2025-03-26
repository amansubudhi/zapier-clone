import { useEffect, useState } from "react";
import Appbar from "../components/Appbar";
import DarkButton from "../components/buttons/DarkButton";
import axios from "axios";
import { BACKEND_URL, HOOKS_URL } from "../config";
import LinkButton from "../components/buttons/LinkButton";
import { useNavigate } from "react-router";

interface Zap {
    "id": string,
    "triggerId": string,
    "userId": number,
    "actions": {
        "id": string,
        "zapId": string,
        "actionId": string,
        "sortingOrder": number,
        "type": {
            "id": string,
            "name": string,
            "image": string
        }
    }[],
    "trigger": {
        "id": string,
        "zapId": string,
        "triggerId": string,
        "type": {
            "id": string,
            "name": string,
            "image": string
        }
    }
}

function useZaps() {
    const [loading, setLoading] = useState(true);
    const [zaps, setZaps] = useState<Zap[]>([]);

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/zap`, {
            headers: {
                "Authorization": localStorage.getItem("token")
            }
        })
            .then(res => {
                setZaps(res.data.zaps);
                setLoading(false)
            })
    }, []);

    return {
        loading, zaps
    }
}

export default function Dashboard() {
    const navigate = useNavigate();

    const { loading, zaps } = useZaps();
    return (
        <div>
            <Appbar />
            <div className="flex justify-center pt-8">
                <div className="max-w-screen-lg w-full">
                    <div className="flex justify-between pr-8">
                        <div className="text-xl font-bold">
                            My Zaps
                        </div>
                        <DarkButton onClick={() => {
                            navigate("/zap/create")
                        }}>Create</DarkButton>
                    </div>
                </div>
            </div>
            {loading ? "Loading..." : <div className="flex justify-center w-full"> <ZapTable zaps={zaps} />
            </div>}
        </div>
    )
}


function ZapTable({ zaps }: { zaps: Zap[] }) {
    const navigate = useNavigate();

    return <div className="p-8 max-w-screen-lg w-full">
        <div className="flex">
            <div className="flex-1">Name</div>
            <div className="flex-1">ID</div>
            <div className="flex-1">Created at</div>
            <div className="flex-1">Webhook URL</div>
            <div className="flex-1">Go</div>
        </div>
        {zaps.map(z => <div className="flex border-b border-t py-4">
            <div className="flex-1 flex"><img src={z.trigger.type.image} className="w-[30px] h-[30px]" /> {z.actions.map(x =>
                <img src={x.type.image} className="w-[30px] h-[30px]" />)}</div>
            <div className="flex-1">{z.id}</div>
            <div className="flex-1">March 23, 2023</div>
            <div className="flex-1">{`${HOOKS_URL}/catch/1/${z.id}`}</div>
            <div className="flex-1"><LinkButton onClick={() => {
                navigate("/zap/" + z.id)
            }}>Go</LinkButton></div>
        </div>)}
    </div>
}
