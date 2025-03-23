import { useState } from "react";
import Appbar from "../components/Appbar";
import PrimaryButton from "../components/buttons/PrimaryButton";
import CheckFeature from "../components/CheckFeature";
import Input from "../components/Input";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    return (
        <div>
            <Appbar />
            <div className="flex justify-center">
                <div className="flex pt-8 max-w-4xl">
                    <div className="flex-1 pt-20 px-4">
                        <div className="font-semibold text-3xl pb-4">
                            Join millions worldwide who automate their work using Zapier.
                        </div>
                        <div className="pb-6 pt-4">
                            <CheckFeature label={"Easy setup, no coding required"} />
                        </div>
                        <div className="pb-6">
                            <CheckFeature label={"Free forever for core features"} />
                        </div>
                        <div className="pb-6">
                            <CheckFeature label={"14-day trial of premium features & apps"} />
                        </div>

                    </div>
                    <div className="flex-1 pt-6 pb-6 mt-12 px-4 border rounded">
                        <Input label={"Email"} onChange={e => {
                            setEmail(e.target.value)
                        }} type="text" placeholder="Your Email" />
                        <Input label="Password" type="password" onChange={e => {
                            setPassword(e.target.value)
                        }} placeholder="Password" />
                        <div className="pt-4">
                            <PrimaryButton onClick={async () => {
                                const res = await axios.post(`${BACKEND_URL}/api/v1/user/signin`, {
                                    username: email,
                                    password,
                                });
                                localStorage.setItem("token", res.data.token)
                                navigate("/dashboard")
                            }} size="big">Login</PrimaryButton>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

