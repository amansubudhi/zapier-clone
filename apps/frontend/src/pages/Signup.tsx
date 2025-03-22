import Appbar from "../components/Appbar";
import PrimaryButton from "../components/buttons/PrimaryButton";
import CheckFeature from "../components/CheckFeature";
import Input from "../components/Input";

export default function Signup() {
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
                        <Input label={"Name"} onChange={e => {

                        }} type="text" placeholder="Your name" />
                        <Input label={"Email"} onChange={e => {

                        }} type="text" placeholder="Your Email" />
                        <Input label="Password" type="password" onChange={e => {

                        }} placeholder="Password" />
                        <div className="pt-4">
                            <PrimaryButton onClick={() => {

                            }} size="big">Get started free</PrimaryButton>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

