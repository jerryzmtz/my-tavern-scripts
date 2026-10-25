<<<<<<< HEAD
import { defineMvuDataStore } from '@/util/mvu';
=======
import { defineMvuDataStore } from '@util/mvu';
>>>>>>> ee3c768ab5d12412115084851bc224c3e0d8a5e5
import { Schema } from '../../schema';

export const useDataStore = defineMvuDataStore(Schema, { type: 'message', message_id: getCurrentMessageId() });
