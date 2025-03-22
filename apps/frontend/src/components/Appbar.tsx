import { useNavigate } from "react-router"
import LinkButton from "./buttons/LinkButton"
import PrimaryButton from "./buttons/PrimaryButton";

export default function Appbar() {
    const navigate = useNavigate();
    return (
        <div className="flex border-b justify-between p-4">
            <div className="flex flex-col justify-center text-2xl font-extrabold">
                Zapier
            </div>
            <div className="flex gap-4">
                <LinkButton onClick={() => { }}>Contact Sales</LinkButton>
                <LinkButton onClick={() => {
                    navigate("/login")
                }}>Login</LinkButton>
                <PrimaryButton onClick={() => {
                    navigate("/signup")
                }}>
                    Signup
                </PrimaryButton>

            </div>
        </div>
    )
}