import type { NextApiRequest, NextApiResponse } from 'next'
import { IExecDataProtector, ProcessProtectedDataParams, getWeb3Provider } from '@iexec/dataprotector';

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

  const name = req.query.name as string || 'scone';

  try {
    const web3Provider = getWeb3Provider(privateKey);
    const dataProtector = new IExecDataProtector(web3Provider);

    console.log({
      dataProtector
    })

    const args: ProcessProtectedDataParams = {
      protectedData: '0x',
      app: appAddress,
      maxPrice: 0,
      args: name,
      inputFiles: undefined,
      secrets: undefined
    }
    
    await dataProtector.processProtectedData(args);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error as string });
  }

  res.status(200).json({ result: 'Hello scone' })
}
