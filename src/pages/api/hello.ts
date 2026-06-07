import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  message: string;
  timestamp: string;
};

export default function handler(_req: NextApiRequest, res: NextApiResponse<Data>) {
  res.status(200).json({
    message: 'Hello from Next.js API',
    timestamp: new Date().toISOString(),
  });
}
