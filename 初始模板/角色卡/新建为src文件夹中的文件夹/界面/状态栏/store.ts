<<<<<<< HEAD
import { defineMvuDataStore } from '@/util/mvu';
=======
import { defineMvuDataStore } from '@util/mvu';
>>>>>>> 3ff3ec895fe0b8683e26537ccb33fbb96c7c9535
import { Schema } from '../../schema';

export const useDataStore = defineMvuDataStore(Schema, { type: 'message', message_id: getCurrentMessageId() });
