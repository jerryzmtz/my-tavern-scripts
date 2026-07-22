<<<<<<< HEAD
import { defineMvuDataStore } from '@/util/mvu';
=======
import { defineMvuDataStore } from '@util/mvu';
>>>>>>> f24091c9a91d583dafdb4867d858268ebc487545
import { Schema } from '../../schema';

export const useDataStore = defineMvuDataStore(Schema, { type: 'message', message_id: getCurrentMessageId() });
