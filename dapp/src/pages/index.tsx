import { IExecDataProtector } from "@iexec/dataprotector";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import * as Yup from "yup";

const inter = Inter({ subsets: ["latin"] });

interface IFormValues {
    name: string;
}

const initialValues: IFormValues = {
    name: "",
};

export default function Home() {
    const account = useAccount();
    const { open: openConnectModal } = useWeb3Modal();
    const [loading, setLoading] = useState(true);

    // Tips to prevent nextJs error: Hydration failed because the initial UI does not match what was rendered on the server.
    useEffect(() => {
        setLoading(false);
    }, []);

    if (loading) {
        return (
        <div className='pt-16'>
            <p>loading...</p>
        </div>
        );
    }

    const validationSchema = Yup.object({
        name: Yup.string().required("Please provide a name"),
    });

    const onSubmit = async (
        values: IFormValues,
        {
            setSubmitting,
            resetForm,
        }: {
            setSubmitting: (isSubmitting: boolean) => void;
            resetForm: () => void;
        }
    ) => {
        try {
            console.log({values});

            const provider = await account.connector?.getProvider();
            const dataProtector = new IExecDataProtector(provider);

            console.log({account})

            const protectedData = await dataProtector.protectData({
                data: {
                    name: values.name,
                },
            });

            // const protectedData = {
            //     address: "0xEbDCB3F7018812C60023b7dBdD2B66A78b271855"
            // }

            console.log({ protectedData });
            const grantedAccess = await dataProtector.grantAccess({
                protectedData: protectedData.address,
                authorizedApp: process.env
                    .NEXT_PUBLIC_IEXEC_APP_ADDRESS as string,
                authorizedUser: process.env
                    .NEXT_PUBLIC_IEXEC_APP_PLATFORM_PUBLIC_KEY as string,
                numberOfAccess: 99999999999,
            });
            console.log({ grantedAccess });

            const result = await axios.get(
                `/api/hello?name=${values.name}&protectedData=${protectedData.address}`
            );

            console.log({ result });
        } catch (error) {
            console.log(error);
        } finally {
            setSubmitting(false);
            resetForm();
        }
    };

    if (account?.status !== "connected") {
        return (
            <button
                onClick={() => {
                    openConnectModal();
                }}
                type="button"
                className="grow px-5 py-2 rounded-xl bg-info text-base-content hover:bg-base-200  "
            >
                {"Connect first"}
            </button>
        );
    }

    return (
        <main className="flex min-h-screen flex-col items-center p-8 sm:p-24">
            <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
                <h1 className="text-5xl relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert">
                    Hello scone
                </h1>
            </div>
            <div className="mt-10 w-full">
                <Formik
                    initialValues={initialValues}
                    onSubmit={onSubmit}
                    validationSchema={validationSchema}
                >
                    {({ isSubmitting, setFieldValue }) => (
                        <Form>
                            <div className="grid grid-cols-1 gap-6 border border-info rounded-xl p-6 bg-base-100">
                                <label className="block">
                                    <span className="text-base-content">
                                        Name
                                    </span>
                                    <Field
                                        type="text"
                                        id="name"
                                        name="name"
                                        className="mt-1 mb-1 block w-full rounded-xl border border-info bg-base-200 shadow-sm focus:ring-opacity-50 text-black"
                                        placeholder=""
                                    />
                                    <span className="text-red-900">
                                        <ErrorMessage name="name" />
                                    </span>
                                </label>

                                <button className="bg-white px-3 py-1.5 text-black text-xs rounded-full">
                                    {isSubmitting
                                        ? "submitting"
                                        : "Protect your data and execute"}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </main>
    );
}
