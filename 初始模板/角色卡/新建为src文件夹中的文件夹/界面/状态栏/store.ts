<<<<<<< HEAD
import { defineMvuDataStore } from '@/util/mvu';
=======
import { defineMvuDataStore } from '@util/mvu';
>>>>>>> cf09cb02c590de46d565966e950150bafcf24c54
import { Schema } from '../../schema';

export const useDataStore = defineMvuDataStore(Schema, { type: 'message', message_id: getCurrentMessageId() });
