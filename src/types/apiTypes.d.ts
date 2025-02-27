import { DecodedData } from '@/utils/getUser';

export interface CustomRequest extends Request {
  headers: Request['headers'] & {
    tokenData: DecodedData;
  };
}
