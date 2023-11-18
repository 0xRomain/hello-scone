import {
    addressOrEnsOrAnySchema,
    positiveNumberSchema,
    secretsSchema,
    stringSchema,
    throwIfMissing,
    urlArraySchema,
} from "./utils/validators";
import {
    IExecConsumer,
    ProcessProtectedDataParams,
} from "@iexec/dataprotector";
import { WorkflowError } from "./utils/error";
import { fetchOrdersUnderMaxPrice } from "./utils/fetchOrdersUnderMaxPrice";
import { pushRequesterSecret } from "./utils/pushRequesterSecret";

export const WORKERPOOL_ADDRESS = "debug-v8-bellecour.main.pools.iexec.eth";
// export const WORKERPOOL_ADDRESS = "prod-v8-bellecour.main.pools.iexec.eth";
export const SCONE_TAG = ["tee", "scone"];
export const DEFAULT_MAX_PRICE = 0;

export const processProtectedData = async ({
    iexec = throwIfMissing(),
    protectedData = throwIfMissing(),
    app = throwIfMissing(),
    maxPrice = DEFAULT_MAX_PRICE,
    args,
    inputFiles,
    secrets,
}: IExecConsumer & ProcessProtectedDataParams): Promise<string> => {
    try {
        const requester = await iexec.wallet.getAddress();
        const vApp = addressOrEnsOrAnySchema()
            .required()
            .label("authorizedApp")
            .validateSync(app);
        const vProtectedData = addressOrEnsOrAnySchema()
            .required()
            .label("protectedData")
            .validateSync(protectedData);
        const vMaxPrice = positiveNumberSchema()
            .label("maxPrice")
            .validateSync(maxPrice);
        const vInputFiles = urlArraySchema()
            .label("inputFiles")
            .validateSync(inputFiles);
        const vArgs = stringSchema()
            .label("args")
            .validateSync(args);
        let vSecrets;
        if (secrets) {
            vSecrets = secretsSchema()
                .label("secrets")
                .validateSync(secrets);
        }
        const isIpfsStorageInitialized = await iexec.storage.checkStorageTokenExists(
            requester
        );
        if (!isIpfsStorageInitialized) {
            const token = await iexec.storage.defaultStorageLogin();
            await iexec.storage.pushStorageToken(token);
        }

        const datasetOrderbook = await iexec.orderbook.fetchDatasetOrderbook(
            vProtectedData,
            {
                app: vApp,
                requester,
            }
        );
        const appOrderbook = await iexec.orderbook.fetchAppOrderbook(vApp, {
            dataset: protectedData,
            requester,
            minTag: SCONE_TAG,
            maxTag: SCONE_TAG,
            workerpool: WORKERPOOL_ADDRESS,
        });
        const workerpoolOrderbook = await iexec.orderbook.fetchWorkerpoolOrderbook(
            {
                workerpool: WORKERPOOL_ADDRESS,
                app: vApp,
                dataset: vProtectedData,
                minTag: SCONE_TAG,
                maxTag: SCONE_TAG,
            }
        );

        const underMaxPriceOrders = fetchOrdersUnderMaxPrice(
            datasetOrderbook,
            appOrderbook,
            workerpoolOrderbook,
            vMaxPrice
        );

        console.log("step1", {
            datasetOrderbook,
            appOrderbook,
            workerpoolOrderbook,
            underMaxPriceOrders,
        });

        let secretsId;
        if (vSecrets) {
            secretsId = await pushRequesterSecret(iexec, vSecrets);
        }
        console.log("step2", {
            secretsId,
        });

        const requestorderToSign = await iexec.order.createRequestorder({
            app: vApp,
            category: underMaxPriceOrders.workerpoolorder.category,
            dataset: vProtectedData,
            appmaxprice: vMaxPrice,
            workerpoolmaxprice: vMaxPrice,
            tag: SCONE_TAG,
            workerpool: WORKERPOOL_ADDRESS,
            params: {
                // @ts-ignore
                iexec_input_files: vInputFiles,
                iexec_developer_logger: true,
                iexec_secrets: secretsId,
                iexec_args: vArgs,
            },
        });

        console.log("step3", {
            requestorderToSign,
        });

        const requestorder = await iexec.order.signRequestorder(
            requestorderToSign
        );

        console.log("step4", {
            requestorder,
        });

        const { dealid } = await iexec.order.matchOrders({
            requestorder,
            ...underMaxPriceOrders,
        });

        console.log("step5", {
            dealid,
        });

        return await iexec.deal.computeTaskId(dealid, 0);
    } catch (error) {
        // @ts-ignore
        throw new WorkflowError(`${error.message}`, error);
    }
};
