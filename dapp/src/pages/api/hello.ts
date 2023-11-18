import { IExecConsumer, IExecDataProtector, ProcessProtectedDataParams, getWeb3Provider } from '@iexec/dataprotector';
import type { NextApiRequest, NextApiResponse } from 'next';
import { processProtectedData } from '../../iexex';
import { IExec } from 'iexec';

type Result = {
  result: string
}

type Error = {
  message: string
}

// manual debug: http://localhost:3001/api/hello?name=TalentLayer&protectedData=0xEbDCB3F7018812C60023b7dBdD2B66A78b271855
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


    const mode = 'fork';

    let taskId;
    // @ts-ignore
    if(mode === 'official') {
      const args: ProcessProtectedDataParams = {
        protectedData: protectedData as string,
        app: appAddress,
        maxPrice: 0,
        args: 'Genie',
        secrets: {
          1: 'prompt file url',
          2: 'prompt content',
        },
      }
      taskId = await dataProtector.processProtectedData(args);
    } else {
      const iexec = new IExec({ ethProvider: web3Provider });

      const args: IExecConsumer & ProcessProtectedDataParams = {
        iexec: iexec,
        protectedData: protectedData as string,
        app: appAddress,
        maxPrice: 0,
        args: 'GenieFork',
        secrets: {
          1: 'prompt file url',
          2: 'prompt content',
        },
      }
      taskId = await processProtectedData(args);
    }
    
    result = taskId;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error as string });
  }

  res.status(200).json({ result: result || 'no result' })
}
