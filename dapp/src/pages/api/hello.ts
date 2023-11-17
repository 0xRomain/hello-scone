import type { NextApiRequest, NextApiResponse } from 'next'
import { IExecDataProtector, ProcessProtectedDataParams, getWeb3Provider } from '@iexec/dataprotector';
import { IExec } from 'iexec';

type Result = {
  result: string
}

type Error = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Result | Error>
) {
  const privateKey = process.env.NEXT_IEXEC_APP_PLATFORM_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error('Private key is not set');
  }

  const appAddress = process.env.NEXT_PUBLIC_IEXEC_APP_ADDRESS;
  if (!appAddress) {
    throw new Error('app address is not set');
  }

  const name = req.query.name;
  const protectedData = req.query.protectedData;

  if (!name || !protectedData) {
    throw new Error('missing query args');
  }

  let result;
  try {
    const web3Provider = getWeb3Provider(privateKey);
    const dataProtector = new IExecDataProtector(web3Provider);

    console.log({
      dataProtector
    })

    const args: ProcessProtectedDataParams = {
      protectedData: protectedData as string,
      app: appAddress,
      maxPrice: 0,
      args: 'iExec',
      secrets: {
        1: 'ProcessProtectedData test subject',
        2: 'email content for test processData',
      },
    }
    
    const taskId = await dataProtector.processProtectedData(args);

    // TODO: return task id directly and then long pulling to check if result is there

    const iexec = new IExec({ ethProvider: web3Provider });
    const results = await iexec.task.fetchResults(taskId);
    result = await results.json();

    console.log({
      results,
      result
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error as string });
  }

  res.status(200).json({ result: result || 'no result' })
}
