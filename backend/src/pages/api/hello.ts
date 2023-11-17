import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  result: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ result: 'Hello scone' })
}
